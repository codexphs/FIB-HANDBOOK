<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  jsonResponse([ 'success' => false, 'message' => 'POST requests only.' ], 405);
}

$action = $_GET['action'] ?? '';
$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$discord = trim($payload['discord'] ?? '');
$pass = $payload['pass'] ?? '';

if ($action === 'login') {
  if ($discord === '' || $pass === '') {
    jsonResponse([ 'success' => false, 'message' => 'Discord and password are required.' ], 400);
  }

  $stmt = $pdo->prepare('SELECT id, discord, ingame, password, status, role, registeredAt FROM agents WHERE LOWER(discord) = LOWER(?) LIMIT 1');
  $stmt->execute([$discord]);
  $agent = $stmt->fetch();

  if (!$agent || $agent['password'] !== $pass) {
    jsonResponse([ 'success' => false, 'message' => 'Invalid credentials. Access denied.' ], 401);
  }

  if ($agent['status'] === 'suspended') {
    jsonResponse([ 'success' => false, 'message' => 'Account suspended. Contact administration.' ], 403);
  }

  if ($agent['status'] === 'pending') {
    jsonResponse([ 'success' => false, 'message' => 'Application pending approval. Please wait for clearance.' ], 403);
  }

  unset($agent['password']);
  jsonResponse([ 'success' => true, 'user' => $agent ]);
}

if ($action === 'register') {
  $ingame = trim($payload['ingame'] ?? '');
  $pass2 = $payload['pass2'] ?? '';

  if ($discord === '' || $ingame === '' || $pass === '' || $pass2 === '') {
    jsonResponse([ 'success' => false, 'message' => 'All fields are required.' ], 400);
  }

  if (strlen($pass) < 6) {
    jsonResponse([ 'success' => false, 'message' => 'Password must be at least 6 characters.' ], 400);
  }

  if ($pass !== $pass2) {
    jsonResponse([ 'success' => false, 'message' => 'Passwords do not match.' ], 400);
  }

  $stmt = $pdo->prepare('SELECT id FROM agents WHERE LOWER(discord) = LOWER(?) LIMIT 1');
  $stmt->execute([$discord]);
  if ($stmt->fetch()) {
    jsonResponse([ 'success' => false, 'message' => 'Discord ID already registered.' ], 409);
  }

  $stmt = $pdo->prepare('INSERT INTO agents (discord, ingame, password, status, role, registeredAt) VALUES (?, ?, ?, ?, ?, ?)');
  $stmt->execute([
    $discord,
    $ingame,
    $pass,
    'pending',
    'Intern',
    date('Y-m-d'),
  ]);

  jsonResponse([ 'success' => true, 'message' => 'Registration successful. Awaiting approval.' ]);
}

jsonResponse([ 'success' => false, 'message' => 'Unknown action.' ], 400);
