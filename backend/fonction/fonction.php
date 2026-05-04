<?php
require_once __DIR__ . '/serveur.php';

$bdd = connexion_bdd();

/* =========================
   AJOUT DOCUMENT
========================= */
function addNewDocument($bdd) {
    try {
        $titre       = $_POST['titre'] ?? null;
        $description = $_POST['description'] ?? '';
        $icon        = $_POST['icon'] ?? 'fa-file-lines';
        $is_multi    = isset($_POST['is_multi']) ? (int)$_POST['is_multi'] : 0;
        $url_direct  = $_POST['url_direct'] ?? null;
        $details_doc = $_POST['details_doc'] ?? '';

        if (!$titre) {
            throw new Exception("Le titre est obligatoire.");
        }

        $sql = "INSERT INTO categories (titre, description, icon, is_multi, url_direct, details_doc)
                VALUES (:titre, :description, :icon, :is_multi, :url_direct, :details_doc)";
        $stmt = $bdd->prepare($sql);
        $stmt->execute([
            ':titre'       => $titre,
            ':description' => $description,
            ':icon'        => $icon,
            ':is_multi'    => $is_multi,
            ':url_direct'  => ($is_multi === 1 ? null : $url_direct),
            ':details_doc' => $details_doc
        ]);

        $lastId = $bdd->lastInsertId(); // récupérer l'ID

        return ['status' => 'success', 'message' => 'Catégorie ajoutée avec succès', 'id' => $lastId];

    } catch (Exception $e) {
        return ['status' => 'error', 'message' => $e->getMessage()];
    }
}


/* =========================
   AJOUT MODELE
========================= */
function addNewModel($bdd) {
    try {
        $titre       = trim($_POST['titre'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $icon        = $_POST['icon'] ?? 'fa-file-lines';
        $file_path   = trim($_POST['file_path'] ?? '');
        $category_id = intval($_POST['category_id'] ?? 0);
        $details_mod = trim($_POST['details_mod'] ?? '');

        if (!$titre || !$file_path || !$category_id) {
            throw new Exception("Champs obligatoires manquants.");
        }

        $sql = "INSERT INTO models (category_id, titre, description, icon, file_path, details_mod)
                VALUES (:category_id, :titre, :description, :icon, :file_path, :details_mod)";

        $stmt = $bdd->prepare($sql);
        $stmt->execute([
            ':category_id' => $category_id,
            ':titre'       => $titre,
            ':description' => $description,
            ':icon'        => $icon,
            ':file_path'   => $file_path,
            ':details_mod' => $details_mod
        ]);

        return ['status' => 'success', 'message' => 'Modèle ajouté avec succès', 'id' => $bdd->lastInsertId()];

    } catch (Exception $e) {
        return ['status' => 'error', 'message' => $e->getMessage()];
    }
}

/* =========================
   UPDATE DOCUMENT
========================= */
function updateDocument($bdd) {
    try {
        $id          = intval($_POST['id'] ?? 0);
        $titre       = trim($_POST['titre'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $icon        = $_POST['icon'] ?? 'fa-file-lines';
        $is_multi    = isset($_POST['is_multi']) ? (int)$_POST['is_multi'] : 0;
        $url_direct  = trim($_POST['url_direct'] ?? '');
        $details_doc = trim($_POST['details_doc'] ?? '');

        if (!$id || !$titre) {
            throw new Exception("ID et titre obligatoires.");
        }

        $sql = "UPDATE categories SET titre=:titre, description=:description, icon=:icon, 
                is_multi=:is_multi, url_direct=:url_direct, details_doc=:details_doc
                WHERE id=:id";

        $stmt = $bdd->prepare($sql);
        $stmt->execute([
            ':id'          => $id,
            ':titre'       => $titre,
            ':description' => $description,
            ':icon'        => $icon,
            ':is_multi'    => $is_multi,
            ':url_direct'  => ($is_multi === 1 ? null : $url_direct),
            ':details_doc' => $details_doc
        ]);

        return ['status' => 'success', 'message' => 'Document mis à jour avec succès'];

    } catch (Exception $e) {
        return ['status' => 'error', 'message' => $e->getMessage()];
    }
}

/* =========================
   UPDATE MODELE
========================= */
function updateModel($bdd) {
    try {
        $id          = intval($_POST['id'] ?? 0);
        $titre       = trim($_POST['titre'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $icon        = $_POST['icon'] ?? 'fa-file-lines';
        $file_path   = trim($_POST['file_path'] ?? '');
        $category_id = intval($_POST['category_id'] ?? 0);
        $details_mod = trim($_POST['details_mod'] ?? '');

        if (!$id || !$titre || !$file_path || !$category_id) {
            throw new Exception("Champs obligatoires manquants.");
        }

        $sql = "UPDATE models SET titre=:titre, description=:description, icon=:icon, 
                file_path=:file_path, category_id=:category_id, details_mod=:details_mod
                WHERE id=:id";

        $stmt = $bdd->prepare($sql);
        $stmt->execute([
            ':id'          => $id,
            ':titre'       => $titre,
            ':description' => $description,
            ':icon'        => $icon,
            ':file_path'   => $file_path,
            ':category_id' => $category_id,
            ':details_mod' => $details_mod
        ]);

        return ['status' => 'success', 'message' => 'Modèle mis à jour avec succès'];

    } catch (Exception $e) {
        return ['status' => 'error', 'message' => $e->getMessage()];
    }
}

/* =========================
   DELETE DOCUMENT
========================= */
function deleteDocument($bdd) {
    try {
        $id = intval($_POST['id'] ?? 0);
        if (!$id) throw new Exception("ID obligatoire pour suppression.");

        $sql = "DELETE FROM categories WHERE id=:id";
        $stmt = $bdd->prepare($sql);
        $stmt->execute([':id' => $id]);

        return ['status' => 'success', 'message' => 'Document supprimé avec succès'];

    } catch (Exception $e) {
        return ['status' => 'error', 'message' => $e->getMessage()];
    }
}

/* =========================
   DELETE MODELE
========================= */
function deleteModele($bdd) {
    try {
        $id = intval($_POST['id'] ?? 0);
        if (!$id) throw new Exception("ID obligatoire pour suppression.");

        $sql = "DELETE FROM models WHERE id=:id";
        $stmt = $bdd->prepare($sql);
        $stmt->execute([':id' => $id]);

        return ['status' => 'success', 'message' => 'Modèle supprimé avec succès'];

    } catch (Exception $e) {
        return ['status' => 'error', 'message' => $e->getMessage()];
    }
}

/* =========================
   GET CATEGORIES
========================= */
function getAllCategory() {
    global $bdd;
    $sql = "SELECT * FROM categories";
    $stmt = $bdd->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/* =========================
   GET MODELS
========================= */
function getAllModele() {
    global $bdd;
    $sql = "SELECT * FROM models";
    $stmt = $bdd->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>
