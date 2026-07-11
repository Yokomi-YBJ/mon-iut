<?php
require_once '../../Models/function.php';
header('Content-Type: application/json');

try {
    $pdo->beginTransaction();

    // 1. Insertion Professeur
    $stmt = $pdo->prepare("INSERT INTO professeurs (nom_complet, identifiant, password, niveau_responsabilite) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $_POST['nom_prof'], 
        $_POST['email_prof'], 
        $_POST['pwd_prof'], 
        $_POST['niveau_responsable'] ?? null
    ]);
    $profId = $pdo->lastInsertId();

    // 2. Si Responsable, mettre à jour la table filieres
    if($_POST['role_prof'] == 'responsable' && !empty($_POST['filiere_responsable'])) {
        $upd = $pdo->prepare("UPDATE professeurs SET idFiliere = ? WHERE id_responsable = ?");
        $upd->execute([$_POST['filiere_responsable'], $profId]);
    }

    // 3. Affectation des matières cochées
    if(!empty($_POST['matieres'])) {
        $updMat = $pdo->prepare("UPDATE affectations_matieres SET id_professeur = ? WHERE id = ?");
        foreach($_POST['matieres'] as $idAff) {
            $updMat->execute([$profId, $idAff]);
        }
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => "Professeur enregistré avec succès !"]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}