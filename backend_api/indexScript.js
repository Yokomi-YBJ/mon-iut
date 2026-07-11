document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const errorDiv = document.getElementById('error-message');
    const submitBtn = document.getElementById('submitBtn');
    
    // Reset message
    errorDiv.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.innerText = 'Vérification...';

    const formData = new FormData(e.target);

    try {
        const response = await fetch('Controllers/authController.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Redirection selon le rôle renvoyé par le PHP
            window.location.href = result.redirect;
        } else {
            errorDiv.innerText = result.message;
            errorDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerText = 'Se connecter';
        }
    } catch (error) {
        errorDiv.innerText = "Erreur de connexion au serveur.";
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerText = 'Se connecter';
    }
});