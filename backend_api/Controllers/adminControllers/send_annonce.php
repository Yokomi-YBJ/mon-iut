<?php
session_start();
require_once '../../Models/function.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $titre = $_POST['titre'];
        $contenu = $_POST['message'];
        $targetType = strtoupper($_POST['target_type']); // Mis en majuscule pour la BDD
        $targetValue = $_POST['target_value'] ?? null;
        $niveau = $_POST['niveau'] ?? 'all';
        

        $pdo->beginTransaction();

        // 1. Création de la notification avec le niveau
        $sqlNotif = "INSERT INTO notifications (titre, contenu, type_notif, date_envoi,  cible_type, cible_id, niveau_cible) 
                     VALUES (?, ?, 'INFO', NOW(), ?, ?, ?)";
        $stmt = $pdo->prepare($sqlNotif);
        $stmt->execute([$titre, $contenu,  $targetType, $targetValue, $niveau]);
        $notifId = $pdo->lastInsertId();

        // 2. Récupération dynamique des étudiants
        $sqlEtu = "SELECT id FROM etudiants WHERE est_actif = 1";
        $params = [];

        if ($targetType === 'CYCLE') { $sqlEtu .= " AND idCycle = ?"; $params[] = $targetValue; }
        elseif ($targetType === 'FILIERE') {
            $sqlEtu = "SELECT e.id FROM etudiants e JOIN parcours p ON e.id_parcours = p.id WHERE p.id_filiere = ? AND e.est_actif = 1";
            $params[] = $targetValue;
        }
        elseif ($targetType === 'PARCOURS') { $sqlEtu .= " AND id_parcours = ?"; $params[] = $targetValue; }
        elseif ($targetType === 'ETUDIANT') { $sqlEtu .= " AND matricule = ?"; $params[] = $targetValue; }

        // Filtre par niveau
        if ($niveau !== 'all' && $targetType !== 'ETUDIANT') {
            $sqlEtu .= " AND niveau = ?";
            $params[] = $niveau;
        }

        $stmtEtu = $pdo->prepare($sqlEtu);
        $stmtEtu->execute($params);
        $studentIds = $stmtEtu->fetchAll(PDO::FETCH_COLUMN);

        if (empty($studentIds)) {
            throw new Exception("Aucun étudiant ne correspond à ces critères (Cible + Niveau).");
        }

        // 3. Insertion des destinataires
        $sqlDest = "INSERT INTO notification_destinataires (id_notification, id_etudiant, est_lu) VALUES (?, ?, 0)";
        $stmtDest = $pdo->prepare($sqlDest);
        foreach ($studentIds as $idEtudiant) {
            $stmtDest->execute([$notifId, $idEtudiant]);
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => "Annonce envoyée à " . count($studentIds) . " étudiant(s) !"]);

    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>