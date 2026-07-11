<?php
// Controllers/adminControllers/api_delete.php
header('Content-Type: application/json');
require_once __DIR__ . '/../../Models/function.php';

// On vérifie que c'est une requête POST et que l'ID est fourni
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID étudiant manquant.']);
        exit;
    }

    try {
        $pdo->beginTransaction();


        // Désactiver l'étudiant
        $stmt = $pdo->prepare("UPDATE etudiants SET est_actif = 0 WHERE id = ?");
        $stmt->execute([$id]);

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Le compte de l\'étudiant a été désactivé avec succès.']);

    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la désactivation : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
}