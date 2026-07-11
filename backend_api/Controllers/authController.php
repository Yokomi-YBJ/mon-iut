<?php
session_start();
require_once '../Models/function.php'; // Ta connexion PDO

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = htmlspecialchars($_POST['email'] ?? '');
    $password = htmlspecialchars($_POST['password'] ?? '');

    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs.']);
        exit;
    }

    try {
        // 1. Vérifier si c'est un admin
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE identifiant = ? AND password = ? LIMIT 1");
        $stmt->execute([$email, $password]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($admin) {
            $_SESSION['admin'] = $admin;
            echo json_encode(['success' => true, 'redirect' => 'Views/admin/index.php']);
            exit;
        }

        // 2. Vérifier dans la table professeurs
        $stmt = $pdo->prepare("SELECT * FROM professeurs WHERE identifiant = ? AND password = ? LIMIT 1");
        $stmt->execute([$email, $password]);
        $prof = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($prof) {
            // Sauvegarder les infos du prof en session
            $_SESSION['user'] = $prof;

            // Déterminer s'il est responsable pédagogique selon idFiliere (non-null et non-zero)
            $isResponsable = false;
            if ($prof['niveau_responsabilite'] != null) {
                $isResponsable = true;
            }
            $_SESSION['user']['is_responsable'] = $isResponsable;

            // Redirections : responsable pédagogique -> Views/responsablePedagogique/index.php
            // sinon -> interface enseignant (Views/enseignant/index.html)
            if ($isResponsable == true) {
                echo json_encode(['success' => true, 'redirect' => 'Views/responsablePedagogique/index.php']);
            } else {
                echo json_encode(['success' => true, 'redirect' => 'Views/enseignant/index.html']);
            }
            exit;
        }

        // Si rien n'est trouvé
        echo json_encode(['success' => false, 'message' => 'Identifiants incorrects.']);

    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur système : ' . $e->getMessage()]);
    }
}