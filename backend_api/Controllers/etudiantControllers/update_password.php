<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
require '../../Models/function.php'; 

// Récupération des données du corps de la requête
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id_user) || !isset($data->old_password) || !isset($data->new_password)) {
    echo json_encode(["success" => false, "message" => "Données incomplètes."]);
    exit;
}

try {
    // 1. Récupérer le mot de passe actuel stocké en clair
    $stmt = $pdo->prepare("SELECT password FROM etudiants WHERE id = ?");
    $stmt->execute([$data->id_user]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(["success" => false, "message" => "Étudiant introuvable."]);
        exit;
    }

    // 2. Vérification directe (en clair)
    if ($data->old_password === $user['password']) {
        
        // 3. Mise à jour directe
        $update = $pdo->prepare("UPDATE etudiants SET password = ? WHERE id = ?");
        $update->execute([$data->new_password, $data->id_user]);

        echo json_encode(["success" => true, "message" => "Mot de passe mis à jour !"]);
    } else {
        echo json_encode(["success" => false, "message" => "L'ancien mot de passe est incorrect."]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erreur SQL : " . $e->getMessage()]);
}
?>