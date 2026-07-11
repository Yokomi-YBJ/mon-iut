<?php
require_once 'connbd.php'; // On suppose que $bd est votre connexion mysqli_connect

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Récupération des données du formulaire
    $titre=$_POST["titre"] ?? '';
    $type=$_POST["ty_not"] ?? '';
    $message= $_POST['message'] ?? '';
    $targetType= $_POST['des'] ?? ''; // 'PARCOURS' ou 'ETUDIANT'
    $mat=$_POST["mat"] ?? '';

    if (empty($message) || empty($targetType)) {
        die("Erreur : Message ou cible manquante.");
    }

    // --- 1. Insertion du message parent (table documents utilisée ici comme conteneur) ---
    $sqlDoc = "INSERT INTO notifications(titre,contenu,type_notif,cible_type,cible_id) 
               VALUES (?, ?, ?, ?, ?)";
    
    $stmt = mysqli_prepare($bd, $sqlDoc);
    // "ssi" : objet (string), type (string), valeur cible (int/string selon votre BDD)
    mysqli_stmt_bind_param($stmt, "ssi", $type, $targetType, $targetValue);
    
    if (mysqli_stmt_execute($stmt)) {
        $docId = mysqli_insert_id($bd);
        mysqli_stmt_close($stmt);
    } else {
        die("Erreur lors de l'enregistrement du message : " . mysqli_error($bd));
    }

    // --- 2. Récupération des IDs des étudiants concernés ---
    $select="SELECT id FROM etudiants WHERE matricule = '$mat'";
    $verif=mysqli_query($bd,$select);
    if($row=$verif->fetch_assoc()){
             $studentIds=$row['id'];
    }

    if ($targetType === 'ETUDIANT') {
        // Cible unique : un seul étudiant
        $studentIds = $targetValue;
    } 
    elseif ($targetType === 'PARCOURS') {
        // Cible multiple : tous les étudiants du parcours actif
        $sqlEtu = "SELECT id FROM etudiants WHERE est_actif = 1 AND id_parcours = ?";
        $stmtEtu = mysqli_prepare($bd, $sqlEtu);
        mysqli_stmt_bind_param($stmtEtu, "i", $targetValue);
        mysqli_stmt_execute($stmtEtu);
        
        $result = mysqli_stmt_get_result($stmtEtu);
        while ($row = mysqli_fetch_assoc($result)) {
            $studentIds = $row['id'];
        }
        mysqli_stmt_close($stmtEtu);
    }

    // --- 3. Insertion des destinataires dans la table de liaison ---
    if (!empty($studentIds)) {
        $sqlDest = "INSERT INTO document_destinataires (id_document, id_etudiant) VALUES (?, ?)";
        $stmtDest = mysqli_prepare($bd, $sqlDest);

        foreach ($studentIds as $idEtudiant) {
            // "ii" : deux entiers
            mysqli_stmt_bind_param($stmtDest, "ii", $docId, $idEtudiant);
            mysqli_stmt_execute($stmtDest);
        }
        
        mysqli_stmt_close($stmtDest);
        echo "Message envoyé avec succès à " . count($studentIds) . " étudiant(s).";
    } else {
        echo "Le message a été créé, mais aucun étudiant ne correspond aux critères.";
    }
}
?>