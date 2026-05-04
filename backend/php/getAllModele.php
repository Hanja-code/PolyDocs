<?php 
require '../fonction/fonction.php';

$modele = getAllModele();
echo json_encode($modele)
?>