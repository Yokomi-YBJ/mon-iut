<?php
header('Content-Type: application/json');
require_once  '../../Models/function.php';

try {
    $data = [
        'cycles' => [],
        'filieres' => []
    ];

    // 1. Récupérer les cycles
    $stmt = $pdo->query("SELECT idCycle as id, nomCycle as nom FROM cycle");
    $data['cycles'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Récupérer les filières et leurs parcours associés
    // Inclure id_cycle pour permettre le filtrage côté client
    $stmtF = $pdo->query("SELECT id_filiere as id, nom_filiere as nom, id_cycle as id_cycle FROM filieres");
    $filieres = $stmtF->fetchAll(PDO::FETCH_ASSOC);

    foreach ($filieres as $f) {
        $stmtP = $pdo->prepare("SELECT id, nom_parcours as nom FROM parcours WHERE id_filiere = ?");
        $stmtP->execute([$f['id']]);
        $f['parcours'] = $stmtP->fetchAll(PDO::FETCH_ASSOC);
        $data['filieres'][] = $f;
    }

    echo json_encode($data);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
