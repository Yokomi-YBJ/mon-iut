<?php
// annonces.php
session_start();

if (empty($_SESSION['admin'])) {
    header('Location: ../../index.php');
    exit;
}

require_once '../../Models/function.php';

// Récupère les 5 dernières notifs avec le nombre de destinataires
$sql = "SELECT n.id, n.titre, n.date_envoi, COUNT(nd.id) as nb_destinataires 
        FROM notifications n
        LEFT JOIN notification_destinataires nd ON n.id = nd.id_notification
        GROUP BY n.id
        ORDER BY n.date_envoi DESC 
        LIMIT 4";

$stmt = $pdo->query($sql);
$annonces = $stmt->fetchAll(PDO::FETCH_ASSOC);


?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Envoi Annonces - Mon IUT</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/annonces.css">
    <link rel="stylesheet" type="text/css" href="css/etudiants.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.php" class="logo-container">
                <img src="images/logo.png" alt="Logo IUT" class="logo-img">
                <div class="logo-text">Mon <span>IUT</span></div>
            </a>
            <ul class="nav-links">
                <li><a href="index.php">Tableau de bord</a></li>
                <li><a href="gestion_etudiants.php">Étudiants</a></li>
                <li><a href="gestion_profs.php">Professeurs</a></li>
                <li><a href="envoi_documents.php">Documents</a></li>
                <li><a href="annonces.php" class="active">Annonces</a></li>
                <li><a href="#" class="btn-logout">Déconnexion</a></li>
            </ul>
        </div>
    </nav>

    <main class="main-container">
        <h2 class="page-title">Centre d'envoi d'annonces</h2>

        <div class="layout-grid">
            
            <section class="admin-card">
                <div class="card-header">
                    <h3>Nouvelle Annonce</h3>
                </div>
                <form id="docForm" class="admin-form">
                    
                    <div class="form-group">
                        <label for="doc_title">Sujet de l'annonce</label>
                        <input type="text" id="doc_title" name="titre" required placeholder="Ex: Report du cours de Java">
                    </div>

                    <div class="form-group">
                        <label>Message</label>
                        <textarea id="message" name="message" placeholder="Rédigez votre communiqué..." rows="5" required></textarea>
                    </div>

                    <div class="targeting-section">
                        <h4 class="target-title">Destinataires</h4>
                        
                        <div class="form-group">
                            <label for="target_type">Envoyer à :</label>
                            <select id="target_type" name="target_type" required>
                                <option value="all">Tous les étudiants</option>
                                <option value="cycle">Un Cycle complet (BTS, DUT...)</option>
                                <option value="filiere">Une Filière spécifique</option>
                                <option value="parcours">Un Parcours spécifique</option>
                                <option value="student">Un Étudiant unique</option>
                            </select>
                        </div>
                        <div class="form-group">
                                <label for="niveau">Niveau d'étude :</label>
                                <select id="niveau" name="niveau">
                                    <option value="all">Tous les niveaux</option>
                                    <option value="1">Niveau 1 (BTS1, DUT1...)</option>
                                    <option value="2">Niveau 2 (BTS2, DUT2...)</option>
                                    <option value="3">Niveau 3 (Licence)</option>
                                </select>
                        </div>

                        <div id="dynamic_selects" class="hidden-group">
                            <div class="form-group hidden" id="group_cycle">
                                <label>Choisir Cycle</label>
                                <select id="sel_cycle"><option value="">-- Cycle --</option></select>
                            </div>
                            <div class="form-group hidden" id="group_filiere">
                                <label>Choisir Filière</label>
                                <select id="sel_filiere" disabled><option value="">-- Filière --</option></select>
                            </div>
                            <div class="form-group hidden" id="group_parcours">
                                <label>Choisir Parcours</label>
                                <select id="sel_parcours" disabled><option value="">-- Parcours --</option></select>
                            </div>
                            <div class="form-group hidden" id="group_student">
                                <label>Matricule de l'étudiant</label>
                                <input type="text" id="student_id" placeholder="Ex: 24GLO77IU">
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Publier l'annonce </button>
                    </div>
                </form>
            </section>

            <section class="admin-card">
                <div class="card-header">
                    <h3>Historique des annonces (4 dernières)</h3>
                </div>
                <ul class="doc-history" id="docHistoryList">
                    <?php if(empty($annonces)): ?>
                        <li style="padding:20px; text-align:center; color:#888;">Aucune annonce publiée.</li>
                    <?php else: ?>
                        <?php foreach($annonces as $notif): ?>
                        <li class="history-item">
                            <div class="doc-icon" style="background: #e0f2fe; color: #0284c7;">INFO</div>
                            <div class="doc-info">
                                <strong><?= htmlspecialchars($notif['titre']) ?></strong>
                                <span>Destinataires : <?= $notif['nb_destinataires'] ?> étudiant(s)</span>
                                <span class="date"><?= time_elapsed_string($notif['date_envoi']) ?></span>
                            </div>
                        </li>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </ul>
            </section>
        </div>
    </main>
    
    <script src="js/communication.js"></script>
    <script src="js/logout.js"></script>
</body>
</html>