/* js/communication.js */
document.addEventListener('DOMContentLoaded', () => {

    // --- A. GESTION VISUELLE FICHIER (PDF ONLY) ---
    const fileInput = document.getElementById('doc_file');
    const fileVisual = document.querySelector('.file-upload-visual');
    const originalText = fileVisual ? fileVisual.innerHTML : '';

    if(fileInput && fileVisual) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                const fileName = this.files[0].name;
                // Visuel : Icône PDF + Nom du fichier
                fileVisual.innerHTML = `
                    <div style="color: #e11d48; font-size: 2rem;">📄</div>
                    <div style="color: #0f172a; font-weight: bold; margin-top:5px;">${fileName}</div>
                `;
                fileVisual.parentElement.style.borderColor = "#e11d48";
                fileVisual.parentElement.style.backgroundColor = "#fff1f2";
            } else {
                fileVisual.innerHTML = originalText;
                fileVisual.parentElement.style = "";
            }
        });
    }

    // --- B. LOGIQUE BACKEND ---
    const targetTypeSelect = document.getElementById('target_type');
    if(!targetTypeSelect) return; // Sécurité si on est sur une autre page

    const selCycle = document.getElementById('sel_cycle');
    const selFiliere = document.getElementById('sel_filiere');
    const selParcours = document.getElementById('sel_parcours');
    const inputStudent = document.getElementById('student_id');

    // Groupes visuels
    const groups = {
        cycle: document.getElementById('group_cycle'),
        filiere: document.getElementById('group_filiere'),
        parcours: document.getElementById('group_parcours'),
        student: document.getElementById('group_student')
    };

    // 1. Fonction Fetch (Chemin corrigé : pas de ../../)
    async function fetchData(type, parentId = 0) {
        try {
            // ATTENTION : On part de la racine du site
            const response = await fetch(`../../Controllers/adminControllers/get_structure.php?type=${type}&id=${parentId}`);
            if (!response.ok) throw new Error("Erreur réseau");
            return await response.json();
        } catch (error) {
            console.error('Erreur API:', error);
            return [];
        }
    }

    function populateSelect(select, data, defaultText) {
        select.innerHTML = `<option value="">${defaultText}</option>`;
        data.forEach(item => select.add(new Option(item.nom, item.id)));
        select.disabled = data.length === 0;
    }

    // 2. Gestion Affichage (Cascade)
    targetTypeSelect.addEventListener('change', function() {
        // Reset tout
        Object.values(groups).forEach(g => g && g.classList.add('hidden'));
        
        const type = this.value;
        if(type === 'cycle') groups.cycle.classList.remove('hidden');
        if(type === 'filiere') { groups.cycle.classList.remove('hidden'); groups.filiere.classList.remove('hidden'); }
        if(type === 'parcours') { groups.cycle.classList.remove('hidden'); groups.filiere.classList.remove('hidden'); groups.parcours.classList.remove('hidden'); }
        if(type === 'student') groups.student.classList.remove('hidden');
    });

    // 3. Chargement des données
    fetchData('cycle').then(data => populateSelect(selCycle, data, '-- Cycle --'));

    selCycle.addEventListener('change', async function() {
        if(this.value) {
            const data = await fetchData('filiere', this.value);
            populateSelect(selFiliere, data, '-- Filière --');
            selParcours.innerHTML = '<option value="">-- Parcours --</option>'; selParcours.disabled = true;
        }
    });

    selFiliere.addEventListener('change', async function() {
        if(this.value) {
            const data = await fetchData('parcours', this.value);
            populateSelect(selParcours, data, '-- Parcours --');
        }
    });

    // 4. Envoi Formulaire
    const form = document.getElementById('docForm');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const oldText = btn.innerHTML;
            btn.innerHTML = "Envoi..."; 
            btn.disabled = true;

            const formData = new FormData(form);
            // Ajout manuel des valeurs conditionnelles si nécessaire
            if (targetTypeSelect.value === 'cycle') formData.set('target_value', selCycle.value);
            else if (targetTypeSelect.value === 'filiere') formData.set('target_value', selFiliere.value);
            else if (targetTypeSelect.value === 'parcours') formData.set('target_value', selParcours.value);
            else if (targetTypeSelect.value === 'student') formData.set('target_value', 'ETUDIANT');

            // Détection URL (Upload ou Annonce ?)
            const url = fileInput ? '../../Controllers/adminControllers/upload_document.php' : '../../Controllers/adminControllers/send_annonce.php';

            try {
                const req = await fetch(url, { method: 'POST', body: formData });
                const textResult = await req.text(); // On lit en texte d'abord pour déboguer si ce n'est pas du JSON
                
                try {
                    const res = JSON.parse(textResult);
                    if(res.success) {
                        alert(res.message);
                        window.location.reload(); // On recharge pour mettre à jour l'historique PHP
                    } else {
                        alert("Erreur : " + res.message);
                    }
                } catch(e) {
                    console.log("Erreur serveur non-JSON :", textResult);
                    alert("Erreur technique serveur. Vérifiez la console (F12).");
                }
            } catch (err) {
                alert("Erreur de connexion.");
            } finally {
                btn.innerHTML = oldText;
                btn.disabled = false;
            }
        });
    }
});