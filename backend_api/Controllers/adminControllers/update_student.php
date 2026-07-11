<?php
header('Content-Type: application/json');
require_once __DIR__ . '../../Models/function.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id'])) {
    try {
        $sql = "UPDATE etudiants SET 
                nom = ?, 
                prenom = ?, 
                matricule = ?, 
                idCycle = ?, 
                id_parcours = ?, 
                niveau = ? 
                WHERE id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $input['nom'],
            $input['prenom'],
            $input['matricule'],
            $input['idCycle'],
            $input['id_parcours'],
            $input['niveau'],
            $input['id']
        ]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}