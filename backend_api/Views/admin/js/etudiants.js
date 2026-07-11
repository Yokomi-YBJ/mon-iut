/* js/etudiants.js */
document.addEventListener('DOMContentLoaded', () => {
    let academicData = null;

    async function initApp() {
        try {
            const response = await fetch('../../Controllers/adminControllers/get_structure_etudiants.php');
            academicData = await response.json();
            setupCascadingSelects('filter');
            setupCascadingSelects('create');
            loadStudents();
        } catch (error) { console.error("Erreur init:", error); }
    }

    function setupCascadingSelects(prefix) {
        const cycleSelect = document.getElementById(`cycle_${prefix}`);
        const filiereSelect = document.getElementById(`filiere_${prefix}`);
        const parcoursSelect = document.getElementById(`parcours_${prefix}`);
        const niveauSelect = document.getElementById(`niveau_${prefix}`);

        if (!cycleSelect || !academicData) return;

        // Remplissage des cycles
        academicData.cycles.forEach(c => {
            cycleSelect.add(new Option(c.nom, c.id));
        });

        cycleSelect.addEventListener('change', () => {
            const isSelected = cycleSelect.value !== "";
            filiereSelect.disabled = !isSelected;
            filiereSelect.innerHTML = '<option value="">-- Choisir Filière --</option>';
            parcoursSelect.disabled = true;
            parcoursSelect.innerHTML = '<option value="">-- D\'abord filière --</option>';

            // LOGIQUE AUTOMATIQUE DU NIVEAU (basée sur ton code)
            if (niveauSelect) {
                niveauSelect.innerHTML = '<option value="">-- Choisir Niveau --</option>';
                if (isSelected) {
                    niveauSelect.disabled = false;
                    // Si Cycle 3 = Licence, sinon BTS/DUT
                    if (String(cycleSelect.value) === '3') {
                        niveauSelect.innerHTML += '<option value="3">3</option>';
                    } else {
                        niveauSelect.innerHTML += '<option value="1">1</option><option value="2">2</option>';
                    }
                } else {
                    niveauSelect.disabled = true;
                }
            }

            if (isSelected) {
                const matched = academicData.filieres.filter(f => String(f.id_cycle) === String(cycleSelect.value));
                matched.forEach(f => filiereSelect.add(new Option(f.nom, f.id)));
            }
            if (prefix === 'filter') loadStudents();
        });

        filiereSelect.addEventListener('change', () => {
            const isSelected = filiereSelect.value !== "";
            parcoursSelect.disabled = !isSelected;
            parcoursSelect.innerHTML = '<option value="">-- Choisir Parcours --</option>';

            if (isSelected) {
                const selectedFiliere = academicData.filieres.find(f => f.id == filiereSelect.value);
                if (selectedFiliere && selectedFiliere.parcours) {
                    selectedFiliere.parcours.forEach(p => parcoursSelect.add(new Option(p.nom, p.id)));
                }
            }
            if (prefix === 'filter') loadStudents();
        });

        // Déclencheurs de filtres
        if (prefix === 'filter') {
            parcoursSelect.addEventListener('change', loadStudents);
            if(niveauSelect) niveauSelect.addEventListener('change', loadStudents);
        }
    }

    async function loadStudents() {
        const tbody = document.getElementById('studentsTableBody');
        const cycleId = document.getElementById('cycle_filter').value;
        const filiereId = document.getElementById('filiere_filter').value;
        const parcoursId = document.getElementById('parcours_filter').value;
        const niveauId = document.getElementById('niveau_filter').value;

        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Chargement...</td></tr>';

        try {
            // URL avec tous les paramètres (y compris filiere)
            const url = `../../Controllers/adminControllers/get_etudiants.php?cycle=${cycleId}&filiere=${filiereId}&parcours=${parcoursId}&niveau=${niveauId}`;
            const response = await fetch(url);
            const students = await response.json();

            tbody.innerHTML = '';
            if (students.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">Aucun résultat.</td></tr>';
                return;
            }

            students.forEach(s => {
                tbody.innerHTML += `
                    <tr>
                        <td><strong>${s.matricule}</strong></td>
                        <td>${s.nom.toUpperCase()} ${s.prenom}</td>
                        <td>${s.nomCycle} - ${s.nom_filiere}<br><small>${s.nom_parcours}</small></td>
                        <td>Niveau ${s.niveau}</td>
                        <td class="text-right">
                            <button class="action-btn" onclick="editStudent(${s.id})">✏️</button>
                            <button class="action-btn" onclick="deleteStudent(${s.id})">🗑️</button>
                        </td>
                    </tr>`;
            });
        } catch (error) { tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Erreur serveur.</td></tr>'; }
    }

    window.deleteStudent = async (id) => {
        if (confirm('Voulez-vous désactiver le compte de cet étudiant ?')) {
            const response = await fetch('../../Controllers/adminControllers/api_delete.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            if (result.success) loadStudents();
            else alert(result.message);
        }
    };
            
        // Charger les données dans le modal
        window.editStudent = async (id) => {
            try {
                // 1. Récupérer les infos de l'étudiant via l'API existante ou une nouvelle
                // Ici, on va chercher l'étudiant dans la liste déjà chargée pour aller vite
                const response = await fetch(`../../Controllers/adminControllers/get_etudiants.php`); // Ou un script get_student_by_id.php
                const students = await response.json();
                const s = students.find(student => student.id == id);

                if (!s) return alert("Étudiant non trouvé");

                // 2. Remplir les champs de base
                document.getElementById('edit_id').value = s.id;
                document.getElementById('edit_matricule').value = s.matricule;
                document.getElementById('edit_nom').value = s.nom;
                document.getElementById('edit_prenom').value = s.prenom;

                // 3. Initialiser les sélecteurs en cascade pour le modal
                setupCascadingSelects('edit');

                // 4. Pré-sélectionner les valeurs (Attention: l'ordre est important à cause du disabled)
                const cycleSelect = document.getElementById('cycle_edit');
                cycleSelect.value = s.idCycle;
                cycleSelect.dispatchEvent(new Event('change')); // Déclenche le remplissage des filières

                const filiereSelect = document.getElementById('filiere_edit');
                // On attend un micro-délai que le JS remplisse les filières
                setTimeout(() => {
                    // Trouver la filière via le parcours
                    const filiere = academicData.filieres.find(f => f.parcours.some(p => p.id == s.id_parcours));
                    if(filiere) {
                        filiereSelect.value = filiere.id;
                        filiereSelect.dispatchEvent(new Event('change')); // Déclenche les parcours
                        
                        setTimeout(() => {
                            document.getElementById('parcours_edit').value = s.id_parcours;
                            document.getElementById('niveau_edit').value = s.niveau;
                        }, 50);
                    }
                }, 50);

                document.getElementById('editModal').style.display = 'block';
            } catch (e) { console.error(e); }
        };

        window.closeEditModal = () => {
            document.getElementById('editModal').style.display = 'none';
        };

        // Gérer la soumission du formulaire de modification
        document.getElementById('editStudentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('../../Controllers/adminControllers/update_student.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const res = await response.json();
                if (res.success) {
                    alert("Étudiant mis à jour !");
                    closeEditModal();
                    loadStudents(); // Rafraîchir le tableau
                } else {
                    alert("Erreur : " + res.message);
                }
            } catch (err) { alert("Erreur de connexion."); }
        });

    initApp();
});