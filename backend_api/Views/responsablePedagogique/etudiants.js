/* js/etudiants.js - Version finale connectée à la base de données */

document.addEventListener('DOMContentLoaded', () => {
    
    // Variable pour stocker la structure académique récupérée de la BDD
    let academicData = null;

    /**
     * 1. INITIALISATION
     * Récupère la structure (Cycles -> Filières -> Parcours) au chargement
     */
    async function initApp() {
        try {
            // Appel à l'API que nous avons créée précédemment
            // Chemin relatif corrigé : depuis Views/admin la bonne remontée est de deux niveaux
                const response = await fetch('../../Controllers/adminControllers/get_structure_etudiants.php');
            if (!response.ok) throw new Error("Erreur réseau");
            
            academicData = await response.json();
            
            // Initialisation des listes déroulantes pour les filtres et le formulaire
            setupCascadingSelects('filter');
            setupCascadingSelects('create');
            
            // Chargement initial de tous les étudiants
            loadStudents();
        } catch (error) {
            console.error("Erreur lors de l'initialisation :", error);
        }
    }

    /**
     * 2. GESTION DES SELECTS EN CASCADE
     * Remplit les filières selon le cycle, et les parcours selon la filière
     */
    function setupCascadingSelects(prefix) {
        const cycleSelect = document.getElementById(`cycle_${prefix}`);
        const filiereSelect = document.getElementById(`filiere_${prefix}`);
        const parcoursSelect = document.getElementById(`parcours_${prefix}`);

        if (!cycleSelect || !academicData) return;

        // Remplir les Cycles (idCycle de la table cycle)
        academicData.cycles.forEach(c => {
            cycleSelect.add(new Option(c.nom, c.id));
        });

    // Événement : Changement de Cycle
    cycleSelect.addEventListener('change', () => {
            const isSelected = cycleSelect.value !== "";
            filiereSelect.disabled = !isSelected;
            filiereSelect.innerHTML = '<option value="">-- Choisir Filière --</option>';
            
            parcoursSelect.disabled = true;
            parcoursSelect.innerHTML = '<option value="">-- D\'abord filière --</option>';

            // Mettre à jour le select niveau selon le cycle sélectionné
            const niveauSelect = document.getElementById(`niveau_${prefix}`);
            if (niveauSelect) {
                if (!isSelected) {
                    niveauSelect.disabled = true;
                    niveauSelect.innerHTML = '<option value="">-- Choisir Niveau --</option>';
                } else if (String(cycleSelect.value) === '3') { // Licence
                    niveauSelect.disabled = false;
                    niveauSelect.innerHTML = '<option value="">-- Choisir Niveau --</option><option value="3">3</option>';
                } else { // BTS ou DUT -> niveaux 1 & 2
                    niveauSelect.disabled = false;
                    niveauSelect.innerHTML = '<option value="">-- Choisir Niveau --</option><option value="1">1</option><option value="2">2</option>';
                }
            }

            if (isSelected) {
                // Filtrer les filières correspondant au cycle sélectionné (id_cycle depuis get_structure.php)
                const matched = academicData.filieres.filter(f => String(f.id_cycle) === String(cycleSelect.value));
                console.debug('filieres total:', academicData.filieres, 'matched:', matched.length, 'for cycle', cycleSelect.value);
                if (matched.length === 0) {
                    // Aucune filière en base pour ce cycle
                    filiereSelect.innerHTML = '<option value="">-- Aucune filière pour ce cycle --</option>';
                    filiereSelect.disabled = true;
                    parcoursSelect.innerHTML = '<option value="">-- D\'abord filière --</option>';
                    parcoursSelect.disabled = true;
                } else {
                    matched.forEach(f => {
                        filiereSelect.add(new Option(f.nom, f.id));
                    });
                    filiereSelect.disabled = false;
                }
            }
            
            // Si c'est le filtre, on recharge la liste au changement de cycle
            if (prefix === 'filter') loadStudents();
        });

        // Événement : Changement de Filière
        filiereSelect.addEventListener('change', () => {
            const isSelected = filiereSelect.value !== "";
            parcoursSelect.disabled = !isSelected;
            parcoursSelect.innerHTML = '<option value="">-- Choisir Parcours --</option>';

            if (isSelected) {
                const selectedFiliere = academicData.filieres.find(f => f.id == filiereSelect.value);
                if (selectedFiliere && selectedFiliere.parcours) {
                    parcoursSelect.disabled = false;
                    selectedFiliere.parcours.forEach(p => {
                        parcoursSelect.add(new Option(p.nom, p.id));
                    });
                }
                // Activer le select niveau (ex: 1 ou 2)
                const niveauSelect = document.getElementById(`niveau_${prefix}`);
                if (niveauSelect) {
                    niveauSelect.disabled = false;
                    niveauSelect.innerHTML = '<option value="">-- Choisir Niveau --</option>' +
                        '<option value="1">1</option><option value="2">2</option>';
                }
            } else {
                parcoursSelect.disabled = true;
            }
        });

        // Rechargement auto pour les filtres quand le parcours est choisi
        if (prefix === 'filter') {
            parcoursSelect.addEventListener('change', loadStudents);
        }
    }

    /**
     * 3. CHARGEMENT ET AFFICHAGE DES ETUDIANTS
     * Récupère les données réelles via get_etudiants.php
     */
    async function loadStudents() {
        const tbody = document.getElementById('studentsTableBody');
        const cycleId = document.getElementById('cycle_filter').value;
        const parcoursId = document.getElementById('parcours_filter').value;
        const niveauId = document.getElementById('niveau_filter').value;

        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Chargement des données...</td></tr>';

        try {
            // Construction de l'URL avec les paramètres de filtrage
                const url = `../../Controllers/adminControllers/get_etudiants.php?cycle=${cycleId}&parcours=${parcoursId}&niveau=${niveauId}`;
            const response = await fetch(url);
            const students = await response.json();

            tbody.innerHTML = '';

            if (students.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">Aucun étudiant ne correspond à ces critères.</td></tr>';
                return;
            }

            students.forEach(s => {
                const row = `
                    <tr>
                        <td><strong>${s.matricule}</strong></td>
                        <td>${s.nom.toUpperCase()} ${s.prenom}</td>
                        <td>
                            <div style="font-size: 0.9em; font-weight:bold;">${s.nomCycle} - ${s.nom_filiere}</div>
                            <div style="font-size: 0.8em; color: #666;">${s.nom_parcours}</div>
                        </td>
                        <td>Niveau ${s.niveau}</td>
                        <td class="text-right">
                            <button class="action-btn btn-edit" onclick="editStudent(${s.id})">✏️</button>
                            <button class="action-btn btn-delete" onclick="deleteStudent(${s.id})">🗑️</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Erreur de connexion à la base de données.</td></tr>';
        }
    }




    // Fonctions globales attachées à window pour les boutons du tableau
    window.deleteStudent = async (id) => {
        if (confirm('Voulez-vous vraiment supprimer cet étudiant de la base de données ?')) {
            // Logique de suppression à implémenter avec un fetch vers api_delete.php
            console.log("Suppression demandée pour l'ID:", id);
        }
    };

    window.editStudent = (id) => {
        // Logique de modification
        console.log("Modification demandée pour l'ID:", id);
    };

    // Lancement de l'application
    initApp();
});