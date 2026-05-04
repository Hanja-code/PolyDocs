<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../fonction/fonction.php';

// Connexion à la BDD
$bdd = connexion_bdd();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = addNewDocument($bdd);

    // Si succès, renvoyer l'ID pour l'ajout instantané côté JS
    if ($result['status'] === 'success') {
        $result['id'] = $bdd->lastInsertId();
    }

    echo json_encode($result);
    exit;
}

echo json_encode([
    'status' => 'error',
    'message' => 'Requête invalide'
]);
?>
