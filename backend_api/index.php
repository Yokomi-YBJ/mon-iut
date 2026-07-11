<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - Mon IUT</title>
    <link rel="stylesheet" href="Views/admin/css/global.css">
    <style>
        .login-body {
            background: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
        }
        .login-card {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            width: 100%;
            max-width: 400px;
        }
        .login-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .login-header img { width: 80px; margin-bottom: 10px; }
        .login-header h1 { color: var(--primary-blue); font-size: 2.5rem; margin: 0; }
        .login-header h1 span { color: var(--primary-orange); }
        .login-header h2 { color: #444; font-size: 1.8rem; }
        .login-header p { color: var(--text-grey); font-size: 0.9rem; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; color: var(--primary-blue); font-weight: 600; }
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            transition: border-color 0.3s;
        }
        .form-group input:focus {
            outline: none;
            border-color: var(--primary-orange);
        }

        .btn-login {
            width: 100%;
            padding: 14px;
            background-color: var(--primary-orange);
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.2s, background 0.3s;
        }
        .btn-login:hover { background-color: #e66a13; transform: translateY(-2px); }
        
        #error-message {
            display: none;
            background-color: #fee2e2;
            color: #b91c1c;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 20px;
            border: 1px solid #fecaca;
            font-size: 0.9rem;
            text-align: center;
        }
    </style>
</head>
<body class="login-body">

    <div class="login-card">
        <div class="login-header">
            <h1>Mon <span>IUT</span></h1>
            <h2>Espace Connexion</h2>
            <p>Admin & Enseignants</p>
        </div>

        <div id="error-message"></div>

        <form id="loginForm">
            <div class="form-group">
                <label>Email / Identifiant</label>
                <input type="text" name="email" id="email" placeholder="votre@email.com" required>
            </div>
            <div class="form-group">
                <label>Mot de passe</label>
                <input type="password" name="password" id="password" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn-login" id="submitBtn">Se connecter</button>
        </form>
    </div>

    <script src="indexScript.js"></script>
</body>
</html>