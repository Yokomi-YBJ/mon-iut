<?php
include "controllers/connbd.php";
$select="SELECT p.id,p.nom_parcours FROM parcours p,professeurs pr,filieres fil WHERE fil.id_filiere = pr.idFiliere AND p.id_filiere = fil.id_filiere ORDER BY nom_parcours";
$result=mysqli_query($bd,$select);
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon IUT</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="styles/index.css">
    <link rel="stylesheet" href="style.css">
   
</head>

<body>

    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <h1>Mon IUT</h1>
            <p>Responsable pédagogique</p>
        </div>
        <ul class="sidebar-menu">
            <li><a href="index.php">Accueil</a></li>
            <li><a href="notif.php" class="active">Notifications</a></li>
            <li><a href="doc.php">Documentation</a></li>
        </ul>
        <div class="logout-lin">
            <a href="../enseignant/index.html">Connexion Professeur</a>
        </div>
        <div class="logout-link">
            <a href="../enseignant/api/deconnexion.php">Déconnexion</a>
        </div>
    </aside>

    <main class="main-content" id="mainContent" style="justify-content: center;">
        <header class="header">
            <div>
                <h1>Notifications</h1>
                <p>Envoyer les différentes notifications aux étudiants.</p>
            </div>
        </header>
        <center>
        <div class="form-container">
            <h2>Notifications</h2>
            <form action="controllers/not.php" method="POST">
        
                <div class="form-group">
                    <label for="firstname">Titre</label>
                    <input type="text" name="titre" placeholder="Entrer le titre de la notification"
                        required>
                </div>
        
                <div class="form-group">
                    <label for="lastname">Type de notification</label>
                    <select name="ty_not">
                        <optgroup label="Choisir le type de la notification">
                        <option value="INFO">Informations</option>
                        <option value="ALERTE">Alerte</option>
                        </optgroup>
                    </select>
                </div>
        
                <div class="form-group">
                    <label for="subject" for="select_declencheur">Destinataire</label>
                    <select name="type_cible" id="select_declencheur" onchange="toggleSelect()">
                        <optgroup label="Choisir destinataire">
                        <option value="ALL">Tous les étudiants</option>
                        <option value="PARCOURS">Parcours</option>
                        <option value="ETUDIANT">Un étudiant</option>
                        </optgroup>
                    </select>
                </div>
                <div class="form-group" id="conteneur_second_select" style="display: none;">
                    <label for="second_select">PARCOURS</label>
                    <select name="cible_id" id="second_select">
                        <optgroup label="Choisir le parcours">
                        <?php
                            while($row = $result->fetch_assoc()){
                                echo '<option value="'.$row['id'].'">'.$row['nom_parcours'].'</option>';
                            }
                         ?>
                        </optgroup>
                    </select>
                </div>
                <div class="form-group" id="conteneur_mat" style="display: none;">
                    <label for="select">Matricule de l'étudiant</label>
                    <input type="text" placeholder="EX:24IAB23IU" name="cible_id" id="select" required>
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea name="message" rows="4" placeholder="Votre message ici..."></textarea>
                </div>
        
                <button type="submit" class="submit-btn" name="envoi">Envoyer</button>
               
            </form>
        </div>
 </center>
    </main>
    <script>
    // JavaScript
    function toggleSelect() {
        const selectDeclencheur = document.getElementById('select_declencheur');
        const conteneur = document.getElementById('conteneur_second_select');
        const mat = document.getElementById('conteneur_mat');

        // Si l'option sélectionnée a la valeur 'afficher'
        if (selectDeclencheur.value === 'PARCOURS') {
            // On affiche le conteneur (et donc le select)
            conteneur.style.display = 'block';
        } else {
            // Sinon, on le cache
            conteneur.style.display = 'none';
        }

        // Si l'option sélectionnée a la valeur 'affiche'
        if (selectDeclencheur.value === 'ETUDIANT') {
            // On affiche le conteneur (et donc le select)
            mat.style.display = 'block';
        } else {
            // Sinon, on le cache
            mat.style.display = 'none';
        }
    }
</script>
</body>


</html>