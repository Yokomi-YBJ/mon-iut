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
    <title>Gestion Étudiants - Mon IUT</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/etudiants.css">
    <style>
        .modal {
    display: none; 
    position: fixed; z-index: 1000; left: 0; top: 0;
    width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);
    }
    .modal-content {
        background-color: #fff; margin: 5% auto; padding: 20px;
        border-radius: 8px; width: 50%; max-width: 600px;
    }
    .modal-header {
        display: flex; justify-content: space-between; align-items: center;
        border-bottom: 1px solid #ddd; margin-bottom: 20px; padding-bottom: 10px;
    }
    .close-modal { cursor: pointer; font-size: 24px; font-weight: bold; }
    .form-grid-modal { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    </style>
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
                <li><a href="index.php">Tableau de bord</a></li>
                <li><a href="gestion_etudiants.php" class="active">Étudiants</a></li>
                <li><a href="gestion_profs.php">Professeurs</a></li>
                <li><a href="envoi_documents.php">Documents</a></li>
                <li><a href="annonces.php">Annonces</a></li>
                <li><a href="#" class="btn-logout">Déconnexion</a></li>
            </ul>
        </div>
    </nav>

    <main class="main-container">
        <h2 class="page-title">Gestion des Étudiants</h2>

        <section class="admin-card">
            <div class="card-header">
                <h3>Ajouter un nouvel étudiant</h3>
            </div>
            <form id="addStudentForm" class="admin-form" method="POST" action="../../Controllers/adminControllers/inscriptionEtudiants.php">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="nom">Nom</label>
                        <input type="text" id="nom" name="nom" placeholder="Ex: Talla" required>
                    </div>
                    <div class="form-group">
                        <label for="prenom">Prénom</label>
                        <input type="text" id="prenom" name="prenom" placeholder="Ex: Fabrice">
                    </div>
                    <div class="form-group">
                        <label for="matricule">Matricule</label>
                        <input type="text" id="matricule" name="matricule" placeholder="Ex: 21A123" required>
                    </div>

                    <div class="form-group">
                        <label for="cycle_create">Cycle</label>
                        <select id="cycle_create" name="cycle" required>
                            <option value="">-- Choisir Cycle --</option>
                            </select>
                    </div>
                    <div class="form-group">
                        <label for="filiere_create">Filière</label>
                        <select id="filiere_create" name="filiere" required>
                            <option value="">-- D'abord choisir Cycle --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="parcours_create">Parcours</label>
                        <select id="parcours_create" name="parcours"disabled required>
                            <option value="">-- D'abord choisir Filière --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="niveau_create">Niveau</label>
                        <select id="niveau_create" name="niveau" disabled required>
                            <option value="">-- Choisir Niveau --</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary" name="creerCompte">Créer le compte</button>
                </div>
            </form>
        </section>

        <section class="admin-card">
            <div class="card-header">
                <h3>Liste des étudiants</h3>
                <p>Utilisez les filtres pour afficher les étudiants (Sélectionnez au moins la filière).</p>
            </div>

            <div class="filter-box">
                <div class="form-grid four-cols">
                    <div class="form-group">
                        <label>Cycle</label>
                        <select id="cycle_filter">
                            <option value="">-- Tous --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Filière</label>
                        <select id="filiere_filter" disabled>
                            <option value="">-- Choisir --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Parcours</label>
                        <select id="parcours_filter" disabled>
                            <option value="">-- Choisir --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Niveau</label>
                        <select id="niveau_filter" disabled>
                            <option value="">-- Choisir --</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Matricule</th>
                            <th>Nom & Prénom</th>
                            <th>Info Académique</th>
                            <th>Niveau</th>
                            <th class="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="studentsTableBody">
                        <tr>
                            <td colspan="5" style="text-align:center; padding: 20px;">Veuillez sélectionner une filière pour voir les étudiants.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <div id="editModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Modifier l'Étudiant</h3>
            <span class="close-modal" onclick="closeEditModal()">&times;</span>
        </div>
        <form id="editStudentForm">
            <input type="hidden" id="edit_id" name="id">
            <div class="form-grid-modal">
                <div class="form-group">
                    <label>Matricule</label>
                    <input type="text" id="edit_matricule" name="matricule" required>
                </div>
                <div class="form-group">
                    <label>Nom</label>
                    <input type="text" id="edit_nom" name="nom" required>
                </div>
                <div class="form-group">
                    <label>Prénom</label>
                    <input type="text" id="edit_prenom" name="prenom" required>
                </div>
                <div class="form-group">
                    <label>Cycle</label>
                    <select id="cycle_edit" name="idCycle" required>
                        <option value="">-- Choisir --</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Filière</label>
                    <select id="filiere_edit" required disabled>
                        <option value="">-- Choisir --</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Parcours</label>
                    <select id="parcours_edit" name="id_parcours" required disabled>
                        <option value="">-- Choisir --</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Niveau</label>
                    <select id="niveau_edit" name="niveau" required disabled>
                        <option value="">-- Choisir --</option>
                    </select>
                </div>
            </div>
            <div class="form-actions" style="margin-top: 20px;">
                <button type="button" class="btn-secondary" onclick="closeEditModal()">Annuler</button>
                <button type="submit" class="btn-primary">Enregistrer les modifications</button>
            </div>
        </form>
    </div>
</div>
    </main>

    <script src="js/main.js"></script>
    <script src="js/etudiants.js"></script>
    <script src="js/logout.js"></script>
</body>
</html>