<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
require '../../Models/function.php'; 

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!empty($data['matricule']) && !empty($data['password'])) {
        $matricule = $data['matricule'];
        $password = $data['password'];

        // 1. Récupérer les infos complètes de l'étudiant
        $queryEtu = "
            SELECT e.id, e.nom, e.prenom, e.matricule, e.password, e.niveau, e.est_actif,
                   p.nom_parcours, p.id AS id_parcours,
                   f.nom_filiere, 
                   c.nomCycle
            FROM etudiants e
            LEFT JOIN parcours p ON e.id_parcours = p.id
            LEFT JOIN filieres f ON p.id_filiere = f.id_filiere
            LEFT JOIN cycle c ON e.idCycle = c.idCycle
            WHERE e.matricule = ?
        ";
        $stmt = $pdo->prepare($queryEtu);
        $stmt->execute([$matricule]);
        $etudiant = $stmt->fetch(PDO::FETCH_ASSOC);

        // 2. Vérification du mot de passe
        if ($etudiant && $password === $etudiant['password']) {
            if ($etudiant['est_actif'] != 1) {
                http_response_code(403);
                echo json_encode(["success" => false, "message" => "Ce compte est désactivé."]);
                exit;
            }

            // 3. Déterminer le "niveau" pour la table affectations_matieres (Ex: DUT + 2 = DUT2)
            $niveauAffectation = $etudiant['nomCycle'] . $etudiant['niveau'];

           // 4. Récupérer les matières ET les notes de cet étudiant
        $queryMat = "
            SELECT m.code_matiere, m.nom_matiere, m.semestre, 
                   n.note_cc, n.note_tp, n.note_synthese 
            FROM matieres m
            INNER JOIN affectations_matieres am ON m.id = am.id_matiere
            LEFT JOIN notes n ON m.id = n.id_matiere AND n.id_etudiant = ?
            WHERE am.id_parcours = ? AND am.niveau = ?
        ";
        $stmtMat = $pdo->prepare($queryMat);
        // Attention à bien ajouter l'ID de l'étudiant en premier paramètre
        $stmtMat->execute([$etudiant['id'], $etudiant['id_parcours'], $niveauAffectation]);
        $matieres = $stmtMat->fetchAll(PDO::FETCH_ASSOC);

            // 5. On prépare la réponse
            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $etudiant['id'],
                    "nom" => $etudiant['nom'],
                    "prenom" => $etudiant['prenom'],
                    "matricule" => $etudiant['matricule'],
                    "cycle" => $etudiant['nomCycle'],
                    "niveau" => $etudiant['niveau'],
                    "filiere" => $etudiant['nom_filiere'],
                    "id_parcours"=> $etudiant['id_parcours'],
                    "parcours" => $etudiant['nom_parcours'],
                    "matieres" => $matieres
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Matricule ou mot de passe incorrect."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Données incomplètes."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur BDD : " . $e->getMessage()]);
}
?>