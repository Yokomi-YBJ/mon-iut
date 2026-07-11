<?php
// Controllers/adminControllers/disconnect.php
session_start();

// On retire uniquement la clé 'user' de la session
if (isset($_SESSION['user'])) {
    unset($_SESSION['user']);
}

// On renvoie une réponse JSON pour le script JS
header('Location: ../../../index.php');