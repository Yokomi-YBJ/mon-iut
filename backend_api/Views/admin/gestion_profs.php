<?php
session_start();
// Views/admin/gestion_profs.php
require_once '../../Models/function.php';


if (empty($_SESSION['admin'])) {
    header('Location: ../../index.php');
    exit;
}

// Récupération des cycles pour initialiser les filtres
$cycles = $pdo->query("SELECT * FROM cycle ORDER BY nomCycle ASC")->fetchAll(PDO::FETCH_ASSOC);

// Liste des profs pour le tableau (avec jointures pour voir les responsabilités)
$sql = "SELECT p.*, f.nom_filiere as resp_filiere,
        (SELECT COUNT(*) FROM affectations_matieres WHERE id_professeur = p.id) as nb_cours
        FROM professeurs p
        LEFT JOIN filieres f ON f.id_filiere = p.idFiliere
        ORDER BY p.id DESC";
$profs = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des Professeurs - Mon IUT</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/etudiants.css">
    <link rel="stylesheet" href="css/profs.css">
    <style>
        .layout-grid { display: grid; grid-template-columns: 400px 1fr; gap: 20px; align-items: start; }
        .box-filter { background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #cbd5e1; }
        .filter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .multiselect-container { max-height: 250px; overflow-y: auto; border: 1px solid #cbd5e1; background: white; padding: 10px; border-radius: 5px; }
        .multiselect-container label { display: block; padding: 5px; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
        .multiselect-container label:hover { background: #e2e8f0; }
        .hidden { display: none; }
        .badge { padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
        .badge-resp { background: #fee2e2; color: #b91c1c; }
        .badge-ens { background: #dcfce7; color: #15803d; }
    </style>
</head>
<body>
    <nav class="navbar" role="navigation" aria-label="Navigation principale">
        <div class="nav-container">
            <a href="index.php" class="logo-container">
                <img src="images/logo.png" alt="Logo IUT" class="logo-img">
                <div class="logo-text">Mon <span>IUT</span></div>
            </a>
            
            <button class="menu-toggle">&#9776;</button>

            <ul class="nav-links">
                <li><a href="index.php" >Tableau de bord</a></li>
                <li><a href="gestion_etudiants.php">Étudiants</a></li>
                <li><a href="gestion_profs.php" class="active">Professeurs</a></li>
                <li><a href="envoi_documents.php">Documents</a></li>
                <li><a href="annonces.php">Annonces</a></li>
                <li><a href="#" class="btn-logout">Déconnexion</a></li>
            </ul>
        </div>
    </nav>

    <main class="main-container">
        <h2 class="page-title">Administration des Enseignants</h2>

        <div class="layout-grid">
            <section class="admin-card">
                <div class="card-header"><h3>Ajouter un Professeur</h3></div>
                <form id="profForm" class="admin-form">
                    <div class="form-group">
                        <label>Nom Complet</label>
                        <input type="text" name="nom_prof" required>
                    </div>
                    <div class="form-group">
                        <label>Email (Identifiant)</label>
                        <input type="email" name="email_prof" required>
                    </div>
                    <div class="form-group">
                        <label>Mot de passe</label>
                        <input type="password" name="pwd_prof" required>
                    </div>
                    <div class="form-group">
                        <label>Rôle</label>
                        <select name="role_prof" id="role_prof">
                            <option value="enseignant">Enseignant</option>
                            <option value="responsable">Responsable Pédagogique</option>
                        </select>
                    </div>

                    <div id="bloc_responsable" class="hidden box-filter">
                        <p><strong>Détails Responsabilité</strong></p>
                        <div class="form-group">
                            <select id="resp_cycle" class="sm-select">
                                <option value="">-- Cycle --</option>
                                <?php foreach($cycles as $c): ?>
                                    <option value="<?= $c['idCycle'] ?>"><?= $c['nomCycle'] ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-group">
                            <select name="filiere_responsable" id="filiere_responsable" disabled></select>
                        </div>
                        <div class="form-group">
                            <select name="niveau_responsable" id="niveau_responsable" disabled></select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Affecter des Cours (Unités d'enseignement)</label>
                        <div class="box-filter">
                            <div class="filter-grid">
                                <select id="f_cycle"><option value="">Cycle</option>
                                    <?php foreach($cycles as $c): ?> <option value="<?= $c['idCycle'] ?>"><?= $c['nomCycle'] ?></option> <?php endforeach; ?>
                                </select>
                                <select id="f_filiere" disabled><option value="">Filière</option></select>
                                <select id="f_parcours" disabled><option value="">Parcours</option></select>
                                <select id="f_niveau" disabled><option value="">Niveau</option></select>
                            </div>
                        </div>
                        <div class="multiselect-container" id="matieres_list">
                            <p style="text-align:center; color:#64748b; font-size:0.8rem;">Utilisez les filtres pour afficher les matières.</p>
                        </div>
                    </div>

                    <button type="submit" class="btn-primary" style="width:100%">Enregistrer le Professeur</button>
                </form>
            </section>

            <section class="admin-card">
                <div class="card-header"><h3>Liste du Corps Enseignant</h3></div>
                        <div class="table-responsive">
                        <table class="etudiants-table" role="table" aria-label="Liste des professeurs">
                    <thead>
                        <tr><th>Nom</th><th>Role</th><th>Responsabilité</th><th>Nombres d'UE</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        <?php foreach($profs as $p): ?>
                        <tr>
                            <td><strong><?= htmlspecialchars($p['nom_complet']) ?></strong></td>
                            <td><span class="badge <?= $p['resp_filiere'] ? 'badge-resp' : 'badge-ens' ?>"><?= ($p['niveau_responsabilite'] ==NULL)? 'Enseignant' : 'Responsable Pédagogique' ?></span></td>
                            <td><?= $p['resp_filiere'] ? $p['resp_filiere']." (Niv ".$p['niveau_responsabilite'].")" : '' ?></td>
                            <td><?= $p['nb_cours'] ?> UE</td>
                            <td><button class="btn-edit">✏️</button></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                </div>
            </section>
        </div>
    </main>
    <script src="js/profs.js"></script>
    <script src="js/logout.js"></script>
</body>
</html>