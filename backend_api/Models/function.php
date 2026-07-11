<?php
// Paramètres de connexion à la base de données
$host = 'localhost';      
$dbname = 'mon-iut';  
$username = 'root';   
$password = '';   

try {
    // Crée une nouvelle instance de PDO pour se connecter à la base de données
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";  // DSN pour MySQL avec UTF-8
    $pdo = new PDO($dsn, $username, $password);

    // Définit les attributs PDO pour la gestion des erreurs
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    // Si la connexion échoue, afficher l'erreur
    /*echo "Erreur de connexion : " . $e->getMessage();*/
    echo "Erreur de connexion. Veuillez réessayer plus tard.";
}

// Fonction helper pour le temps écoulé
function time_elapsed_string($datetime, $full = false) {
    $now = new DateTime;
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);

    // Calcul des semaines (car non inclus par défaut dans DateInterval)
    $w = floor($diff->d / 7);
    $d = $diff->d % 7;

    $string = array(
        'y' => 'an',
        'm' => 'mois',
        'w' => 'semaine',
        'd' => 'jour',
        'h' => 'heure',
        'i' => 'minute',
        's' => 'seconde',
    );

    foreach ($string as $k => &$v) {
        // On récupère la valeur (soit depuis l'objet diff, soit nos variables calculées)
        if ($k == 'w') {
            $val = $w;
        } elseif ($k == 'd') {
            $val = $d;
        } else {
            $val = $diff->$k;
        }

        if ($val) {
            // Gestion du pluriel : pas de 's' pour 'mois', mais 's' pour les autres
            $suffix = ($val > 1 && $k != 'm') ? 's' : '';
            $v = $val . ' ' . $v . $suffix;
        } else {
            unset($string[$k]);
        }
    }

    if (!$full) $string = array_slice($string, 0, 1);
    
    return $string ? 'Il y a ' . implode(', ', $string) : 'À l\'instant';
}


//function debuggage
function dump($data){
    echo "<pre>";
    var_dump($data);
    echo "</pre>";
}
?>
