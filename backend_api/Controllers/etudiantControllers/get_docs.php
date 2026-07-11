<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require '../../Models/function.php'; 

$id_parcours = isset($_GET['id_parcours']) ? $_GET['id_parcours'] : null;
$niveau = isset($_GET['niveau']) ? $_GET['niveau'] : null;

if (!$id_parcours || !$niveau) {
    echo json_encode(["success" => false, "message" => "Paramètres manquants"]);
    exit;
}

try {
    // 1. Récupérer l'ID de la filière associé au parcours de l'étudiant
    $stmtFiliere = $pdo->prepare("SELECT id_filiere FROM parcours WHERE id = ?");
    $stmtFiliere->execute([$id_parcours]);
    $resFiliere = $stmtFiliere->fetch(PDO::FETCH_ASSOC);
    
    $id_filiere = $resFiliere ? $resFiliere['id_filiere'] : null;

    // 2. Requête principale avec gestion du type FILIERE
    $query = "SELECT d.*, m.nom_matiere as nom_ue, d.id as ue_id
                FROM documents d
                LEFT JOIN matieres m ON d.id_parcours = m.id 
                WHERE (d.type_doc = 'COURS' OR d.type_doc = 'ADMIN')
                AND (
                    d.cible_type = 'ALL' 
                    OR (d.cible_type = 'PARCOURS' AND d.cible_id = :id_parcours)
                    OR (d.cible_type = 'FILIERE' AND d.cible_id = :id_filiere)
                )
                AND (d.niveau_cible = :niveau OR d.niveau_cible = 'ALL')
                ORDER BY d.date_publication DESC";
              
    $stmt = $pdo->prepare($query);
    
    // Utilisation de bindValue pour plus de clarté avec les paramètres nommés
    $stmt->bindValue(':id_parcours', $id_parcours);
    $stmt->bindValue(':id_filiere', $id_filiere);
    $stmt->bindValue(':niveau', $niveau);
    
    $stmt->execute();
    $docs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true, 
        "data" => $docs
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Erreur SQL : " . $e->getMessage()
    ]);
}
?>