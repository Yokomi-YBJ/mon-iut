<?php
require_once '../../Models/function.php';
$parcours = $_GET['parcours'];
$niveau = $_GET['niveau'];

// On cherche les affectations liées au parcours et optionnellement au niveau (1, 2 ou 3)
$sql = "SELECT am.id as id_affectation, m.nom_matiere, am.niveau 
        FROM affectations_matieres am 
        JOIN matieres m ON am.id_matiere = m.id 
        WHERE am.id_parcours = ?";

$params = [$parcours];
if(!empty($niveau)) {
    $sql .= " AND am.niveau LIKE ?"; // Utilise LIKE pour matcher 'DUT1', 'BTS1' avec le chiffre '1'
    $params[] = "%$niveau%";
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));