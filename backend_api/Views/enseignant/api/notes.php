<?php
header('Content-Type: application/json');
require_once '../config.php';

// Récupérer la méthode HTTP
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? sanitizeInput($_GET['action']) : '';

if ($method === 'POST' && $action === 'add') {
    // Ajouter une note
    $etudiant = sanitizeInput($_POST['etudiant'] ?? '');
    $matricule = sanitizeInput($_POST['matricule'] ?? '');
    $matiere = sanitizeInput($_POST['matiere'] ?? '');
    $note = floatval($_POST['note'] ?? 0);
    $type = sanitizeInput($_POST['type'] ?? '');

    if (empty($etudiant) || empty($matricule) || empty($matiere) || $note < 0 || $note > 20 || empty($type)) {
        jsonResponse(false, 'Tous les champs sont requis et doivent être valides');
    }

    // Vérifier si l'étudiant existe
    $stmt = $conn->prepare("SELECT id FROM etudiants WHERE matricule = ?");
    $stmt->bind_param("s", $matricule);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(false, 'Étudiant non trouvé');
    }
    
    $student = $result->fetch_assoc();
    
    // Chercher la matière
    $stmt = $conn->prepare("SELECT id FROM matieres WHERE nom_matiere = ?");
    $stmt->bind_param("s", $matiere);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        // Créer la matière si elle n'existe pas
        $stmt = $conn->prepare("INSERT INTO matieres (nom_matiere) VALUES (?)");
        $stmt->bind_param("s", $matiere);
        $stmt->execute();
        $matiere_id = $conn->insert_id;
    } else {
        $matiere_data = $result->fetch_assoc();
        $matiere_id = $matiere_data['id'];
    }

    // Déterminer le champ de note selon le type
    $semestre = 'S1'; // À adapter selon votre sélection
    
    $stmt = $conn->prepare("INSERT INTO notes (id_etudiant, id_matiere, note_cc, semestre) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiis", $student['id'], $matiere_id, $note, $semestre);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Note ajoutée avec succès', ['note_id' => $conn->insert_id]);
    } else {
        jsonResponse(false, 'Erreur lors de l\'ajout de la note');
    }
}

else if ($method === 'GET' && $action === 'search') {
    // Rechercher les notes d'un étudiant
    $matricule = sanitizeInput($_GET['matricule'] ?? '');
    
    if (empty($matricule)) {
        jsonResponse(false, 'Matricule requis');
    }

    $stmt = $conn->prepare("
        SELECT e.nom, e.prenom, n.*, m.nom_matiere 
        FROM notes n
        JOIN etudiants e ON n.id_etudiant = e.id
        JOIN matieres m ON n.id_matiere = m.id
        WHERE e.matricule = ?
        ORDER BY n.date_saisie DESC
    ");
    $stmt->bind_param("s", $matricule);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $notes = [];
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }
    
    if (empty($notes)) {
        jsonResponse(false, 'Aucune note trouvée');
    }
    
    jsonResponse(true, 'Notes trouvées', $notes);
}

else {
    jsonResponse(false, 'Action non autorisée');
}
?>
