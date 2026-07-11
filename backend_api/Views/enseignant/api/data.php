<?php
header('Content-Type: application/json');
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? sanitizeInput($_GET['action']) : '';

if ($method === 'GET' && $action === 'filieres') {
    // Récupérer toutes les filières
    $stmt = $conn->prepare("SELECT * FROM filieres");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $filieres = [];
    while ($row = $result->fetch_assoc()) {
        $filieres[] = $row;
    }
    
    jsonResponse(true, 'Filières récupérées', $filieres);
}

else if ($method === 'GET' && $action === 'parcours') {
    // Récupérer tous les parcours (optionnellement filtrés par filière)
    $id_filiere = isset($_GET['filiere_id']) ? intval($_GET['filiere_id']) : null;
    
    if ($id_filiere) {
        $stmt = $conn->prepare("SELECT * FROM parcours WHERE id_filiere = ?");
        $stmt->bind_param("i", $id_filiere);
    } else {
        $stmt = $conn->prepare("SELECT * FROM parcours");
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $parcours = [];
    while ($row = $result->fetch_assoc()) {
        $parcours[] = $row;
    }
    
    jsonResponse(true, 'Parcours récupérés', $parcours);
}

else if ($method === 'GET' && $action === 'matieres') {
    // Récupérer toutes les matières
    $stmt = $conn->prepare("SELECT * FROM matieres ORDER BY nom_matiere");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $matieres = [];
    while ($row = $result->fetch_assoc()) {
        $matieres[] = $row;
    }
    
    jsonResponse(true, 'Matières récupérées', $matieres);
}

else {
    jsonResponse(false, 'Action non autorisée');
}
?>
