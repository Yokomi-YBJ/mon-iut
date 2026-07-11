// js/profs.js
document.addEventListener('DOMContentLoaded', () => {

    // --- FONCTION API COMMUNE ---
    async function fetchAPI(type, id) {
        const res = await fetch(`../../Controllers/adminControllers/get_structure.php?type=${type}&id=${id}`);
        return await res.json();
    }

    // --- 1. GESTION DU RÔLE RESPONSABLE ---
    const roleSelect = document.getElementById('role_prof');
    const blocResp = document.getElementById('bloc_responsable');
    const rCycle = document.getElementById('resp_cycle');
    const rFiliere = document.getElementById('filiere_responsable');
    const rNiveau = document.getElementById('niveau_responsable');

    roleSelect.addEventListener('change', () => {
        blocResp.classList.toggle('hidden', roleSelect.value !== 'responsable');
    });

    rCycle.addEventListener('change', async () => {
        const cycleNom = rCycle.options[rCycle.selectedIndex].text;
        const data = await fetchAPI('filiere', rCycle.value);
        
        rFiliere.innerHTML = '<option value="">-- Filière --</option>';
        data.forEach(d => rFiliere.add(new Option(d.nom, d.id)));
        rFiliere.disabled = false;

        // Gestion du niveau automatique
        rNiveau.innerHTML = '<option value="">-- Niveau --</option>';
        if(cycleNom.includes('LICENCE')) {
            rNiveau.add(new Option('Niveau 3', '3'));
        } else {
            rNiveau.add(new Option('Niveau 1', '1'));
            rNiveau.add(new Option('Niveau 2', '2'));
        }
        rNiveau.disabled = false;
    });

    // --- 2. GESTION DES FILTRES DE MATIÈRES ---
    const fCycle = document.getElementById('f_cycle');
    const fFiliere = document.getElementById('f_filiere');
    const fParcours = document.getElementById('f_parcours');
    const fNiveau = document.getElementById('f_niveau');
    const matList = document.getElementById('matieres_list');

    fCycle.addEventListener('change', async () => {
        const cycleNom = fCycle.options[fCycle.selectedIndex].text;
        const data = await fetchAPI('filiere', fCycle.value);
        fFiliere.innerHTML = '<option value="">Filière</option>';
        data.forEach(d => fFiliere.add(new Option(d.nom, d.id)));
        fFiliere.disabled = false;

        fNiveau.innerHTML = '<option value="">Niveau</option>';
        if(cycleNom.includes('LICENCE')) fNiveau.add(new Option('3', '3'));
        else { fNiveau.add(new Option('1', '1')); fNiveau.add(new Option('2', '2')); }
        fNiveau.disabled = false;
    });

    fFiliere.addEventListener('change', async () => {
        const data = await fetchAPI('parcours', fFiliere.value);
        fParcours.innerHTML = '<option value="">Parcours</option>';
        data.forEach(d => fParcours.add(new Option(d.nom, d.id)));
        fParcours.disabled = false;
    });

    [fParcours, fNiveau].forEach(el => el.addEventListener('change', async () => {
        if(!fParcours.value) return;
        const res = await fetch(`../../Controllers/adminControllers/get_matieres.php?parcours=${fParcours.value}&niveau=${fNiveau.value}`);
        const mats = await res.json();
        
        matList.innerHTML = mats.length ? mats.map(m => `
            <label><input type="checkbox" name="matieres[]" value="${m.id_affectation}"> ${m.nom_matiere} </label>
        `).join('') : '<p>Aucune matière.</p>';
    }));

    // --- 3. ENVOI DU FORMULAIRE ---
    document.getElementById('profForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const res = await fetch('../../Controllers/adminControllers/gestion_prof_process.php', {
            method: 'POST',
            body: new FormData(e.target)
        });
        const result = await res.json();
        alert(result.message);
        if(result.success) location.reload();
    });
});