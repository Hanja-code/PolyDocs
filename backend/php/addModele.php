<?php
require_once '../fonction/fonction.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = addNewModel($bdd);
    echo json_encode($result);
    exit;
}

echo json_encode([
    'status' => 'error',
    'message' => 'Requête invalide'
]);
?>