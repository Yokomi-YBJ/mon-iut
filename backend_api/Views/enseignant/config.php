<?php
// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'mon-iut');

// Créer la connexion
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données: ' . $conn->connect_error]));
}

// Définir le charset
$conn->set_charset("utf8mb4");

// Fonction utile pour les réponses JSON
function jsonResponse($success, $message = '', $data = null) {
    header('Content-Type: application/json');
    $response = [
        'success' => $success,
        'message' => $message
    ];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit;
}

// Fonction pour valider et nettoyer les entrées
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}
?>
