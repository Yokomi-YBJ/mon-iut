<?php
header('Content-Type: application/json');
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? sanitizeInput($_GET['action']) : '';

if ($method === 'POST' && $action === 'send') {
    // Envoyer un communiqué
    $titre = sanitizeInput($_POST['titre'] ?? 'Sans titre');
    $contenu = sanitizeInput($_POST['message'] ?? '');
    $filiere = sanitizeInput($_POST['filiere'] ?? '');
    $type_notif = 'INFO';

    if (empty($contenu)) {
        jsonResponse(false, 'Le message est requis');
    }

    // Insérer la notification
    $stmt = $conn->prepare("INSERT INTO notifications (titre, contenu, type_notif) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $titre, $contenu, $type_notif);
    
    if ($stmt->execute()) {
        $notification_id = $conn->insert_id;
        
        // Ajouter les destinataires selon la filière
        if ($filiere === 'tous') {
            // Tous les étudiants
            $stmt = $conn->prepare("INSERT INTO notification_destinataires (id_notification, id_etudiant) SELECT ?, id FROM etudiants WHERE est_actif = 1");
            $stmt->bind_param("i", $notification_id);
            $stmt->execute();
        } else if (!empty($filiere)) {
            // Par parcours
            $stmt = $conn->prepare("
                INSERT INTO notification_destinataires (id_notification, id_etudiant) 
                SELECT ?, e.id FROM etudiants e
                JOIN parcours p ON e.id_parcours = p.id
                WHERE p.nom_parcours = ? AND e.est_actif = 1
            ");
            $stmt->bind_param("is", $notification_id, $filiere);
            $stmt->execute();
        }
        
        jsonResponse(true, 'Communiqué envoyé avec succès', ['notification_id' => $notification_id]);
    } else {
        jsonResponse(false, 'Erreur lors de l\'envoi du communiqué');
    }
}

else if ($method === 'GET' && $action === 'list') {
    // Lister les derniers communiqués
    $stmt = $conn->prepare("
        SELECT * FROM notifications 
        ORDER BY date_envoi DESC 
        LIMIT 20
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $notifications = [];
    while ($row = $result->fetch_assoc()) {
        $notifications[] = $row;
    }
    
    jsonResponse(true, 'Communiqués récupérés', $notifications);
}

else {
    jsonResponse(false, 'Action non autorisée');
}
?>
