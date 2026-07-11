/* js/logout.js */
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.btn-logout');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            // Empêche le lien de rediriger immédiatement
            e.preventDefault();

            // Message de confirmation
            const confirmation = confirm("Êtes-vous sûr de vouloir vous déconnecter ?");

            if (confirmation) {
                try {
                    // Appel de l'API de déconnexion
                    const response = await fetch('../../Controllers/adminControllers/disconnect.php', {
                        method: 'POST'
                    });

                    const result = await response.json();

                    if (result.success) {
                        // Redirection vers la page de connexion
                        window.location.href = '../../index.php';
                    } else {
                        alert("Erreur lors de la déconnexion.");
                    }
                } catch (error) {
                    console.error("Erreur:", error);
                    alert("Une erreur technique est survenue.");
                }
            }
        });
    }
});