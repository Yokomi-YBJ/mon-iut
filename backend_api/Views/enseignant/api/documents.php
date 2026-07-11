<?php
header('Content-Type: application/json');
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? sanitizeInput($_GET['action']) : '';
$upload_dir = '../uploads/';

// Créer le répertoire s'il n'existe pas
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

if ($method === 'POST' && $action === 'upload') {
    // Uploader un document/TD
    $titre = sanitizeInput($_POST['titre'] ?? 'Document');
    $type_doc = sanitizeInput($_POST['type'] ?? 'COURS');
    $filiere = sanitizeInput($_POST['filiere'] ?? '');
    
    // Résoudre l'ID du parcours
    $parcours_id = null;
    if (!empty($filiere) && $filiere !== 'tous') {
        $stmt = $conn->prepare("SELECT id FROM parcours WHERE nom_parcours = ?");
        $stmt->bind_param("s", $filiere);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $parcours_id = $row['id'];
        }
    }

    // Valider le fichier
    if (!isset($_FILES['fichier']) || $_FILES['fichier']['error'] !== UPLOAD_ERR_OK) {
        jsonResponse(false, 'Erreur lors de l\'upload du fichier');
    }

    $file = $_FILES['fichier'];
    $allowed_types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    
    if (!in_array($file['type'], $allowed_types)) {
        jsonResponse(false, 'Type de fichier non autorisé');
    }

    // Générer un nom de fichier unique
    $file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('doc_') . '.' . $file_extension;
    $filepath = $upload_dir . $filename;

    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        $url_fichier = 'uploads/' . $filename;
        
        // Insérer dans la base de données
        $stmt = $conn->prepare("INSERT INTO documents (titre, url_fichier, type_doc, id_parcours) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $titre, $url_fichier, $type_doc, $parcours_id);
        
        if ($stmt->execute()) {
            jsonResponse(true, 'Document uploadé avec succès', ['doc_id' => $conn->insert_id, 'url' => $url_fichier]);
        } else {
            unlink($filepath); // Supprimer le fichier en cas d'erreur DB
            jsonResponse(false, 'Erreur lors de l\'enregistrement du document');
        }
    } else {
        jsonResponse(false, 'Erreur lors du déplacement du fichier');
    }
}

else if ($method === 'GET' && $action === 'list') {
    // Lister les documents
    $filiere = isset($_GET['filiere']) ? sanitizeInput($_GET['filiere']) : '';
    
    if (empty($filiere)) {
        // Tous les documents
        $stmt = $conn->prepare("SELECT * FROM documents ORDER BY date_publication DESC LIMIT 50");
        $stmt->execute();
    } else {
        // Documents d'une filière spécifique
        $stmt = $conn->prepare("
            SELECT d.* FROM documents d
            JOIN parcours p ON d.id_parcours = p.id
            WHERE p.nom_parcours = ?
            ORDER BY d.date_publication DESC
        ");
        $stmt->bind_param("s", $filiere);
        $stmt->execute();
    }
    
    $result = $stmt->get_result();
    $documents = [];
    while ($row = $result->fetch_assoc()) {
        $documents[] = $row;
    }
    
    jsonResponse(true, 'Documents récupérés', $documents);
}

else {
    jsonResponse(false, 'Action non autorisée');
}
?>
