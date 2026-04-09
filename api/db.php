<?php
header('Content-Type: application/json; charset=utf-8');

// Update these values for your phpMyAdmin / MySQL setup.
$DB_HOST = '127.0.0.1';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'fib_handbook';

try {
  $pdo = new PDO(
    "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
    $DB_USER,
    $DB_PASS,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
  );
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([ 'success' => false, 'message' => 'Database connection failed: ' . $e->getMessage() ]);
  exit;
}

function jsonResponse($payload, $status = 200) {
  http_response_code($status);
  echo json_encode($payload);
  exit;
}

function seedAdmin(PDO $pdo) {
  $stmt = $pdo->prepare('SELECT id FROM agents WHERE discord = ? LIMIT 1');
  $stmt->execute(['director']);
  if ($stmt->fetch() === false) {
    $stmt = $pdo->prepare('INSERT INTO agents (discord, ingame, password, status, role, registeredAt) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([
      'director',
      'Director General',
      'nbi1234',
      'active',
      'Director',
      date('Y-m-d'),
    ]);
  }
}

seedAdmin($pdo);
