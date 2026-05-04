<?php 
function connexion_bdd(){
    try {
        $bdd = new PDO("mysql:host=localhost;dbname=polydocs;charset=utf8mb4", "root", "");
        $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // echo "Connexion réussie";               
    } catch (PDOException $error) {
        echo "Connexion échouée : " . $error->getMessage();
        exit;
    }
    return $bdd;
}
?>
