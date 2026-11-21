## Description

Cette Pull Request réalise la refonte complète et la modernisation de la plateforme **Mon IUT** (version 2.0).
L'ensemble de la dette technique liée à l'ancien backend PHP a été supprimé au profit d'une architecture monorepo full-stack robuste, sécurisée et modulaire.

### Principales réalisations :
1. **Backend Express.js Unifié** :
   - Point d'entrée unique [backend/server.js](file:///home/yokomi/mon-iut/backend/server.js).
   - Suppression du mélange PDO/mysqli et remplacement par un pool de requêtes préparées `mysql2/promise`.
   - Double compatibilité de base de données : MySQL/MariaDB en local (XAMPP) et TiDB Cloud en production (chiffrement SSL/TLS automatique).
   - Hachage sécurisé des mots de passe avec `bcrypt` (10 rounds) et migration transparente automatique des comptes existants à la connexion.
   - Authentification JWT avec `accessToken` (1h) et `refreshToken` (7j).
   - Contrôle d'accès basé sur les rôles (RBAC) : `admin`, `enseignant`, `responsable`, `etudiant`.
   - Protection contre l'accès aux ressources d'autrui (Ownership verification).
   - Validation stricte des données entrantes avec **Zod**.
   - Protection de l'infrastructure HTTP : Helmet, CORS dynamique, limitation de débit `express-rate-limit`.
   - Téléversement sécurisé de fichiers PDF avec Multer (max 15 Mo, noms uniques assainis).
   - Logger structuré Winston (fichiers logs et console) et documentation OpenAPI / Swagger 3.0 sur `/api-docs`.
   - Script d'amorçage de la base de données (`init-db.js`).

2. **Frontend Web Moderne (React 18 + Vite 6 + Tailwind CSS)** :
   - Remplacement des pages HTML/PHP statiques par une SPA réactive.
   - Reprise et centralisation de la palette officielle extraite de l'espace admin d'origine (`#f97616` orange, `#1e1b4b` bleu marine, `#f0f0f0`, `#333333`, `#dc2626`, `#16a34a`).
   - Unification des 3 espaces majeurs :
     * **Administration** : Tableau de bord KPI, gestion et inscription des étudiants, gestion des enseignants et affectations, diffusion d'annonces, téléversement de documents officiels.
     * **Enseignants** : Consultation des cours affectés, tableau de saisie des évaluations (CC 30%, TP 20%, Synthèse 50%) avec calcul dynamique des moyennes, envoi de communiqués et partage de supports.
     * **Responsables Pédagogiques** : Vue globale de département, listes d'étudiants par parcours, synthèse des moyennes de promotion, publication des emplois du temps (EDT) et circulaires.
   - Respect strict de la **règle Zéro Emoji** : utilisation exclusive d'icônes SVG via Lucide React.
   - Client API Axios avec intercepteur gérant le rafraîchissement transparent du jeton JWT.

3. **Application Mobile Étudiant (React Native / Expo 54)** :
   - Navigation unifiée et simplifiée sous **React Navigation** (Stack + Bottom Tabs).
   - Persistance de session locale avec `@react-native-async-storage/async-storage`.
   - Intercepteur Axios avec renouvellement automatique du token expiré via `refreshToken`.
   - **Zéro variable d'environnement** : configuration statique centralisée dans [frontend/mobile/src/config/api.js](file:///home/yokomi/mon-iut/frontend/mobile/src/config/api.js).
   - Interface sobre, sombre et professionnelle, respectant la charte IUT et la règle Zéro Emoji (icônes Feather).

4. **Tests & Qualité** :
   - 11 tests automatisés avec Jest et Supertest (authentification, RBAC, validation, uploads).
   - Build de production web Vite validé en 15 secondes sans erreur.
   - 0 emoji dans l'ensemble des fichiers du projet.

---

## Type de changement

- [x] Correction de bug (fix)
- [x] Nouvelle fonctionnalité (feat)
- [x] Refactorisation de code (sans impact fonctionnel)
- [x] Tests automatisés (Jest / Supertest)
- [x] Documentation (docs)
- [x] Configuration de déploiement (Render / Vercel / TiDB)

---

## Zone concernée

- [x] Backend Express.js (`server.js`, routes, controllers, models, middlewares, services)
- [x] Backend Web modules (`backend/web/`)
- [x] Backend Mobile modules (`backend/mobile/`)
- [x] Frontend Web React (`frontend/web/`)
- [x] Application Mobile Expo (`frontend/mobile/`)
- [x] Base de données (schéma, script `init-db.js`)

---

## Comment tester

### 1. Démarrer et initialiser la base de données
```bash
# Dans le dossier backend
cd backend
npm run init-db
```
Comptes de test générés avec mots de passe bcrypt :
- Administrateur : `admin@iut.cm` / `admin123`
- Responsable Pédagogique GIN : `dassi@gmail.com` / `123456`
- Enseignant : `kani@gmail.com` / `123456`
- Étudiant : `24GLO01IU` / `abakar2026`

### 2. Lancer les tests automatisés
```bash
npm --prefix backend test
# Résultat attendu : 11 passed, 3 test suites passed
```

### 3. Tester le Backend Express.js
```bash
npm --prefix backend run dev
# Accéder à la documentation Swagger : http://localhost:5000/api-docs
# Contrôle de santé : http://localhost:5000/health
```

### 4. Tester l'Application Web
```bash
npm --prefix frontend/web run dev
# Ouvrir http://localhost:5173
# Tester la connexion avec chacun des 3 rôles (admin, enseignant, responsable)
# Vérifier la saisie de notes, les filtres d'étudiants, et le téléversement de documents
```

### 5. Tester l'Application Mobile
```bash
npm --prefix frontend/mobile start
# Tester la connexion étudiant avec 24GLO01IU / abakar2026
# Vérifier l'accueil, les emplois du temps, les notes semestrielles et les notifications
```

---

## Checklist de conformité Mon IUT

- [x] J'ai exécuté les tests automatisés du backend avec succès (`npm test` : 11/11 tests passés).
- [x] J'ai vérifié la compilation de l'application web (`npm run build:web` : build Vite réussi).
- [x] Règle Zéro Emoji : aucun emoji n'a été introduit dans les vues, composants, boutons, titres ou messages d'erreur.
- [x] Charte graphique : les composants web utilisent strictement la palette centralisée dérivée de l'administration existante (`#f97616`, `#1e1b4b`, `#f0f0f0`, etc.).
- [x] Application mobile : aucune variable d'environnement ni fichier `.env` n'a été introduit (utilisation exclusive de `src/config/api.js`).
- [x] Sécurité : requêtes préparées avec `mysql2`, validation des entrées avec Zod, hachage bcrypt (10 rounds), vérification RBAC et ownership.
- [x] Aucun secret ni identifiant sensible n'est commité dans le code source (fichiers `.env.example` uniquement).

---

## Issue liée

Closes #1 (Refonte globale de la plateforme Mon IUT)
