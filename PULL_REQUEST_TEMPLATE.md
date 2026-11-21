## Description

Décrivez de manière concise et claire l'objectif et les modifications apportées par cette Pull Request.

## Type de changement

- [ ] Correction de bug (fix)
- [ ] Nouvelle fonctionnalité (feat)
- [ ] Refactorisation de code (sans impact fonctionnel)
- [ ] Tests automatisés (Jest / Supertest)
- [ ] Documentation (docs)
- [ ] Configuration de déploiement (Render / Vercel / TiDB)

## Zone concernée

- [ ] Backend Express.js (`server.js`, routes, controllers, models, middlewares, services)
- [ ] Backend Web modules (`backend/web/`)
- [ ] Backend Mobile modules (`backend/mobile/`)
- [ ] Frontend Web React (`frontend/web/`)
- [ ] Application Mobile Expo (`frontend/mobile/`)
- [ ] Base de données (schéma, script `init-db.js`)

## Comment tester

Décrivez les étapes pas-à-pas pour reproduire le scénario de test en local :

1. Démarrer le backend avec `npm --prefix backend run dev`
2. Lancer le frontend web avec `npm --prefix frontend/web run dev` ou mobile avec `npm --prefix frontend/mobile start`
3. Tester avec les identifiants de test appropriés (admin, prof, responsable ou etudiant)
4. Vérifier le comportement attendu

## Checklist de conformité Mon IUT

- [ ] J'ai exécuté les tests automatisés du backend avec succès (`npm test`).
- [ ] J'ai vérifié la compilation de l'application web (`npm run build:web`).
- [ ] Règle Zéro Emoji : aucun emoji n'a été introduit dans les vues, composants, boutons, titres ou messages d'erreur.
- [ ] Charte graphique : les composants web utilisent strictement la palette centralisée dérivée de l'administration existante (`#f97616`, `#1e1b4b`, etc.).
- [ ] Application mobile : aucune variable d'environnement ni fichier `.env` n'a été introduit (utilisation exclusive de `src/config/api.js`).
- [ ] Sécurité : requêtes préparées avec `mysql2`, validation des entrées avec Zod, hachage bcrypt, vérification RBAC.
- [ ] Aucun secret ni identifiant sensible n'est commité dans le code source.

## Issue liée

Closes # (numéro de l'issue si applicable)
