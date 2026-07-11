<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../Models/function.php';

try {
    $sql = "SELECT e.id, e.nom, e.prenom, e.matricule, e.niveau, 
                   c.nomCycle, f.nom_filiere, p.nom_parcours
            FROM etudiants e
            JOIN cycle c ON e.idCycle = c.idCycle
            JOIN parcours p ON e.id_parcours = p.id
            JOIN filieres f ON p.id_filiere = f.id_filiere
            WHERE est_actif = 1";

    $params = [];

    // Filtres dynamiques
    if (!empty($_GET['cycle'])) {
        $sql .= " AND e.idCycle = ?";
        $params[] = intval($_GET['cycle']);
    }
    
    // NOUVEAU : Filtre sur la filière
    if (!empty($_GET['filiere'])) {
        $sql .= " AND f.id_filiere = ?";
        $params[] = intval($_GET['filiere']);
    }

    if (!empty($_GET['parcours'])) {
        $sql .= " AND e.id_parcours = ?";
        $params[] = intval($_GET['parcours']);
    }
    
    // CORRECTION : Filtre sur le niveau (exact match au lieu de LIKE)
    if (!empty($_GET['niveau'])) {
        $sql .= " AND e.niveau = ?";
        $params[] = $_GET['niveau'];
    }

    $sql .= " ORDER BY e.nom ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>