<?php
require_once '../../Models/function.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $pdo->beginTransaction();

        if (!isset($_FILES['fichier']) || $_FILES['fichier']['error'] !== 0) {
            throw new Exception("Erreur lors de l'envoi du fichier.");
        }
        
        $ext = strtolower(pathinfo($_FILES['fichier']['name'], PATHINFO_EXTENSION));
        if ($ext !== 'pdf') throw new Exception("Seuls les PDF sont acceptés.");

        $uploadDir = '../../uploads/documents/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $fileName = uniqid('doc_') . '.pdf';
        if (!move_uploaded_file($_FILES['fichier']['tmp_name'], $uploadDir . $fileName)) {
            throw new Exception("Erreur d'écriture sur le disque.");
        }
        $webPath = 'uploads/documents/' . $fileName;

        $titre = $_FILES['fichier']['name'];
        $targetType = strtoupper($_POST['target_type']);
        $targetValue = $_POST['target_value'] ?? null;
        $niveau = $_POST['niveau'] ?? 'all';
    

        // 1. Insertion document parent
        $sqlDoc = "INSERT INTO documents (titre, url_fichier, type_doc, cible_type, cible_id, niveau_cible) 
                   VALUES (?, ?, 'ADMIN', ?, ?, ?)";
        $stmt = $pdo->prepare($sqlDoc);
        $stmt->execute([$titre, $webPath,  $targetType, $targetValue, $niveau]);
        $docId = $pdo->lastInsertId();

        // 2. Récupération dynamique des étudiants (même logique exacte)
        $sqlEtu = "SELECT id FROM etudiants WHERE est_actif = 1";
        $params = [];

        if ($targetType === 'CYCLE') { $sqlEtu .= " AND idCycle = ?"; $params[] = $targetValue; }
        elseif ($targetType === 'FILIERE') {
            $sqlEtu = "SELECT e.id FROM etudiants e JOIN parcours p ON e.id_parcours = p.id WHERE p.id_filiere = ? AND e.est_actif = 1";
            $params[] = $targetValue;
        }
        elseif ($targetType === 'PARCOURS') { $sqlEtu .= " AND id_parcours = ?"; $params[] = $targetValue; }
        elseif ($targetType === 'ETUDIANT') { $sqlEtu .= " AND matricule = ?"; $params[] = $targetValue; }

        if ($niveau !== 'all' && $targetType !== 'ETUDIANT') {
            $sqlEtu .= " AND niveau = ?";
            $params[] = $niveau;
        }

        $stmtEtu = $pdo->prepare($sqlEtu);
        $stmtEtu->execute($params);
        $studentIds = $stmtEtu->fetchAll(PDO::FETCH_COLUMN);

        if (empty($studentIds)) {
            throw new Exception("Document enregistré mais aucun étudiant ne correspond aux critères.");
        }

        // 3. Insertion des destinataires
        $sqlDest = "INSERT INTO document_destinataires (id_document, id_etudiant) VALUES (?, ?)";
        $stmtDest = $pdo->prepare($sqlDest);
        foreach ($studentIds as $idEtudiant) {
            $stmtDest->execute([$docId, $idEtudiant]);
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => "Document envoyé à " . count($studentIds) . " étudiant(s)."]);

    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>