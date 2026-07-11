<?php
header('Content-Type: application/json');
require_once '../../Models/function.php';

try {
    // Vérification de l'existence des paramètres
    $type = $_GET['type'] ?? '';
    $id = $_GET['id'] ?? 0;
    $sql = "";

    // Ajout du cas 'cycle' et correction des requêtes
    if ($type == 'cycle') {
        $sql = "SELECT idCycle as id, nomCycle as nom FROM cycle"; 
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    } elseif ($type == 'filiere') {
        $sql = "SELECT id_filiere as id, nom_filiere as nom FROM filieres WHERE id_cycle = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
    } elseif ($type == 'parcours') {
        $sql = "SELECT id, nom_parcours as nom FROM parcours WHERE id_filiere = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
    } else {
        echo json_encode([]); 
        exit;
    }

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}