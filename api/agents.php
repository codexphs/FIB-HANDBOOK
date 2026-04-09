<?php
require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
  $stmt = $pdo->query('SELECT id, discord, ingame, status, role, registeredAt FROM agents ORDER BY id ASC');
  $agents = $stmt->fetchAll();
  jsonResponse([ 'success' => true, 'agents' => $agents ]);
}

if ($action === 'clear') {
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse([ 'success' => false, 'message' => 'POST requests only.' ], 405);
  }

  $pdo->beginTransaction();
  $pdo->exec("DELETE FROM agents WHERE discord <> 'director'");
  $pdo->commit();

  jsonResponse([ 'success' => true, 'message' => 'Cleared agents except director.' ]);
}

jsonResponse([ 'success' => false, 'message' => 'Unknown action.' ], 400);
