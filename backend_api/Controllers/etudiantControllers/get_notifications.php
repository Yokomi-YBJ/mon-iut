<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require '../../Models/function.php'; // Assure-toi que $pdo est bien défini ici

$id_parcours = isset($_GET['id_parcours']) ? intval($_GET['id_parcours']) : null;
$niveau = isset($_GET['niveau']) ? $_GET['niveau'] : null;

if (!$id_parcours || !$niveau) {
    echo json_encode(["success" => false, "message" => "Paramètres manquants"]);
    exit;
}

try {
    // 1. Récupération sécurisée de l'ID de la filière
    $stmtFiliere = $pdo->prepare("SELECT id_filiere FROM parcours WHERE id = ?");
    $stmtFiliere->execute([$id_parcours]);
    $resFiliere = $stmtFiliere->fetch(PDO::FETCH_ASSOC);
    
    // Si le parcours n'existe pas, on met 0 ou null pour ne pas casser la suite
    $id_filiere = $resFiliere ? $resFiliere['id_filiere'] : 0;

    // 2. Requête optimisée
    $query = "SELECT titre, message as body, date_creation as date, type_alerte 
              FROM notifications 
              WHERE (
                  cible_type = 'ALL' 
                  OR (cible_type = 'PARCOURS' AND cible_id = :id_parcours)
                  OR (cible_type = 'FILIERE' AND cible_id = :id_filiere)
              )
              AND (niveau_cible = :niveau OR niveau_cible = 'ALL')
              ORDER BY date_creation DESC";
              
    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':id_parcours', $id_parcours, PDO::PARAM_INT);
    $stmt->bindValue(':id_filiere', $id_filiere, PDO::PARAM_INT);
    $stmt->bindValue(':niveau', $niveau, PDO::PARAM_STR);
    $stmt->execute();
    
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true, 
        "data" => $notifications
    ]);

} catch (PDOException $e) {
    // Ne pas afficher $e->getMessage() en production pour la sécurité
    echo json_encode(["success" => false, "message" => "Erreur de base de données"]);
}
?>