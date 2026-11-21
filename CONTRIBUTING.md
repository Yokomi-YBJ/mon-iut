# Guide de Contribution - Mon IUT

Merci de votre intérêt pour le projet **Mon IUT**. Ce document détaille les normes d'architecture, les conventions de code et la démarche à suivre pour contribuer efficacement au monorepo.

Dépôt officiel : https://github.com/Yokomi-YBJ/mon-iut

---

## 1. Bilan de la Refonte Majeure v2.0 (Modifications Effectuées)

Le dépôt a fait l'objet d'une refonte architecturale complète. Voici la synthèse des modifications structurelles réalisées :

### Backend
- **Suppression du backend PHP legacy** : Élimination de l'ensemble des fichiers PHP (`backend_api/`, mélange PDO/mysqli, contrôleurs redondants).
- **Mise en place d'Express.js** : Serveur unique [backend/server.js](file:///home/yokomi/mon-iut/backend/server.js).
- **Persistance & Sécurité des données** : Requêtes préparées avec `mysql2/promise` compatibles MySQL local (XAMPP) et TiDB Cloud (SSL automatique via `TLSv1.2`).
- **Authentification & Hachage** : Implémentation du hachage de mots de passe avec `bcrypt` (10 rounds) avec migration transparente automatique des anciens mots de passe en clair à la connexion.
- **Gestion des sessions JWT** : Mise en place d'une authentification JWT avec `accessToken` (1h) et `refreshToken` (7j).
- **Contrôle d'accès & Autorisations** : Middlewares RBAC (`admin`, `enseignant`, `responsable`, `etudiant`) et vérification d'identité (ownership) contre l'élévation de privilèges horizontale.
- **Validation stricte** : Schémas Zod pour la validation et l'assainissement de toutes les entrées.
- **Protection HTTP** : En-têtes sécurisés Helmet, liste blanche CORS dynamique et limitation de débit `express-rate-limit`.
- **Upload sécurisé** : Upload de fichiers PDF contrôlé avec Multer (max 15 Mo, noms uniques assainis).
- **Observabilité & Documentation** : Logger structuré Winston (fichiers `logs/` et console) et documentation OpenAPI / Swagger 3.0 sur `/api-docs`.
- **Amorçage de la base** : Script [backend/scripts/init-db.js](file:///home/yokomi/mon-iut/backend/scripts/init-db.js) pour la création des tables et des comptes de test avec hachage bcrypt.

### Frontend Web
- **Modernisation intégrale** : Remplacement des pages HTML/PHP statiques par une SPA moderne construite avec React 18, Vite 6 et Tailwind CSS.
- **Centralisation de la palette admin** : Récupération stricte de la charte de l'espace admin d'origine (`#f97616` orange logo, `#1e1b4b` bleu marine, `#f0f0f0` fond clair, `#ffffff`, `#333333`, `#dc2626`, `#16a34a`) dans `tailwind.config.js`, `theme/colors.js` et `index.css`.
- **Unification des 3 espaces** :
  - **Espace Administrateur** : Tableau de bord KPI, gestion complète des étudiants (filtres, création, modification, statut), gestion des enseignants et affectations, diffusion d'annonces et téléversement de documents officiels.
  - **Espace Enseignant** : Vue des matières affectées, tableau de saisie des évaluations (CC 30%, TP 20%, Synthèse 50%) avec calcul en temps réel et enregistrement par lot, diffusion de communiqués et partage de supports de cours.
  - **Espace Responsable Pédagogique** : Vue globale de la filière, suivi des listes d'étudiants par parcours, synthèse des moyennes par matière, publication des emplois du temps (EDT) et des circulaires.
- **Composants réutilisables & Accessibles** : Tableaux, formulaires, modales, notifications, loaders, cartes et états vides soignés.
- **Règle Zéro Emoji** : 0 emoji sur l'ensemble de l'interface, utilisation exclusive d'icônes vectorielles SVG (Lucide React).
- **Client API avec Auto-refresh** : Intercepteur Axios gérant automatiquement le renouvellement du jeton expiré via `refreshToken`.

### Frontend Mobile
- **Conservation de React Native / Expo** : Mise à niveau propre sous Expo 54 et React 19.
- **Architecture de navigation unifiée** : Abandon d'Expo Router au profit exclusif de **React Navigation** (Stack principale + Bottom Tabs).
- **Persistance de session JWT** : Stockage sécurisé des jetons et du profil utilisateur via `@react-native-async-storage/async-storage` avec reconnexion automatique.
- **Intercepteur réseau** : Injection automatique du token Bearer et gestion du rafraîchissement transparent 401 via Axios.
- **Zéro variable d'environnement** : Configuration de l'URL API centralisée dans le fichier statique [frontend/mobile/src/config/api.js](file:///home/yokomi/mon-iut/frontend/mobile/src/config/api.js).
- **Interface sobre et Zéro Emoji** : Design sombre et professionnel (`#0F172A`, `#1E293B`, `#F97616`), icônes Feather, zéro caractère emoji.

### Tests & Qualité
- **Tests automatisés** : 11 tests d'intégration avec Jest et Supertest couvrant l'authentification, le RBAC, les validations et l'upload de documents.
- **Scripts monorepo** : Scripts npm unifiés au niveau racine pour orchestrer le développement, les tests, le build et le formatage.

---

## 2. Organisation du Monorepo

Le projet est structuré en deux parties majeures au sein d'un monorepo :

```
/
├── backend/                  # API REST Express.js unifiée (serveur unique server.js)
│   ├── config/               # Configuration DB (MySQL local & TiDB Cloud SSL), JWT, CORS, Logger, Swagger
│   ├── controllers/          # Contrôleurs transversaux (auth, structure)
│   ├── models/               # Modèles de données avec requêtes préparées mysql2
│   ├── routes/               # Définition des routes principales
│   ├── middlewares/          # JWT, RBAC, ownership, Zod validation, rate-limit, upload, error handler
│   ├── services/             # Logique métier d'authentification et de distribution
│   ├── web/                  # Modules dédiés aux espaces web (Admin, Enseignant, Responsable)
│   ├── mobile/               # Modules dédiés à l'application mobile Étudiant
│   ├── scripts/              # Script d'initialisation et seeding (init-db.js)
│   └── tests/                # Suites de tests Jest & Supertest
├── frontend/
│   ├── web/                  # Application Web SPA (React 18, Vite 6, Tailwind CSS)
│   │   └── src/              # Palette admin centralisée, espaces Admin, Enseignant et Responsable
│   └── mobile/               # Application Mobile (React Native, Expo 54, React Navigation)
│       └── src/              # Configuration statique sans .env, persistance JWT AsyncStorage
├── package.json              # Scripts globaux et gestion des workspaces npm
└── README.md                 # Documentation générale
```

---

## 3. Principes Fondamentaux de Contribution

1. **Branche Principale Protégée** : La branche `main` est protégée. Aucun commit direct n'y est autorisé. Toute modification doit faire l'objet d'une Pull Request (PR) depuis un fork.
2. **Contrainte Zéro Emoji** : Aucun emoji ne doit être utilisé dans l'interface utilisateur, les libellés, les boutons, les titres, les messages d'erreur, les notifications, les placeholders ou les états vides. Utilisez exclusivement les icônes vectorielles SVG (Lucide React sur le Web, Feather sur le Mobile).
3. **Respect de la Palette Visuelle Officielle** : Tout composant web doit respecter la palette centralisée dérivée de l'administration existante :
   - Orange logo : `#f97616` (hover `#e6660b`)
   - Bleu marine texte : `#1e1b4b` (hover `#312e81`)
   - Fond clair : `#f0f0f0` / `#f8fafc`
   - Surface : `#ffffff`
   - Texte sombre : `#333333`
   - Bordures : `#dddddd`
4. **Pas de Variables d'Environnement sur Mobile** : La partie mobile ne doit pas introduire de fichier `.env` ni dépendre de variables d'environnement. L'adresse de l'API est gérée statiquement dans `frontend/mobile/src/config/api.js`.
5. **Backend Express.js Unique** : Express.js est le framework backend exclusif. Tout nouveau module doit être monté depuis `backend/server.js`.

---

## 4. Workflow de Développement

### Étape 1 : Forker et Cloner le Dépôt
1. Cliquez sur **Fork** sur GitHub.
2. Clonez votre fork en local :
   ```bash
   git clone https://github.com/VOTRE_COMPTE/mon-iut.git
   cd mon-iut
   ```
3. Associez le dépôt d'origine comme `upstream` :
   ```bash
   git remote add upstream https://github.com/Yokomi-YBJ/mon-iut.git
   ```

### Étape 2 : Créer une Branche Dédiée
Ne travaillez jamais sur la branche `main`. Utilisez des noms de branches sémantiques :
- `feat/nom-fonctionnalite` (nouvelle fonctionnalité)
- `fix/nom-du-correctif` (correction de bug)
- `refactor/composant-ou-module` (amélioration de code)
- `test/couverture-endpoint` (ajout de tests automatisés)
- `docs/mise-a-jour-documentation` (documentation)

Exemple :
```bash
git checkout -b feat/export-notes-csv
```

### Étape 3 : Installer les Dépendances
Installez les dépendances du monorepo :
```bash
npm install
npm --prefix backend install
npm --prefix frontend/web install
npm --prefix frontend/mobile install
```

### Étape 4 : Initialiser la Base de Données Locale
Assurez-vous que MySQL/MariaDB tourne localement avec une base `mon-iut`, puis exécutez :
```bash
npm run init-db
```

### Étape 5 : Lancer l'Environnement de Développement
- Backend : `npm run dev:backend` (port 5000, Swagger sur `/api-docs`)
- Frontend Web : `npm run dev:web` (port 5173)
- Application Mobile : `npm run dev:mobile` (serveur Metro Expo)

---

## 5. Règles de Qualité & Sécurité du Code

### Backend Express.js
- **Requêtes Préparées** : Utilisez toujours `query(sql, [params])` avec des placeholders `?`. Ne jamais concaténer de paramètres directement dans une chaîne SQL.
- **Validation Zod** : Chaque requête entrante avec body ou query paramètres doit être validée via un schéma Zod dans `middlewares/validators.js`.
- **Contrôle RBAC** : Protégez chaque route sensible via `authenticateJWT` et `requireRole('admin', 'enseignant', 'responsable', 'etudiant')`.
- **Vérification d'Identité** : Vérifiez que l'utilisateur connecté a le droit d'accéder à la ressource demandée (prévention de l'escalade horizontale).
- **Hachage de Mots de Passe** : Toujours utiliser `bcrypt` avec 10 rounds pour tout mot de passe créé ou mis à jour.
- **Réponses API Cohérentes** :
  ```json
  {
    "success": true,
    "message": "Opération réussie.",
    "data": {}
  }
  ```
  ou en cas d'erreur :
  ```json
  {
    "success": false,
    "message": "Description claire de l'erreur.",
    "errors": []
  }
  ```

### Frontend Web (React + Vite + Tailwind CSS)
- Utilisez les composants réutilisables créés dans `frontend/web/src/components/common/` (`Button`, `Input`, `Select`, `Table`, `Modal`, `Card`, `Badge`, `Alert`, `Loader`, `EmptyState`).
- Veillez aux contrastes de couleurs et à la navigation au clavier (focus visibles).
- Utilisez `apiClient` (`frontend/web/src/api/client.js`) qui gère automatiquement l'envoi du JWT et le renouvellement par refresh token.

### Application Mobile (React Native / Expo)
- Conservez l'approche unique de navigation via React Navigation (`@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`).
- Utilisez `apiClient` (`frontend/mobile/src/services/apiClient.js`) qui s'appuie sur `AsyncStorage` pour attacher les jetons et rafraîchir la session.
- Ne créez pas de variables d'environnement. Tout paramètre de serveur doit être configuré dans `frontend/mobile/src/config/api.js`.

---

## 6. Exécution des Tests et Vérifications

Avant de proposer une Pull Request, vous devez impérativement valider :

1. **Les tests automatisés du backend** :
   ```bash
   npm test
   ```
   Tous les tests Jest (authentification, RBAC, documents) doivent être verts.

2. **La compilation de l'application Web** :
   ```bash
   npm run build:web
   ```
   Le build Vite doit se terminer sans erreur TypeScript ou JSX.

3. **L'absence d'emojis** :
   Vérifiez qu'aucun emoji n'a été inséré dans le code source des interfaces.

4. **Le formatage du code** :
   ```bash
   npm run format
   ```

---

## 7. Soumettre une Pull Request (PR)

1. Committez vos modifications avec un message explicite :
   ```bash
   git commit -m "feat(web): ajout de l'export des moyennes semestrielles"
   ```
2. Poussez votre branche sur votre fork :
   ```bash
   git push origin feat/export-notes-csv
   ```
3. Rendez-vous sur GitHub pour ouvrir la Pull Request vers la branche `main` du dépôt d'origine.
4. Remplissez consciencieusement le template de Pull Request (`PULL_REQUEST_TEMPLATE.md`).

---

## 8. Signalement de Failles de Sécurité

Si vous identifiez une vulnérabilité critique de sécurité (injection, contournement d'authentification, fuite de données) :
- **Ne publiez pas d'issue publique**.
- Contactez directement les mainteneurs via GitHub Security Advisory ou par message privé pour convenir d'une divulgation responsable.
