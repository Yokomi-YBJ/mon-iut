<?php
// Controllers/adminControllers/disconnect.php
session_start();

// On retire uniquement la clé 'admin' de la session
if (isset($_SESSION['admin'])) {
    unset($_SESSION['admin']);
}

// On renvoie une réponse JSON pour le script JS
header('Content-Type: application/json');
echo json_encode(['success' => true]);
exit;