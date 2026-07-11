<?php
session_start();

if (empty($_SESSION['admin'])) {
    header('Location: ../../index.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accueil - Administration Mon IUT</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/home.css">
</head>
<body>

    <nav class="navbar">
        <div class="nav-container">
            <a href="index.php" class="logo-container">
                <img src="images/logo.png" alt="Logo IUT" class="logo-img">
                <div class="logo-text">Mon <span>IUT</span></div>
            </a>
            
            <button class="menu-toggle">&#9776;</button>

            <ul class="nav-links">
                <li><a href="index.php" class="active">Tableau de bord</a></li>
                <li><a href="gestion_etudiants.php">Étudiants</a></li>
                <li><a href="gestion_profs.php">Professeurs</a></li>
                <li><a href="envoi_documents.php">Documents</a></li>
                <li><a href="annonces.php">Annonces</a></li>
                <li><a href="#" class="btn-logout">Déconnexion</a></li>
            </ul>
        </div>
    </nav>

    <main class="main-container">
        <header class="welcome-section">
            <h1>Bienvenue, Administrateur</h1>
            <p>Gérez l'ensemble de la plateforme Mon IUT depuis cet espace.</p>
        </header>

        <section class="dashboard-grid">
            
            <div class="card">
                <div class="card-icon" style="background-color: #e0f2fe; color: #0284c7;">🎓</div>
                <h3>Gestion Étudiants</h3>
                <p>Créer, modifier et gérer les comptes étudiants, filières et parcours.</p>
                <a href="gestion_etudiants.php" class="card-link">Accéder &rarr;</a>
            </div>

            <div class="card">
                <div class="card-icon" style="background-color: #fef3c7; color: #d97706;">👨‍🏫</div>
                <h3>Gestion Professeurs</h3>
                <p>Gérer le corps enseignant et les responsables pédagogiques.</p>
                <a href="gestion_profs.php" class="card-link">Accéder &rarr;</a>
            </div>

            <div class="card">
                <div class="card-icon" style="background-color: #dcfce7; color: #16a34a;">📁</div>
                <h3>Documents</h3>
                <p>Envoyer des supports de cours et documents administratifs.</p>
                <a href="envoi_documents.php" class="card-link">Accéder &rarr;</a>
            </div>

            <div class="card">
                <div class="card-icon" style="background-color: #f3e8ff; color: #9333ea;">📢</div>
                <h3>Annonces</h3>
                <p>Publier des annonces importantes pour les étudiants.</p>
                <a href="annonces.php" class="card-link">Accéder &rarr;</a>
            </div>

        </section>
    </main>

    <script src="js/main.js"></script>
    <script src="js/logout.js"></script>
</body>
</html>
