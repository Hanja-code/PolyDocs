<?php
require_once '../fonction/fonction.php';

header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = deleteModele($bdd); // Utilise la fonction déjà corrigée dans fonction.php
    echo json_encode($result);
    exit;
}

// Si la requête n'est pas POST
echo json_encode([
    'status' => 'error',
    'message' => 'Requête invalide'
]);
