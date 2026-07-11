<?php
include "controllers/connbd.php";
$select="SELECT p.id,p.nom_parcours FROM parcours p,professeurs pr,filieres fil WHERE fil.id_filiere = pr.idFiliere AND p.id_filiere = fil.id_filiere ORDER BY nom_parcours";
$result=mysqli_query($bd,$select);
$sel="SELECT nom_matiere,code_matiere FROM matieres";
$res=mysqli_query($bd,$sel);
$s="SELECT DISTINCT semestre FROM matieres ORDER BY semestre";
$r=mysqli_query($bd,$s);
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
    <style>
        .tab-content {
            display: none;
        }

        .tab-button {
            cursor: pointer;
            padding: 10px;
        }
        input[type="text"],
        input[type="number"],
        input[type="file"],
select
{
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    /* Évite que le padding dépasse */
    font-size: 14px;
}

/* Focus effect */
input:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
}

/* Case à cocher */
.checkbox-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    font-size: 13px;
}

/* Bouton */
.submit-btn {
    width: 100%;
    background-color: #ea580c;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s ease;
}

.submit-btn:hover {
    background-color: #1e1b4b;
}

    </style>
</head>

<body>
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <h1>Mon IUT</h1>
            <p>Responsable pédagogique</p>
        </div>
        <ul class="sidebar-menu">
            <li><a href="index.php">Accueil</a></li>
            <li><a href="notif.php">Notifications</a></li>
            <li><a href="doc.php" class="active">Documentation</a></li>
        </ul>
        <div class="logout-lin">
            <a href="../enseignant/index.html">Connexion Professeur</a>
        </div>
        <div class="logout-link">
            <a href="../enseignant/api/deconnexion.php">Déconnexion</a>
        </div>
    </aside>

    <main class="main-content" id="mainContent"  style="height: 100%;">
        <header class="header">
            <div>
                <h1>Documentation</h1>
                <p>Envoyer les différentes notes et emploi de temps aux étudiants et professeurs. </p>
            </div>
        </header>

        <section class="task-list">
            <table class="task-table">
                <thead>
                    <tr>
                        <th><input type="radio" class="tab-button active" onclick="openTab(event, 'Tab1')" name="choix" checked> Notes</th>
                        <th><input type="radio" class="tab-button" onclick="openTab(event, 'Tab2')" name="choix"> Emploi de temps</th>
                        <th></th>
                    </tr>
                </thead>
                <center>
                <form action="controllers/note.php" method="post">

                <tbody id="Tab1" class="tab-content" style="display: block; justify-content: center;">
                    <tr>
                        <td>Matricule de l'étudiant</td>
                        <td><input type="text" placeholder="EX:24IAB23IU" name="mat_et" required></td>
                    <tr>
                        <td>Code de la matière</td>
                        <td><select name="s">
                            <optgroup label="---Choisir le code de la matière---">
                             <?php
                                 while($row = $res->fetch_assoc()){
                                   echo '<option value="'.$row['code_matiere'].'">'.$row['nom_matiere'].'</option>';
                                 }
                                ?>
                            </optgroup>
                        </select></td>
                    </tr>
                    <tr>
                        <td>Note Controle Continu
                        </td>
                        <td><input type="number" name="cc" placeholder="EX:10" required></td>
                    </tr>
                    <tr>
                    <td>Note TP
                    </td>
                    <td><input type="number" name="tp" placeholder="EX:8" required></td>
                    </tr>
                    <tr>
                        <td>Note Synthèse
                        </td>
                        <td><input type="number" name="sy" placeholder="EX:20" required></td>
                    </tr>
                     <tr>
                        <td>Semestre
                        </td>
                        <td><select id="subject" name="s">
                            <optgroup label="---Choisir le semestre---">
                             <?php
                                 while($row = $r->fetch_assoc()){
                                   echo '<option value="'.$row['semestre'].'">'.$row['semestre'].'</option>';
                                 }
                                ?>
                            </optgroup>
                        </select></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button type="submit" class="submit-btn" name="envoi">Envoyer</button></td>
                    </tr>
                </tbody>
                </form>
                <form action="controllers/upload_document.php" method="post" enctype="multipart/form-data">
                <tbody id="Tab2" class="tab-content">
                    <tr>
                        <td>Titre</td>
                        <td>Emploi de temps</td>
                    <tr>
                        <td>PARCOURS</td>
                        <td>
                            <select name="parcours">
                               <optgroup label="Choisir le parcours">
                                <?php
                                 while($row = $result->fetch_assoc()){
                                   echo '<option value="'.$row['id'].'">'.$row['nom_parcours'].'</option>';
                                 }
                                ?>
                               </optgroup>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Type document
                        </td>
                        <td>EDT</td>
                    </tr>
                    <tr>
                        <td>Contenu</td>
                        <td><input type="file" name="fichier" required></td>
                    <tr>
                    <tr>
                        <td></td>
                        <td><button type="submit" class="submit-btn" name="envoi">Envoyer</button></td>
                    </tr>
                </tbody>
                </form>
            </table>
        </section>
        
    </main>
</body>
<script>
    function openTab(evt, tabName) {
        let i, tabcontent, tablinks;

        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("tab-button");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
        
    }
</script>

</html>