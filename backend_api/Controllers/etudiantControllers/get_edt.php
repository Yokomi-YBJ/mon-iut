<?php
header("Content-Type: application/json; charset=UTF-8");
require '../../Models/function.php'; 

$id_parcours = $_GET['id_parcours'];
$niveau = $_GET['niveau'];

try {
    // On récupère les documents de type 'EDT' qui ciblent le parcours de l'étudiant
    // ou qui sont destinés à tout le monde ('ALL')
    $query = "SELECT titre, url_fichier, date_publication 
                FROM documents 
                WHERE type_doc = 'EDT' 
                -- On vérifie si c'est pour tout le monde OU spécifiquement pour le parcours de l'étudiant
                AND (
                    cible_type = 'ALL' 
                    OR (cible_type = 'PARCOURS' AND cible_id = ?)
                )
                -- On vérifie si c'est pour tous les niveaux OU spécifiquement pour le niveau de l'étudiant
                AND (niveau_cible = ? OR niveau_cible = 'ALL')
                ORDER BY date_publication DESC";
              
    $stmt = $pdo->prepare($query);
    $stmt->execute([$id_parcours, $niveau]);
    $edts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $edts]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>