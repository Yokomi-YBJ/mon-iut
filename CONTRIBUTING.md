# Contribuer à Mon IUT

Merci de vouloir contribuer au projet Mon IUT. Ce document explique comment proposer une modification, quelles règles suivre, et comment le dépôt est organisé pour les contributions.

Dépôt du projet : https://github.com/Yokomi-YBJ/mon-iut

## Principe général

Le dépôt `main` est protégé. Personne ne pousse directement dessus, y compris le mainteneur. Toute modification passe par une pull request (PR) depuis un fork.

## Étapes pour contribuer

### 1. Forker le dépôt

Clique sur "Fork" en haut de la page https://github.com/Yokomi-YBJ/mon-iut pour créer une copie du projet sur ton propre compte GitHub.

### 2. Cloner ton fork en local

```bash
git clone https://github.com/TON_PSEUDO/mon-iut.git
cd mon-iut
```

### 3. Ajouter le dépôt d'origine comme remote

Cela te permet de récupérer les dernières mises à jour du projet original.

```bash
git remote add upstream https://github.com/Yokomi-YBJ/mon-iut.git
```

### 4. Créer une branche dédiée à ta modification

Ne travaille jamais directement sur `main`. Utilise un nom de branche descriptif.

```bash
git checkout -b fix/injection-sql-note-php
```

Exemples de préfixes de branche :
- `fix/` pour une correction de bug
- `feat/` pour une nouvelle fonctionnalité
- `docs/` pour de la documentation
- `refactor/` pour une réorganisation de code sans changement de comportement

### 5. Faire tes modifications

Avant de commencer, lis la section "Bonnes pratiques" du `README.md`, notamment :
- Backend : toujours utiliser PDO avec des requêtes préparées, jamais de concaténation de variables dans une requête SQL.
- Backend : toujours répondre en JSON avec la structure `{ success, message, data }`.
- Mobile : centraliser toute URL d'API dans `mobile_app/app/config/api.js`.
- Mobile : respecter le style visuel existant (fond sombre, accent ambre/orange).
- Base de données : toute suppression doit être une désactivation logique (`est_actif = 0`), jamais une suppression physique.

### 6. Tester tes changements localement

Avant de proposer ta PR, vérifie que :
- Le backend PHP ne renvoie pas d'erreur inattendue.
- L'application mobile se lance sans erreur avec `npx expo start`.
- Aucune donnée sensible (mot de passe, adresse IP personnelle, clé) n'est laissée dans ton code.

### 7. Committer tes changements

Utilise des messages de commit clairs et en français ou en anglais, au choix, mais reste cohérent.

```bash
git add .
git commit -m "fix: corrige la requete SQL cassee dans not.php"
```

### 8. Pousser ta branche sur ton fork

```bash
git push origin fix/injection-sql-note-php
```

### 9. Ouvrir la pull request

Va sur ton fork GitHub, clique sur "Compare & pull request", et remplis le template de PR fourni. Décris clairement :
- Le problème résolu ou la fonctionnalité ajoutée.
- Comment tester le changement.
- Les fichiers impactés.

### 10. Revue et fusion

Ta PR sera relue avant fusion. Des modifications peuvent être demandées. Une fois approuvée, elle sera fusionnée par un mainteneur du projet.

## Types de contributions particulièrement bienvenues

D'après la section "Problèmes connus et dette technique" du README, voici des zones où l'aide est utile :

- Migration des contrôleurs PHP en `mysqli` vers PDO avec requêtes préparées (dossiers `Views/responsablePedagogique/controllers/` et `Views/enseignant/api/`).
- Ajout du hachage des mots de passe (`password_hash` / `password_verify`) avec script de migration des comptes existants.
- Correction de la requête SQL cassée dans `not.php` (double clause `WHERE`).
- Correction du lien entre professeur responsable et filière dans `gestion_profs.php`.
- Ajout d'un mécanisme d'authentification par jeton pour l'API mobile.
- Ajout de la persistance de session côté mobile avec `AsyncStorage`.
- Amélioration de la couverture de tests, actuellement absente du projet.

## Signaler un bug ou proposer une idée sans coder

Ouvre une issue sur https://github.com/Yokomi-YBJ/mon-iut/issues en utilisant le template approprié (bug ou proposition de fonctionnalité).

## Sécurité

Si tu découvres une faille de sécurité (par exemple une injection SQL exploitable), ne l'expose pas publiquement dans une issue. Contacte le mainteneur directement via GitHub pour convenir d'une divulgation responsable.

## Code de conduite

Sois respectueux dans les échanges (issues, PR, commentaires). Toute contribution est faite dans un esprit d'apprentissage et d'amélioration collective du projet.
