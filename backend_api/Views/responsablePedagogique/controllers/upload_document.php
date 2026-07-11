<?php
require_once 'connbd.php'; // Assurez-vous que $bd est défini avec mysqli_connect()

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    if (!isset($_FILES['fichier']) || $_FILES['fichier']['error'] !== 0) {
        die("Erreur lors de l'envoi du fichier.");
    }
    
    $ext = strtolower(pathinfo($_FILES['fichier']['name'], PATHINFO_EXTENSION));
    if ($ext !== 'pdf') die("Seuls les PDF sont acceptés.");

    $uploadDir = 'document/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
    
    $fileName = uniqid('doc_') . '.pdf';
    if (!move_uploaded_file($_FILES['fichier']['tmp_name'], $uploadDir . $fileName)) {
        die("Erreur d'écriture sur le disque.");
    }
    $webPath = 'documents/' . $fileName;

    $titre = $_FILES['fichier']['name'];
    $targetType = "PARCOURS";
    $targetValue = $_POST['parcours'] ?? null;

    // --- 1. Insertion document parent ---
    $sqlDoc = "INSERT INTO documents (titre, url_fichier, type_doc, cible_type, cible_id) 
               VALUES (?, ?, 'EDT', ?, ?)";
    
    $stmt = mysqli_prepare($bd, $sqlDoc);
    // "ssss" signifie que nous lions 4 chaînes (string)
    mysqli_stmt_bind_param($stmt, "ssss", $titre, $webPath, $targetType, $targetValue);
    
    if (mysqli_stmt_execute($stmt)) {
        $docId = mysqli_insert_id($bd);
    } else {
        die("Erreur lors de l'insertion du document : " . mysqli_error($bd));
    }
    mysqli_stmt_close($stmt);

    // --- 2. Récupération dynamique des étudiants ---
    $sqlEtu = "SELECT id FROM etudiants WHERE est_actif = 1";
    
    if ($targetType === 'PARCOURS' && $targetValue !== null) {
        $sqlEtu .= " AND id_parcours = ?";
        $stmtEtu = mysqli_prepare($bd, $sqlEtu);
        mysqli_stmt_bind_param($stmtEtu, "s", $targetValue);
    } else {
        $stmtEtu = mysqli_prepare($bd, $sqlEtu);
    }

    mysqli_stmt_execute($stmtEtu);
    $resultEtu = mysqli_stmt_get_result($stmtEtu);
    
    $studentIds = [];
    while ($row = mysqli_fetch_assoc($resultEtu)) {
        $studentIds[] = $row['id'];
    }
    mysqli_stmt_close($stmtEtu);

    if (empty($studentIds)) {
        echo "Document enregistré mais aucun étudiant ne correspond aux critères.";
    } else {
        // --- 3. Insertion des destinataires ---
        $sqlDest = "INSERT INTO document_destinataires (id_document, id_etudiant) VALUES (?, ?)";
        $stmtDest = mysqli_prepare($bd, $sqlDest);

        foreach ($studentIds as $idEtudiant) {
            // "ii" pour deux entiers (integer)
            mysqli_stmt_bind_param($stmtDest, "ii", $docId, $idEtudiant);
            mysqli_stmt_execute($stmtDest);
        }
        mysqli_stmt_close($stmtDest);
        
        echo "Document et destinataires enregistrés avec succès !";
    }
}
?>