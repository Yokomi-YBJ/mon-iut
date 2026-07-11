<?php
require_once 'connbd.php'; 
$name="SELECT id FROM professeurs WHERE niveau_responsabilite = 2";
$result= mysqli_query($bd,$name);
if($row=$result->fetch_assoc())
    { 
        $idprof= $row['id'];
    }
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Récupération des données
    $titre=$_POST['titre'] ?? '';
    $contenu=$_POST['message'] ?? ''; 
    $type_notif=$_POST['ty_not'] ?? 'EDT'; 
    $targetType=$_POST['type_cible'] ?? ''; // 'ALL', 'PARCOURS' ou 'ETUDIANT'
    $targetValue=$_POST['cible_id'] ?? null; 

    if (empty($contenu) || empty($targetType)) {
        die("Erreur : Le message ou la cible est manquant.");
    }

    // --- 1. Insertion dans la table notifications ---
    $sqlNotif = "INSERT INTO notifications(titre, contenu, type_notif, id_exp_prof, cible_type, cible_id) 
                 VALUES (?, ?, 'EDT', ?, ?, ?)";
    
    $stmt = mysqli_prepare($bd, $sqlNotif);
    mysqli_stmt_bind_param($stmt, "sssss", $titre, $contenu, $idprof, $targetType, $targetValue);
    
    if (mysqli_stmt_execute($stmt)) {
        $notifId = mysqli_insert_id($bd);
        mysqli_stmt_close($stmt);
    } else {
        die("Erreur SQL : " . mysqli_error($bd));
    }

    // --- 2. Récupération des IDs des étudiants selon la cible ---
    $studentIds = [];

    switch ($targetType) {
        case 'ETUDIANT':
            // Recherche par MATRICULE
            $sql = "SELECT id FROM etudiants WHERE matricule = ? LIMIT 1";
            $stmt = mysqli_prepare($bd, $sql);
            mysqli_stmt_bind_param($stmt, "s", $targetValue);
            break;

        case 'PARCOURS':
            // Recherche par ID PARCOURS
            $sql = "SELECT id FROM etudiants WHERE est_actif = 1 AND id_parcours = ?";
            $stmt = mysqli_prepare($bd, $sql);
            mysqli_stmt_bind_param($stmt, "i", $targetValue);
            break;

        case 'ALL':
            // Recherche par ID FILIERE (via la table parcours)
            $sql = "SELECT e.id FROM etudiants e,parcours p,filieres fil WHERE e.id_parcours = p.id 
                    WHERE e.est_actif = 1 AND p.id_filiere = fil.id";
            $stmt = mysqli_prepare($bd, $sql);
            break;
            
        default:
            die("Type de cible non reconnu.");
    }

    // Exécution de la requête de sélection choisie
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    while ($row = mysqli_fetch_assoc($result)) {
        $studentIds[] = $row['id'];
    }
    mysqli_stmt_close($stmt);

    // --- 3. Insertion des destinataires ---
    if (!empty($studentIds)) {
        $sqlDest = "INSERT INTO notification_destinataires(id_notification, id_etudiant) VALUES (?, ?)";
        $stmtDest = mysqli_prepare($bd, $sqlDest);

        foreach ($studentIds as $idEtudiant) {
            mysqli_stmt_bind_param($stmtDest, "ii", $notifId, $idEtudiant);
            mysqli_stmt_execute($stmtDest);
        }
        
        mysqli_stmt_close($stmtDest);
        echo "Notification envoyée avec succès à " . count($studentIds) . " étudiant(s).";
    } else {
        echo "Aucun étudiant trouvé pour cette sélection.";
    }
}
?>