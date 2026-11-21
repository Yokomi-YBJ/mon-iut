# Mon IUT - Plateforme de Gestion Académique & Administrative Unifiée

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21-lightgrey.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://react.dev/)
[![React Native / Expo](https://img.shields.io/badge/Expo-v54-black.svg)](https://expo.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![MySQL / TiDB](https://img.shields.io/badge/Database-MySQL%20%7C%20TiDB%20Cloud-orange.svg)](https://tidbcloud.com/)
[![Tests](https://img.shields.io/badge/Tests-Jest%20%26%20Supertest-red.svg)](https://jestjs.io/)

---

## 1. Vue d'ensemble du Projet

**Mon IUT** est une solution logicielle full-stack moderne conçue pour numériser l'ensemble des processus académiques et administratifs de l'Institut Universitaire de Technologie (IUT).

Cette version 2.0 opère une refonte intégrale de l'architecture historique :
- **Remplacement du backend PHP legacy** par une API REST unique, modulaire et hautement sécurisée basée sur **Express.js**.
- **Refonte de l'interface Web** en une application Single Page Application (SPA) réactive construite avec **React**, **Vite** et **Tailwind CSS**, fédérant les 3 espaces majeurs (**Administration**, **Enseignants**, **Responsables Pédagogiques**).
- **Refonte de l'application Mobile Étudiant** sous **React Native & Expo**, dotée d'une persistance de session robuste (JWT avec auto-refresh via intercepteur Axios), d'une navigation simplifiée et unifiée (React Navigation), et affranchie de toute dépendance à des variables d'environnement.
- **Identité visuelle sobre et professionnelle** : respect strict de la palette extraite de l'espace administration existant, contrastes accessibles et **absence totale d'emojis** sur toutes les interfaces utilisateur.

---

## 2. Arborescence du Monorepo

```
/
├── backend/
│   ├── server.js                      # Point d'entrée unique de l'API Express.js
│   ├── package.json                   # Dépendances et scripts backend
│   ├── .env.example                   # Gabarit des variables d'environnement
│   ├── config/
│   │   ├── db.js                      # Pool MySQL / MariaDB / TiDB Cloud (SSL auto)
│   │   ├── jwt.js                     # Signatures et vérifications des jetons JWT
│   │   ├── cors.js                    # Liste blanche dynamique CORS (Web, Render, Mobile)
│   │   ├── logger.js                  # Logger structuré Winston (console & fichiers logs/)
│   │   └── swagger.js                 # Spécification interactive OpenAPI 3.0
│   ├── controllers/
│   │   ├── authController.js          # Authentification unifiée et rotation de tokens
│   │   └── structureController.js     # Arborescence cycles, filières, parcours, matières
│   ├── models/
│   │   ├── adminModel.js              # Accès données administrateurs et KPI
│   │   ├── professeurModel.js         # Accès données enseignants et affectations
│   │   ├── etudiantModel.js           # Requêtes préparées étudiants et ciblages
│   │   ├── structureModel.js          # Cycles, filières, parcours et matières
│   │   ├── noteModel.js               # Gestion des notes (CC, TP, Synthèse) et moyennes
│   │   ├── notificationModel.js       # Annonces et suivi des lectures destinataires
│   │   └── documentModel.js           # Métadonnées des documents et publications
│   ├── routes/
│   │   ├── authRoutes.js              # /api/auth (login, refresh, logout, me, mdp)
│   │   └── structureRoutes.js         # /api/structure (listes académiques)
│   ├── middlewares/
│   │   ├── authMiddleware.js          # Vérification du Bearer token JWT
│   │   ├── roleMiddleware.js          # Contrôle d'accès basé sur les rôles (RBAC)
│   │   ├── ownershipMiddleware.js     # Vérification d'identité pour ressources privées
│   │   ├── validationMiddleware.js    # Validation et assainissement des entrées (Zod)
│   │   ├── validators.js              # Schémas de validation Zod
│   │   ├── rateLimiter.js             # Protection bruteforce (express-rate-limit)
│   │   ├── uploadMiddleware.js        # Téléversement contrôlé de PDF avec Multer
│   │   └── errorHandler.js            # Gestionnaire centralisé d'erreurs HTTP
│   ├── services/
│   │   ├── authService.js             # Logique d'authentification et hachage bcrypt
│   │   └── distributionService.js     # Algorithme de ciblage (ALL, CYCLE, FILIERE, PARCOURS)
│   ├── web/
│   │   ├── controllers/
│   │   │   ├── adminController.js     # Gestion étudiants, profs, annonces, documents
│   │   │   ├── enseignantController.js# Saisie notes, cours, supports et communiqués
│   │   │   └── responsableController.js# Supervision filière, délibérations, EDT
│   │   └── routes/
│   │       ├── adminRoutes.js         # Routes /api/web/admin/*
│   │       ├── enseignantRoutes.js    # Routes /api/web/enseignant/*
│   │       ├── responsableRoutes.js   # Routes /api/web/responsable/*
│   │       └── index.js               # Montage unifié /api/web
│   ├── mobile/
│   │   ├── controllers/
│   │   │   └── mobileController.js    # EDT, notes, profil et documents pour étudiants
│   │   └── routes/
│   │       └── mobileRoutes.js        # Montage /api/mobile
│   ├── scripts/
│   │   └── init-db.js                 # Migration et amorçage sécurisé de la base de données
│   ├── tests/
│   │   ├── auth.test.js               # Tests Jest : login, JWT, refresh, me
│   │   ├── student.test.js            # Tests Jest : RBAC, validation, accès interdits
│   │   └── document.test.js           # Tests Jest : téléversement PDF et rejets
│   └── uploads/
│       └── documents/                 # Dossier de stockage des fichiers PDF téléversés
│           └── .gitkeep
├── frontend/
│   ├── web/                           # Application Web React + Vite + Tailwind CSS
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js         # Configuration intégrant la palette admin
│   │   ├── postcss.config.js
│   │   ├── index.html
│   │   └── src/
│   │       ├── assets/                # Logos et images
│   │       ├── theme/
│   │       │   └── colors.js          # Constantes JS des couleurs centralisées
│   │       ├── api/
│   │       │   └── client.js          # Client Axios configuré avec auto-refresh JWT
│   │       ├── context/
│   │       │   └── AuthContext.jsx    # État global d'authentification et rôles
│   │       ├── components/
│   │       │   ├── common/            # Button, Input, Select, Table, Modal, Card, etc.
│   │       │   └── layout/            # Navbar, PageHeader, ProtectedRoute
│   │       ├── pages/
│   │       │   ├── auth/Login.jsx     # Écran de connexion unifié
│   │       │   ├── admin/             # Dashboard, Étudiants, Enseignants, Annonces, Documents
│   │       │   ├── enseignant/        # Dashboard, SaisieNotes, Communiqués, Documents
│   │       │   └── responsable/       # Dashboard, Suivi, ValidationNotes, EDT, Circulaires
│   │       ├── App.jsx                # Définition des routes et permissions
│   │       ├── main.jsx               # Montage React dans le DOM
│   │       └── index.css              # Variables CSS dérivées de l'espace admin
│   └── mobile/                        # Application Mobile React Native / Expo
│       ├── package.json
│       ├── app.json                   # Configuration Expo
│       ├── babel.config.js
│       ├── metro.config.js
│       ├── App.js                     # Racines Context et Navigation
│       ├── index.js                   # Enregistrement du composant racine Expo
│       └── src/
│           ├── assets/images/         # Icône et logo IUT
│           ├── config/
│           │   └── api.js             # Configuration statique de l'URL API (AUCUN .env)
│           ├── services/
│           │   └── apiClient.js       # Client Axios mobile avec intercepteurs AsyncStorage
│           ├── context/
│           │   └── AuthContext.js     # Persistance de session locale (JWT)
│           ├── navigation/
│           │   └── AppNavigator.js    # React Navigation (Stack + Bottom Tabs unifiés)
│           └── screens/
│               ├── auth/LoginScreen.js
│               ├── main/
│               │   ├── AccueilScreen.js
│               │   ├── PlanningScreen.js
│               │   ├── AcademiqueScreen.js
│               │   ├── DocumentsScreen.js
│               │   └── ProfileScreen.js
│               └── details/
│                   ├── NotificationScreen.js
│                   └── NewPasswordScreen.js
├── package.json                       # Scripts globaux du monorepo
├── .gitignore                         # Règles d'exclusion Git
├── .prettierrc                        # Formatage de code unifié
└── README.md                          # Documentation exhaustive
```

---

## 3. Charte Graphique & Palette de Couleurs Centralisée

La charte graphique est **strictement dérivée de l'espace administration existant** (`backend_api/Views/admin/css/global.css`) pour garantir une harmonie visuelle sans introduire de couleurs arbitraires :

| Rôle Visuel | Variable CSS | Code Hexadécimal | Utilisation dans l'interface |
| :--- | :--- | :--- | :--- |
| **Orange Logo IUT** | `--primary-orange` | `#f97616` | Boutons d'action prioritaires, bordure basse des titres, badges d'avertissement |
| **Orange Hover** | `--primary-orange-hover` | `#e6660b` | État hover des boutons primaires |
| **Bleu Marine IUT** | `--primary-blue` | `#1e1b4b` | Titres des pages (`.admin-page-title`), en-têtes de tableaux, boutons secondaires |
| **Bleu Marine Hover**| `--primary-blue-hover` | `#312e81` | État hover des éléments secondaires |
| **Fond Clair** | `--light-bg` | `#f0f0f0` / `#f8fafc` | Arrière-plan global de l'application web |
| **Surface Blanche** | `--white` | `#ffffff` | Conteneurs, cartes, modales et formulaires |
| **Texte Sombre** | `--text-dark` | `#333333` | Corps de texte standard et libellés |
| **Texte Gris** | `--text-grey` | `#666666` | Sous-titres, métadonnées, dates |
| **Bordures** | `--border-color` | `#dddddd` / `#e2e8f0` | Délimitation des cartes, lignes de tableaux et inputs |
| **Succès** | `--success` | `#16a34a` | Validation d'actions, statut actif, mentions favorables |
| **Danger / Erreur** | `--danger` | `#dc2626` | Alertes d'erreur, suppression, statut inactif |

### Règle stricte d'interface : Zéro Emoji
Toutes les icônes proviennent exclusivement des bibliothèques vectorielles SVG (**Lucide React** pour le Web, **Feather / Vector Icons** pour le Mobile). Aucun caractère emoji n'est utilisé dans les libellés, boutons, notifications, messages ou placeholders.

---

## 4. Sécurité & Bonnes Pratiques

1. **Hachage des Mots de Passe** : Hachage bcrypt avec 10 rounds de salage. Le système intègre un mécanisme de **migration transparente à la volée** : si un compte existant utilise un mot de passe en clair hérité de l'ancien système, il est automatiquement converti en hash bcrypt lors de sa première connexion réussie.
2. **Authentification JWT à Double Jeton** :
   - `Access Token` : signé avec `JWT_SECRET`, durée de validité courte (1 heure).
   - `Refresh Token` : signé avec `JWT_REFRESH_SECRET`, durée longue (7 jours), stocké côté client (`localStorage` en web, `AsyncStorage` en mobile).
   - Rotation transparente sans interruption utilisateur grâce aux intercepteurs Axios.
3. **Contrôle d'Accès Basé sur les Rôles (RBAC)** :
   - Middleware `requireRole(['admin', 'responsable', 'enseignant', 'etudiant'])` protégeant chaque route.
   - Vérification de l'appartenance des ressources via `ownershipMiddleware` empêchant toute élévation de privilèges horizontale.
4. **Validation et Assainissement des Données** :
   - Schémas stricts basés sur **Zod** pour toutes les entrées utilisateur (`body`, `query`, `params`).
   - Requêtes préparées systématiques avec `mysql2` interdisant les injections SQL.
5. **Protection HTTP** :
   - **Helmet** pour la configuration des en-têtes sécurisés (CSP, HSTS, no-sniff, etc.).
   - **CORS** avec vérification dynamique d'origines autorisées.
   - **express-rate-limit** configuré spécifiquement pour juguler les attaques par force brute sur `/api/auth/login` et `/api/mobile/login`.
6. **Uploads Sécurisés** :
   - Validation stricte des extensions et types MIME (fichiers `.pdf` exclusivement).
   - Renommage aléatoire unique et assaini pour éviter les collisions et injections de chemins.
   - Limite de taille fixée à 15 Mo.

---

## 5. Base de Données : Dualité MySQL Local et TiDB Cloud

L'application est conçue pour fonctionner de manière transparente en environnement local et en production cloud :

- **Développement local (XAMPP / MariaDB / MySQL)** :
  Connexion standard non-chiffrée sur le port `3306`.
- **Production (TiDB Cloud Serverless)** :
  TiDB Cloud est 100% compatible MySQL mais requiert un chiffrement SSL/TLS (`minVersion: 'TLSv1.2'`). La détection est automatique : dès que `NODE_ENV=production` ou `DB_SSL=true`, la connexion active le protocole SSL sécurisé sans nécessiter de modification de code.

---

## 6. Variables d'Environnement

### Backend (`backend/.env.example`)
```env
PORT=5000
NODE_ENV=development

# Base de données (MySQL local ou TiDB Cloud)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=mon-iut
DB_SSL=false

# Clés secrètes JWT
JWT_SECRET=votre_cle_secrete_jwt_access_a_remplacer_en_production
JWT_REFRESH_SECRET=votre_cle_secrete_jwt_refresh_a_remplacer_en_production
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d
BCRYPT_ROUNDS=10

# Configuration CORS (séparer par des virgules)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://mon-iut-web.vercel.app

# Limitation de débit (Rate Limiting)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
AUTH_RATE_LIMIT_MAX=15

# Uploads
UPLOAD_DIR=uploads/documents
MAX_FILE_SIZE_MB=15
```

### Frontend Web (`frontend/web/.env.example`)
```env
# URL de l'API Express.js
# En local :
VITE_API_URL=http://localhost:5000/api

# En production sur Vercel :
# VITE_API_URL=https://mon-iut-api.onrender.com/api
```

### Application Mobile
> **Note de conception** : Conformément aux spécifications, l'application mobile **n'utilise aucune variable d'environnement ni fichier `.env`**. Son URL de contact est centralisée dans le fichier statique `frontend/mobile/src/config/api.js`.

---

## 7. Installation & Lancement en Développement

### Prérequis
- **Node.js** v20.x ou supérieur
- **npm** v10.x ou supérieur
- Un serveur **MySQL** (ex : via XAMPP ou Docker)

### Étape 1 : Cloner le dépôt et configurer les environnements
```bash
git clone https://github.com/Yokomi-YBJ/mon-iut.git
cd mon-iut

# Configuration du backend
cp backend/.env.example backend/.env

# Configuration du frontend web
cp frontend/web/.env.example frontend/web/.env
```

### Étape 2 : Initialiser la Base de Données
Assurez-vous que votre serveur MySQL est démarré et que la base de données `mon-iut` existe (`CREATE DATABASE \`mon-iut\`;`).
Exécutez ensuite le script d'initialisation et d'amorçage :
```bash
npm run init-db
```
Ce script crée automatiquement toutes les tables relationnelles et insère les données de test avec mots de passe hachés par bcrypt :
- **Admin** : `admin@iut.cm` (Mot de passe : `admin123`)
- **Responsable GIN** : `dassi@gmail.com` (Mot de passe : `123456`)
- **Enseignant** : `kani@gmail.com` (Mot de passe : `123456`)
- **Étudiant** : `24GLO01IU` (Mot de passe : `abakar2026`)

### Étape 3 : Lancer les services

Dans des terminaux séparés :

**1. Démarrer le Backend Express.js :**
```bash
npm run dev:backend
# Le serveur écoute sur http://localhost:5000
# Documentation Swagger accessible sur http://localhost:5000/api-docs
```

**2. Démarrer le Frontend Web (Vite + React) :**
```bash
npm run dev:web
# L'interface web est accessible sur http://localhost:5173
```

**3. Démarrer l'Application Mobile (Expo) :**
```bash
npm run dev:mobile
# Lance le serveur Metro Bundler pour Expo Go ou émulateur Android/iOS
```

---

## 8. Exécution des Tests

Les tests unitaires et d'intégration couvrent les fonctionnalités critiques de sécurité (authentification, protection RBAC, validation de requêtes, upload de fichiers PDF) :

```bash
npm test
```

Résultats exécutés via Jest et Supertest :
- `tests/auth.test.js` : Contrôle de santé, rejet de login incomplet, authentification 401, validation de token Bearer et route protégée `/me`.
- `tests/student.test.js` : Protection des routes d'administration contre les accès anonymes (401) et non autorisés (403), validation des formats de matricule et noms (400).
- `tests/document.test.js` : Rejet des envois sans pièce jointe et blocage des fichiers dont le format n'est pas strictement du PDF.

---

## 9. Guide de Déploiement en Production

### 1. Base de Données sur TiDB Cloud (Serverless)
1. Créez un compte gratuit sur [TiDB Cloud](https://tidbcloud.com/).
2. Créez un cluster Serverless (sélectionnez la région la plus proche, ex : Frankfurt ou Paris).
3. Cliquez sur **Connect** et sélectionnez **Connect with MySQL CLI / Node.js**.
4. Notez les identifiants générés : `Host`, `Port` (4000), `User` (ex: `xxxx.root`), `Password`.
5. Exécutez le script d'initialisation en pointant temporairement votre `.env` vers TiDB Cloud avec `DB_SSL=true` :
   ```bash
   npm run init-db
   ```

### 2. Backend Express.js sur Render
1. Créez un nouveau **Web Service** sur [Render](https://render.com/).
2. Liez votre dépôt GitHub `Yokomi-YBJ/mon-iut`.
3. Configurez les paramètres :
   - **Root Directory** : `backend`
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `node server.js`
4. Ajoutez les **Variables d'Environnement** dans le tableau de bord Render :
   - `NODE_ENV` = `production`
   - `DB_HOST` = `<adresse_hote_tidb>`
   - `DB_PORT` = `4000`
   - `DB_USER` = `<nom_utilisateur_tidb>`
   - `DB_PASSWORD` = `<mot_de_passe_tidb>`
   - `DB_NAME` = `mon-iut`
   - `DB_SSL` = `true`
   - `JWT_SECRET` = `<chaine_aleatoire_tres_longue>`
   - `JWT_REFRESH_SECRET` = `<chaine_aleatoire_tres_longue_distincte>`
   - `ALLOWED_ORIGINS` = `https://votre-projet.vercel.app`
5. Déployez. Render attribue automatiquement une variable `PORT` dynamique lue par `server.js`.

### 3. Frontend Web sur Vercel
1. Importez votre projet sur [Vercel](https://vercel.com/).
2. Définissez le **Root Directory** sur `frontend/web`.
3. Framework Preset : **Vite**.
4. Dans **Environment Variables**, ajoutez :
   - `VITE_API_URL` = `https://votre-service-render.onrender.com/api`
5. Cliquez sur **Deploy**. Vercel construit l'application statique avec `npm run build` et met en ligne la SPA.

### 4. Application Mobile
1. Ouvrez `frontend/mobile/src/config/api.js`.
2. Modifiez la constante `IS_PRODUCTION = true;` ou remplacez `PROD_API_HOST` par l'URL de votre backend Render.
3. Générez votre binaire APK ou bundle EAS :
   ```bash
   cd frontend/mobile
   npx eas build -p android --profile preview
   ```

---

## 10. Documentation des Endpoints de l'API

L'API expose une documentation interactive OpenAPI / Swagger accessible en direct sur `/api-docs` :

### Authentification & Session
- `POST /api/auth/login` : Authentification unifiée (Admin, Enseignant, Responsable, Étudiant). Retourne l'utilisateur, `accessToken`, `refreshToken` et `redirectTo`.
- `POST /api/auth/refresh` : Renouvelle un `accessToken` expiré au moyen d'un `refreshToken` valide.
- `GET /api/auth/me` : Profil de l'utilisateur porteur du jeton.
- `POST /api/auth/change-password` : Mise à jour du mot de passe avec vérification de l'ancien.
- `POST /api/auth/logout` : Invalidation de session.

### Administration Web (`/api/web/admin`)
- `GET /stats` : Métriques globales de l'établissement (étudiants, professeurs, documents, annonces).
- `GET /etudiants` : Recherche et filtrage multi-critères des étudiants.
- `POST /etudiants` : Inscription d'un étudiant avec matricule unique.
- `PUT /etudiants/:id` : Mise à jour de la fiche académique.
- `PATCH /etudiants/:id/toggle-status` : Activation ou désactivation du compte.
- `GET /professeurs` : Liste des enseignants et de leurs responsabilités.
- `POST /professeurs` : Création d'un compte enseignant.
- `POST /assignments` : Affectation d'un enseignant à une matière, un niveau et un parcours.
- `DELETE /assignments/:id` : Retrait d'une affectation.
- `POST /annonces` : Envoi d'une annonce ciblée (par cycle, filière, parcours).
- `POST /documents` : Dépôt d'un document PDF avec ciblage de promotion.

### Enseignants Web (`/api/web/enseignant`)
- `GET /assignments` : Liste des cours et matières affectés à l'enseignant connecté.
- `GET /notes` : Liste d'émargement et notes actuelles d'une matière.
- `POST /notes` : Enregistrement par lot des notes (CC, TP, Synthèse).
- `POST /communiques` : Diffusion d'un avis à destination des classes affectées.
- `POST /documents` : Téléversement de supports de cours et travaux dirigés (PDF).

### Responsables Pédagogiques Web (`/api/web/responsable`)
- `GET /overview` : Statistiques de la filière et liste des parcours supervisés.
- `GET /etudiants` : Suivi nominatif des étudiants de la filière.
- `GET /notes-summary` : Synthèse des moyennes de promotion par unité d'enseignement.
- `POST /edt` : Publication d'un emploi du temps (EDT) pour un parcours et niveau.
- `POST /notifications` : Publication d'une circulaire de département.

### Étudiants Mobile (`/api/mobile`)
- `POST /login` : Connexion directe par matricule étudiant.
- `GET /edt` : Récupération des emplois du temps de la classe.
- `GET /docs` : Consultation des circulaires et supports de cours.
- `GET /notifications` : Liste des notifications reçues avec statut de lecture.
- `PATCH /notifications/:id/read` : Marquage d'une notification comme consultée.
- `GET /notes` : Relevé de notes semestriel avec moyennes pondérées.
- `GET /profile` : Fiche détaillée de l'étudiant.
- `POST /update-password` : Changement sécurisé du mot de passe étudiant.

---

## 11. Licence

Projet distribué sous licence MIT. Développé pour la communauté universitaire de l'IUT.
