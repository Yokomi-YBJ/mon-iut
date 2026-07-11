<?php
include "controllers/connbd.php";
$name="SELECT p.nom_complet,p.niveau_responsabilite FROM professeurs p,filieres fil WHERE fil.id_filiere = p.idFiliere";
$ET="SELECT fil.nom_filiere FROM filieres fil JOIN professeurs p ON fil.id_filiere = p.idFiliere";
$cycle="SELECT cy.nomCycle FROM cycle cy JOIN filieres fil ON fil.id_cycle = cy.idCycle";
$cr= mysqli_query($bd,$cycle);
$r= mysqli_query($bd,$ET);
$result= mysqli_query($bd,$name);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGTS HGG - Tâches du jour</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="styles/index.css">
     <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            display: flex;
            gap: 20px;
            max-width: 900px;
            padding: 20px;
        }

        .card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            flex: 1;
            /* Pour que les 3 blocs aient la même largeur */
            text-align: center;
            transition: transform 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
        }

        h2 {
            color: #2c3e50;
        }

        p {
            color: #7f8c8d;
            line-height: 1.6;
        }

        .btn-redirect {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 20px;
            background-color: #ea580c;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }

        .btn-redirect:hover {
            background-color: #1e1b4b;
        }
    </style>
</head>
<body>

    <button class="menu-toggle" id="menuToggle">&#9776;</button>

    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <h1>Mon IUT</h1>
            <p>Responsable pédagogique</p>
        </div>
        <ul class="sidebar-menu">
            <li><a href="index.php" class="active">Accueil</a></li>
            <li><a href="notif.php">Notifications</a></li>
            <li><a href="doc.php">Documentation</a></li>
        </ul>
        <div class="logout-lin">
            <a href="../enseignant/index.html">Connexion Professeur</a>
        </div>
        <div class="logout-link">
            <a href="../enseignant/api/deconnexion.php">Déconnexion</a>
        </div>
    </aside>

    <main class="main-content" id="mainContent">
        <header class="header">
            <div>
                <h1>Bienvenue, <span id="userName"><?php if($row=$result->fetch_assoc()){ echo $row['nom_complet'];} else{ echo "";}?> dans votre espace de gestion des informations et de données de vos étudiants.</span></h1>
                <p><h2>Vous etes le responsable pédagogique de <?php if($row=$r->fetch_assoc()){ echo $row['nom_filiere'];} else{ echo "Aucun resultat";}?> en Cycle <?php if($row=$cr->fetch_assoc()){ echo $row['nomCycle'];} else{ echo "Aucun resultat";}?> Niveau <?php if($row=$result->fetch_assoc()){ echo $row['niveau_responsabilite'];} else{ echo "Aucun resultat";}?>.</h2></p>
            </div>
        </header>
        <div class="container">
           

            <div class="card">
                <h2>Notification</h2>
               <p>Envoyer une ou plusieurs notifications à vos étudiants pour les passer une informations ou des nouvelles de l'administration!!!</p>
               <a href="notif.php" class="btn-redirect">Envoyer une notification</a>
            </div>

            <div class="card">
               <h2>Documentation</h2>
               <p>Envoyer les emplois du temps et les notes à vos différents étudiants pour qu'ils soient informés de l'avancement de leurs études.</p>
               <a href="doc.php" class="btn-redirect">Envoyer un document</a>
            </div>
        </div>
    </main>

</body>
</html>

