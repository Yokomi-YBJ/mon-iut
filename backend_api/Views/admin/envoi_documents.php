<?php
session_start();

if (empty($_SESSION['admin'])) {
    header('Location: ../../index.php');
    exit;
}
// envoi_documents.php
require_once '../../Models/function.php'; // Connexion BDD

// Récupération des 5 derniers documents
$sqlHistory = "
    SELECT d.id, d.titre, d.date_publication, d.cible_type, d.niveau_cible,
        CASE
            WHEN d.cible_type = 'ALL' THEN 'Tous les étudiants'
            WHEN d.cible_type = 'CYCLE' THEN (SELECT nomCycle FROM cycle WHERE idCycle = d.cible_id)
            WHEN d.cible_type = 'FILIERE' THEN (SELECT nom_filiere FROM filieres WHERE id_filiere = d.cible_id)
            WHEN d.cible_type = 'PARCOURS' THEN (SELECT nom_parcours FROM parcours WHERE id = d.cible_id)
            WHEN d.cible_type = 'ETUDIANT' THEN (SELECT CONCAT(matricule, ' (', nom, ')') FROM etudiants WHERE matricule = d.cible_id OR id = d.cible_id LIMIT 1)
        END as nom_cible
    FROM documents d 
    ORDER BY d.date_publication DESC 
    LIMIT 4
";
$stmtHistory = $pdo->query($sqlHistory);
$documents = $stmtHistory->fetchAll(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Envoi Documents - Mon IUT</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/documents.css">
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
                <li><a href="envoi_documents.php" class="active">Documents</a></li>
                <li><a href="annonces.php">Annonces</a></li>
                <li><a href="#" class="btn-logout">Déconnexion</a></li>
            </ul>
        </div>
    </nav>

    <main class="main-container">
        <h2 class="page-title">Centre de partage de documents</h2>
        
        <div class="layout-grid">
            <section class="admin-card">
                <div class="card-header">
                    <h3>Nouveau Document</h3>
                </div>
                
                <form id="docForm" enctype="multipart/form-data">
                    

                    <div class="form-group">
                        <label>Fichier (PDF uniquement)</label>
                        <div class="file-upload-wrapper">
                            <input type="file" name="fichier" id="doc_file" accept=".pdf" required>
                            <div class="file-upload-visual">
                                <span>Glissez-déposez ou cliquez pour ajouter (PDF)</span>
                            </div>
                        </div>
                    </div>

                    <div class="targeting-section">
                        <h4 class="target-title">Destinataires</h4>
                        <div class="form-group">
                            <select id="target_type" name="target_type" required>
                                <option value="all">Tous les étudiants</option>
                                <option value="cycle">Par Cycle (DUT, Licence...)</option>
                                <option value="filiere">Par Filière</option>
                                <option value="parcours">Par Parcours</option>
                                <option value="student">Étudiant spécifique</option>
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
                        <div class="hidden-group">
                            <div class="form-group hidden" id="group_cycle">
                                <select id="sel_cycle"><option value="">-- Cycle --</option></select>
                            </div>
                            <div class="form-group hidden" id="group_filiere">
                                <select id="sel_filiere" disabled><option value="">-- Filière --</option></select>
                            </div>
                            <div class="form-group hidden" id="group_parcours">
                                <select id="sel_parcours" disabled><option value="">-- Parcours --</option></select>
                            </div>
                            <div class="form-group hidden" id="group_student">
                                <input type="text" id="student_id" placeholder="Matricule (Ex: 24GLO77IU)">
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Envoyer le document 📤</button>
                    </div>
                </form>
            </section>

            <section class="admin-card">
                <div class="card-header">
                    <h3>Historique des envois (4 derniers)</h3>
                </div>
                <ul class="doc-history" id="docHistoryList">
                    <?php if (empty($documents)): ?>
                        <li style="padding:15px; text-align:center; color:#666;">Aucun document envoyé.</li>
                    <?php else: ?>
                        <?php foreach ($documents as $doc): ?>
                            <li class="history-item">
                                <div class="doc-icon">PDF</div>
                               <div class="doc-info">
                                    <strong><?= htmlspecialchars($doc['titre']) ?></strong>
                                    <span>
                                        Cible : 
                                        <strong><?= htmlspecialchars($doc['nom_cible'] ?? 'Inconnue') ?></strong>
                                        <?php if($doc['niveau_cible'] !== 'all'): ?>
                                            <em>(Niveau <?= htmlspecialchars($doc['niveau_cible']) ?>)</em>
                                        <?php else: ?>
                                            <em>(Tous niveaux)</em>
                                        <?php endif; ?>
                                    </span>
                                    <span class="date"><?= time_elapsed_string($doc['date_publication']) ?></span>
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