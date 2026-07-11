<?php
include "../../Models/function.php";

if (isset($_POST['creerCompte'])) {
    // Validation des données
    $nom = htmlspecialchars($_POST["nom"]);
    $prenom = htmlspecialchars($_POST['prenom']);
    $matricule = htmlspecialchars($_POST['matricule']);
    $cycle = intval($_POST['cycle']);
    $parcours = intval($_POST['parcours']);
    $niveau = intval($_POST['niveau']);
    $password = str_replace(" ", "", strtolower($nom)) . date("Y");
   

    // Vérification des champs vides
    if (empty($nom) || empty($matricule) || empty($cycle) || empty($parcours) || empty($niveau) || $niveau == 0 ) {
        header("Location: ../../Views/admin/gestion_etudiants.php?message=Veuillez remplir tous les champs.");
        exit();
    }

   
    //Verifier que le matricule n'est pas encore enregistré
    $sql = "SELECT matricule FROM etudiants WHERE matricule = :matricule";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':matricule', $matricule);
    $stmt->execute();
    $nbrEtudiant = $stmt->fetchColumn();

    if($nbrEtudiant > 0 ){
         header("Location: ../../Views/admin/gestion_etudiants.php?message=Matricule déjà enregistré");
        exit();
    }


    
  // Insertion de l'etudiant
    $sql = "INSERT INTO etudiants (nom, prenom, matricule, password, id_parcours, niveau, idCycle) 
                    VALUES (:nom, :prenom, :matricule, :password, :id_parcours, :niveau, :cycle)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':nom', $nom);
    $stmt->bindParam(':prenom', $prenom);
    $stmt->bindParam(':matricule', $matricule);
    $stmt->bindParam(':password', $password);
    $stmt->bindParam(':id_parcours', $parcours, PDO::PARAM_INT);
    $stmt->bindParam(':niveau', $niveau, PDO::PARAM_INT);
    $stmt->bindParam(':cycle', $cycle, PDO::PARAM_INT);

            if ($stmt->execute()) {
                header("Location: ../../Views/admin/gestion_etudiants.php?message=Inscription de l'etudiant(e) $nom réussie.");
                exit();
            } else {
                header("Location: ../../Views/admin/gestion_etudiants.php?message=Erreur lors de l'inscription.");
                exit();
            }
        
    
    
}
?>
