# Mon IUT - Documentation Complète du Projet

Ce document est la documentation de référence du projet Mon IUT. Il regroupe la présentation générale, l'architecture technique, la structure de la base de données, la liste des endpoints API, le fonctionnement du frontend mobile et des interfaces web, ainsi que les procédures d'installation. L'objectif est de permettre à n'importe quel développeur de comprendre le projet et de commencer à travailler dessus rapidement.

---

## Table des matières

1. [Présentation générale du projet](#1-présentation-générale-du-projet)
2. [Vue d'ensemble de l'architecture](#2-vue-densemble-de-larchitecture)
3. [Structure des dossiers](#3-structure-des-dossiers)
4. [Base de données](#4-base-de-données)
5. [Backend PHP - Fonctionnement général](#5-backend-php---fonctionnement-général)
6. [Backend PHP - Liste des endpoints API](#6-backend-php---liste-des-endpoints-api)
7. [Interfaces web (Admin, Enseignant, Responsable pédagogique)](#7-interfaces-web-admin-enseignant-responsable-pédagogique)
8. [Application mobile (React Native / Expo)](#8-application-mobile-react-native--expo)
9. [Authentification et sessions](#9-authentification-et-sessions)
10. [Installation et mise en route](#10-installation-et-mise-en-route)
11. [Configuration réseau entre le mobile et le backend](#11-configuration-réseau-entre-le-mobile-et-le-backend)
12. [Problèmes connus et dette technique](#12-problèmes-connus-et-dette-technique)
13. [Bonnes pratiques pour contribuer](#13-bonnes-pratiques-pour-contribuer)
14. [Glossaire](#14-glossaire)

---

## 1. Présentation générale du projet

### 1.1 Qu'est-ce que Mon IUT

Mon IUT est une plateforme numérique destinée à l'IUT de Ngaoundéré, au Cameroun. Le projet a deux parties principales :

- Une application mobile utilisée par les étudiants.
- Un backend web en PHP qui sert à la fois d'API pour l'application mobile et d'interface d'administration pour le personnel (administrateurs, enseignants, responsables pédagogiques).

### 1.2 Le problème résolu

Avant cette application, les informations étaient dispersées : emplois du temps papier, notes affichées sur des tableaux physiques, communiqués distribués à la main. Mon IUT centralise toutes ces informations dans une seule application, consultable même sans connexion internet pour certains contenus déjà téléchargés.

### 1.3 Fonctionnalités côté étudiant (mobile)

- Connexion avec un matricule et un mot de passe.
- Consultation de l'emploi du temps, avec téléchargement du PDF pour un accès hors-ligne.
- Consultation des notes par matière et par semestre, avec calcul automatique de la moyenne pondérée.
- Consultation et téléchargement de documents de cours et de documents administratifs.
- Réception de notifications et de communiqués envoyés par l'administration ou les responsables pédagogiques.
- Accès à un portail externe de gestion des stages.
- Modification du mot de passe.

### 1.4 Fonctionnalités côté personnel (interfaces web)

- Un espace administrateur pour gérer les étudiants, les professeurs, l'envoi de documents et la publication d'annonces.
- Un espace enseignant pour gérer les notes, les communiqués et les documents de cours (fiches TD).
- Un espace responsable pédagogique pour envoyer des notifications et des documents (emplois du temps, notes) aux étudiants de sa filière.

---

## 2. Vue d'ensemble de l'architecture

Le projet est composé de deux applications séparées qui communiquent via une API HTTP.

```
                        +---------------------------+
                        |     Base de données        |
                        |     MySQL / MariaDB        |
                        |     (mon-iut)               |
                        +--------------+--------------+
                                       |
                                       |
                        +--------------v--------------+
                        |         Backend PHP          |
                        |      (backend_api/)          |
                        |                               |
                        |  - API REST (JSON)           |
                        |    pour l'app mobile         |
                        |  - Pages web pour Admin,      |
                        |    Enseignant, Responsable    |
                        |    pédagogique                |
                        +------+------------------+-----+
                               |                    |
                   Requêtes    |                    |  Pages HTML/PHP
                   HTTP JSON   |                    |  rendues côté serveur
                               |                    |
                +--------------v---+      +---------v----------+
                | Application       |      | Navigateur web      |
                | mobile (Expo/     |      | (Admin, Enseignant, |
                | React Native)     |      | Responsable)         |
                +-------------------+      +----------------------+
```

### 2.1 Deux mondes distincts dans le backend

Le dossier `backend_api` contient en réalité deux styles de code différents, car le projet a évolué progressivement :

- Un style ancien, basé sur `mysqli` et des requêtes SQL parfois construites par concaténation de chaînes. On le trouve surtout dans `Views/responsablePedagogique/controllers/` et `Views/enseignant/`.
- Un style plus récent et plus sûr, basé sur PDO avec des requêtes préparées. On le trouve dans `Controllers/adminControllers/` et `Controllers/etudiantControllers/`.

Un développeur qui reprend le projet doit garder cette distinction en tête : le code n'est pas homogène, et il est recommandé de privilégier le style PDO avec requêtes préparées pour tout nouveau développement.

### 2.2 Technologies utilisées

Backend :
- PHP (sans framework, structure maison de type MVC simplifié).
- MySQL / MariaDB comme système de gestion de base de données.
- Deux méthodes d'accès à la base de données coexistent : PDO (`Models/function.php`) et mysqli (`Views/responsablePedagogique/controllers/connbd.php`, `Views/enseignant/config.php`).

Frontend mobile :
- React Native avec Expo (SDK 54).
- Expo Router pour le système de fichiers de routage (present dans les dépendances, mais la navigation active utilise actuellement React Navigation, voir la section dédiée).
- React Navigation (Stack et Bottom Tabs) pour la navigation entre écrans.
- Context API pour la gestion de l'état de connexion de l'utilisateur.
- Expo File System pour le téléchargement et le stockage local des fichiers PDF.

Interfaces web (Admin, Enseignant, Responsable pédagogique) :
- HTML, CSS et JavaScript natif (pas de framework front-end comme React ou Vue).
- Appels AJAX (fetch) vers les contrôleurs PHP pour charger et envoyer des données sans recharger la page.

---

## 3. Structure des dossiers

Voici l'arborescence générale du projet avec une explication de chaque zone.

```
projet/
|
|-- backend_api/                     Backend PHP complet
|   |-- index.php                    Page de connexion (login) du personnel
|   |-- indexScript.js               Script JS de la page de connexion
|   |
|   |-- Controllers/                 Contrôleurs PHP "modernes" (PDO)
|   |   |-- authController.php       Authentification admin/professeur
|   |   |-- adminControllers/        Contrôleurs pour l'espace admin
|   |   |-- etudiantControllers/     Contrôleurs pour l'app mobile (API)
|   |
|   |-- Models/
|   |   |-- function.php             Connexion PDO + fonctions utilitaires
|   |   |-- mon-iut.sql              Export SQL de la base de données
|   |
|   |-- Views/
|       |-- admin/                   Interface web de l'administrateur
|       |-- enseignant/              Interface web de l'enseignant (ancien style, mysqli)
|       |-- responsablePedagogique/  Interface web du responsable pédagogique (ancien style, mysqli)
|
|-- mobile_app/                      Application mobile Expo / React Native
|   |-- app/
|   |   |-- index.js                 Point d'entrée Expo
|   |   |-- App.js                   Composant racine, navigation
|   |   |-- config/api.js            Configuration des URL de l'API
|   |   |-- context/AuthContext.js   Contexte d'authentification
|   |   |-- screens/                 Écrans de l'application
|   |
|   |-- app.json                     Configuration Expo
|   |-- package.json                 Dépendances npm
|   |-- eas.json                     Configuration de build EAS
|
|-- README.md                        Ce fichier
```

### 3.1 Détail du dossier `backend_api/Controllers/`

C'est ici que se trouve la logique métier moderne, utilisée principalement par l'application mobile et l'espace admin.

`Controllers/etudiantControllers/` (utilisé par l'app mobile) :
- `login.php` : authentifie l'étudiant et renvoie son profil complet avec ses matières et ses notes.
- `get_edt.php` : renvoie la liste des emplois du temps disponibles pour un étudiant.
- `get_docs.php` : renvoie la liste des documents de cours et administratifs.
- `get_notifications.php` : renvoie les notifications destinées à l'étudiant.
- `update_password.php` : permet à l'étudiant de changer son mot de passe.

`Controllers/adminControllers/` (utilisé par l'espace admin web) :
- `get_structure.php` et `get_structure_etudiants.php` : renvoient la hiérarchie cycle / filière / parcours, utilisée pour remplir des listes déroulantes en cascade.
- `get_etudiants.php` : liste des étudiants avec filtres.
- `get_matieres.php` : liste des matières affectées à un parcours et un niveau.
- `inscriptionEtudiants.php` : création d'un compte étudiant.
- `update_student.php` : modification d'un étudiant.
- `api_delete.php` : désactivation (soft delete) d'un étudiant.
- `gestion_prof_process.php` : création d'un professeur, avec affectation de matières.
- `upload_document.php` : envoi d'un document PDF avec ciblage des destinataires.
- `send_annonce.php` : envoi d'une annonce/notification avec ciblage des destinataires.
- `disconnect.php` : déconnexion de l'admin (détruit la session).

`Controllers/authController.php` : point d'entrée unique de connexion pour les admins et les professeurs (avec redirection différente selon le rôle).

### 3.2 Détail du dossier `backend_api/Views/`

`Views/admin/` : interface complète de l'administrateur.
- `index.php` : tableau de bord.
- `gestion_etudiants.php` : CRUD des étudiants.
- `gestion_profs.php` : CRUD des professeurs.
- `envoi_documents.php` : formulaire d'envoi de documents.
- `annonces.php` : formulaire d'envoi d'annonces.
- `css/` et `js/` : styles et scripts propres à cette interface.

`Views/enseignant/` : interface de l'enseignant, plus ancienne, utilisant `mysqli` via `config.php`.
- Pages HTML statiques (`Integration.html`, `note.html`, `CC.html`, `Senthese.html`, `Rattrapage.html`, `td.html`, `Communiques.html`) qui appellent des scripts PHP dans `api/`.
- `api/` : contrôleurs `mysqli` (`notes.php`, `communiques.php`, `documents.php`, `data.php`, `deconnexion.php`).

`Views/responsablePedagogique/` : interface du responsable pédagogique, également en `mysqli`.
- `index.php` : tableau de bord du responsable.
- `notif.php` : envoi de notifications.
- `doc.php` : envoi de documents (notes et emplois du temps).
- `controllers/` : scripts de traitement (`not.php`, `note.php`, `emt.php`, `notification.php`, `upload_document.php`, `connbd.php`).

### 3.3 Détail du dossier `mobile_app/app/`

`screens/` contient tous les écrans de l'application, organisés ainsi :
- Écrans principaux accessibles depuis la barre d'onglets : `AccueilScreen.js`, `PlanningScreen.js`, `AcademiqueScreen.js`, `StageScreen.js`, `ProfileScreen.js`.
- `loginScreens/LoginScreen.js` : écran de connexion.
- `secondScreens/` : écrans accessibles en navigation empilée, hors des onglets (`NotificationScreen.js`, `newPasswordScreen.js`).

`context/AuthContext.js` : stocke l'utilisateur connecté en mémoire (pas de persistance automatique au redémarrage de l'application, voir section dédiée aux limites connues).

`config/api.js` : centralise l'adresse IP du serveur backend et construit toutes les URL des endpoints utilisés par l'application.

---

## 4. Base de données

Le nom de la base de données est `mon-iut`. Le fichier d'export complet se trouve dans `backend_api/Models/mon-iut.sql`.

### 4.1 Liste des tables

| Table | Rôle |
|---|---|
| `admins` | Comptes administrateurs (identifiant, mot de passe). |
| `professeurs` | Comptes enseignants. Le champ `niveau_responsabilite` indique si le professeur est aussi responsable pédagogique. |
| `etudiants` | Comptes étudiants, avec matricule, mot de passe, parcours, niveau, cycle et statut actif. |
| `cycle` | Les cycles d'étude : BTS, DUT, LICENCE. |
| `filieres` | Les filières, rattachées à un cycle, avec un responsable pédagogique optionnel. |
| `parcours` | Les parcours, rattachés à une filière (exemple : Génie Logiciel, Réseaux et Télécommunications). |
| `matieres` | Les matières enseignées, avec leur code et leur semestre. |
| `affectations_matieres` | Table de liaison qui relie une matière à un niveau, un parcours et éventuellement un professeur. |
| `notes` | Les notes des étudiants (contrôle continu, TP, synthèse) par matière et semestre. |
| `documents` | Les documents partagés (emplois du temps, cours, documents administratifs), avec le ciblage des destinataires. |
| `document_destinataires` | Table de liaison entre un document et les étudiants qui doivent le recevoir. |
| `notifications` | Les notifications et annonces envoyées, avec ciblage des destinataires. |
| `notification_destinataires` | Table de liaison entre une notification et les étudiants qui doivent la recevoir, avec un indicateur de lecture (`est_lu`). |

### 4.2 Schéma des relations principales

```
cycle (1) ----< filieres (1) ----< parcours (1) ----< etudiants
                    |
                    +----< affectations_matieres >---- matieres
                                    |
                                    +---- professeurs

etudiants (1) ----< notes >---- matieres

documents ----< document_destinataires >---- etudiants
notifications ----< notification_destinataires >---- etudiants
```

### 4.3 Le mécanisme de ciblage des destinataires

C'est un point important à comprendre, car il revient dans plusieurs contrôleurs (`send_annonce.php`, `upload_document.php`, `not.php`, `notification.php`, `notif.php`).

Les tables `documents` et `notifications` possèdent chacune deux colonnes de ciblage :
- `cible_type` : une valeur parmi `ALL`, `CYCLE`, `FILIERE`, `PARCOURS`, `ETUDIANT`.
- `cible_id` : l'identifiant correspondant au type choisi (peut être vide si `cible_type` vaut `ALL`).

Une troisième colonne, `niveau_cible`, permet de restreindre en plus par niveau (1, 2, 3, ou `ALL`).

Quand un document ou une notification est créé, le contrôleur PHP calcule ensuite la liste des étudiants concernés à partir de ce ciblage, puis insère une ligne par étudiant dans `document_destinataires` ou `notification_destinataires`. C'est cette table de liaison que l'application mobile consulte pour savoir quoi afficher à chaque étudiant (voir `get_notifications.php`, `get_edt.php`, `get_docs.php` : en réalité, ces trois fichiers font le filtrage directement sur `cible_type` et `cible_id`, sans passer par la table de liaison, ce qui est signalé plus loin dans les incohérences connues).

### 4.4 Calcul de la moyenne pondérée

La formule métier de calcul de la moyenne, utilisée côté mobile dans `AcademiqueScreen.js`, est la suivante :

- Si l'étudiant a une note de TP : moyenne = (Synthèse x 0.7) + (CC x 0.2) + (TP x 0.1).
- Si l'étudiant n'a pas de note de TP : moyenne = (Synthèse x 0.7) + (CC x 0.3).

Une UE est considérée comme validée si la moyenne est supérieure ou égale à 10 sur 20.

---

## 5. Backend PHP - Fonctionnement général

### 5.1 Les deux façons de se connecter à la base

Première méthode, avec PDO, dans `backend_api/Models/function.php` :

```php
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
$pdo = new PDO($dsn, $username, $password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
```

Ce fichier doit être inclus avec `require_once` dans tout nouveau contrôleur. Il fournit aussi une fonction utilitaire `time_elapsed_string()` qui affiche une date sous forme relative (exemple : "Il y a 2 heures"), utilisée dans les pages d'historique de l'admin.

Deuxième méthode, avec mysqli, présente à deux endroits différents avec des identifiants différents :
- `backend_api/Views/responsablePedagogique/controllers/connbd.php`
- `backend_api/Views/enseignant/config.php`

Ces deux fichiers ouvrent chacun leur propre connexion à la même base `mon-iut`. Il n'y a pas de connexion mysqli partagée entre les deux espaces.

### 5.2 Format des réponses

Les contrôleurs destinés à l'application mobile et à l'espace admin renvoient du JSON avec la structure suivante dans la majorité des cas :

```json
{
  "success": true,
  "message": "Texte optionnel",
  "data": []
}
```

Certains contrôleurs plus anciens (dans `Views/responsablePedagogique/controllers/` et `Views/enseignant/api/`) renvoient simplement du texte brut ou un JSON avec une structure légèrement différente. Il faut donc toujours vérifier le format exact attendu avant d'appeler un endpoint depuis un nouveau client.

### 5.3 Gestion des transactions

Les contrôleurs qui touchent à plusieurs tables en même temps (par exemple créer un document puis l'associer à plusieurs étudiants) utilisent des transactions PDO :

```php
$pdo->beginTransaction();
// ... plusieurs requêtes ...
$pdo->commit();
// en cas d'erreur : $pdo->rollBack();
```

C'est le cas dans `upload_document.php`, `send_annonce.php`, `gestion_prof_process.php` et `api_delete.php`.

---

## 6. Backend PHP - Liste des endpoints API

Cette section liste les points d'entrée HTTP utilisés par l'application mobile et par les interfaces web, avec la méthode, les paramètres attendus et la réponse.

### 6.1 Endpoints utilisés par l'application mobile

Tous ces endpoints sont définis dans `backend_api/Controllers/etudiantControllers/` et sont référencés dans `mobile_app/app/config/api.js`.

**POST `/Controllers/etudiantControllers/login.php`**

Corps de la requête (JSON) :
```json
{
  "matricule": "24GLO01IU",
  "password": "motdepasse"
}
```

Réponse en cas de succès :
```json
{
  "success": true,
  "user": {
    "id": 1,
    "nom": "...",
    "prenom": "...",
    "matricule": "...",
    "cycle": "DUT",
    "niveau": "2",
    "filiere": "...",
    "id_parcours": 8,
    "parcours": "...",
    "matieres": [
      { "code_matiere": "...", "nom_matiere": "...", "semestre": "S3", "note_cc": null, "note_tp": null, "note_synthese": null }
    ]
  }
}
```

Réponse en cas d'échec : `success: false` avec un code HTTP 401 (identifiants incorrects) ou 403 (compte désactivé).

**GET `/Controllers/etudiantControllers/get_edt.php?id_parcours=8&niveau=2`**

Renvoie la liste des emplois du temps (`titre`, `url_fichier`, `date_publication`) ciblant ce parcours ou tous les étudiants, filtrés par niveau.

**GET `/Controllers/etudiantControllers/get_docs.php?id_parcours=8&niveau=2`**

Renvoie la liste des documents de cours et administratifs.

**GET `/Controllers/etudiantControllers/get_notifications.php?id_parcours=8&niveau=2`**

Renvoie la liste des notifications (`titre`, `body`, `date`, `type_alerte`).

**POST `/Controllers/etudiantControllers/update_password.php`**

Corps de la requête (JSON) :
```json
{
  "id_user": 1,
  "old_password": "ancien",
  "new_password": "nouveau"
}
```

### 6.2 Endpoints utilisés par l'espace admin

Tous préfixés par `/Controllers/adminControllers/`.

| Fichier | Méthode | Rôle |
|---|---|---|
| `get_structure.php` | GET | Renvoie cycles, filières ou parcours selon le paramètre `type` et `id` (utilisé pour les listes en cascade). |
| `get_structure_etudiants.php` | GET | Renvoie toute la hiérarchie cycles/filières/parcours en une seule requête. |
| `get_etudiants.php` | GET | Liste des étudiants actifs, avec filtres optionnels `cycle`, `filiere`, `parcours`, `niveau`. |
| `get_matieres.php` | GET | Liste des matières affectées à un `parcours` et un `niveau`. |
| `inscriptionEtudiants.php` | POST | Création d'un étudiant. Le mot de passe généré automatiquement est le nom en minuscules sans espace suivi de l'année courante. |
| `update_student.php` | POST | Mise à jour des informations d'un étudiant. |
| `api_delete.php` | POST | Désactivation d'un étudiant (met `est_actif` à 0, ne supprime pas la ligne). |
| `gestion_prof_process.php` | POST | Création d'un professeur et affectation de matières. |
| `upload_document.php` | POST | Envoi d'un document PDF avec ciblage des destinataires. |
| `send_annonce.php` | POST | Envoi d'une annonce/notification avec ciblage des destinataires. |
| `disconnect.php` | POST | Déconnexion de l'administrateur. |

### 6.3 Point d'entrée de connexion du personnel

**POST `/Controllers/authController.php`**

Reçoit `email` et `password` en formulaire (`multipart/form-data` ou `application/x-www-form-urlencoded`). Vérifie d'abord dans la table `admins`, puis dans la table `professeurs`. Renvoie une URL de redirection différente selon le rôle trouvé.

### 6.4 Endpoints plus anciens (mysqli)

Ces endpoints existent mais utilisent un style de code plus ancien et moins sécurisé. Ils sont documentés ici pour information, mais il est recommandé de les migrer progressivement vers le style PDO.

`Views/responsablePedagogique/controllers/` :
- `not.php` : envoi de notification par le responsable pédagogique.
- `note.php` : saisie d'une note pour un étudiant (via son matricule et le code de la matière).
- `emt.php` : envoi d'un emploi du temps (version simplifiée).
- `notification.php` : autre variante d'envoi de notification.
- `upload_document.php` : envoi de document PDF ciblé par parcours.

`Views/enseignant/api/` :
- `notes.php` : ajout et recherche de notes.
- `communiques.php` : envoi et liste des communiqués.
- `documents.php` : upload et liste de fiches TD.
- `data.php` : liste des filières, parcours et matières.
- `deconnexion.php` : déconnexion de l'enseignant.

---

## 7. Interfaces web (Admin, Enseignant, Responsable pédagogique)

### 7.1 Espace administrateur

Accès protégé par la variable de session `$_SESSION['admin']`. Toute page de cet espace commence par cette vérification :

```php
session_start();
if (empty($_SESSION['admin'])) {
    header('Location: ../../index.php');
    exit;
}
```

Pages principales :
- `index.php` : tableau de bord avec des cartes vers les autres sections.
- `gestion_etudiants.php` : formulaire de création d'étudiant avec des listes déroulantes en cascade (cycle, puis filière, puis parcours, puis niveau), et un tableau des étudiants existants avec filtres.
- `gestion_profs.php` : formulaire de création de professeur, avec un bloc conditionnel qui apparaît si le rôle choisi est "Responsable Pédagogique", et une section pour affecter des matières via des filtres en cascade.
- `envoi_documents.php` : formulaire d'envoi de document PDF avec ciblage des destinataires (tous, cycle, filière, parcours, étudiant spécifique), et historique des 4 derniers documents envoyés.
- `annonces.php` : identique à `envoi_documents.php` mais pour les annonces textuelles.

Le fichier `js/communication.js` gère la logique commune entre `envoi_documents.php` et `annonces.php` : il détecte automatiquement lequel des deux formulaires est présent sur la page (en vérifiant la présence d'un input de type fichier) pour appeler le bon contrôleur PHP.

### 7.2 Espace enseignant

Accès protégé par la variable de session `$_SESSION['user']`, avec un indicateur `is_responsable` calculé lors de la connexion. Cet espace utilise des pages HTML statiques qui appellent des scripts PHP dans `api/` via fetch.

Ce style est différent de l'espace admin : au lieu de contrôleurs individuels par action, chaque fichier PHP dans `api/` gère plusieurs actions distinguées par un paramètre `action` dans l'URL (exemple : `communiques.php?action=send` ou `communiques.php?action=list`).

### 7.3 Espace responsable pédagogique

Accès également protégé par `$_SESSION['user']`, avec redirection différente si `is_responsable` est vrai. Cet espace a deux pages principales :
- `notif.php` : formulaire d'envoi de notification, avec un menu déroulant dynamique en JavaScript qui affiche un champ supplémentaire selon que la cible est "Tous", "Parcours" ou "Étudiant".
- `doc.php` : formulaire à deux onglets (Notes, Emploi du temps) géré par un système d'onglets en JavaScript pur.

Les contrôleurs de cet espace, dans `controllers/`, sont dans un style ancien avec `mysqli` et parfois des requêtes SQL construites par concaténation directe de variables (voir section sur les problèmes connus).

---

## 8. Application mobile (React Native / Expo)

### 8.1 Point d'entrée et navigation

Le fichier `app/index.js` enregistre le composant racine `App` auprès d'Expo. Le fichier `app/App.js` définit la structure de navigation :

```
NavigationContainer
  └── Stack.Navigator (RootNavigator)
        ├── Si aucun utilisateur connecté : LoginScreen
        └── Si utilisateur connecté :
              ├── MainTabs (Tab.Navigator)
              │     ├── Accueil
              │     ├── Planning
              │     ├── Académique
              │     ├── Docs & Stages
              │     └── Profil
              ├── notification (écran empilé, hors onglets)
              └── newPassword (écran empilé, hors onglets)
```

La bascule entre l'écran de connexion et les onglets principaux se fait automatiquement en fonction de la valeur de `user` dans `AuthContext`. Il n'y a pas de vérification de jeton ou de session persistante : dès que `user` est non nul, l'utilisateur est considéré comme connecté.

### 8.2 Gestion de l'authentification (`AuthContext.js`)

Le contexte expose `user`, `setUser`, `login` et `logout`. Le login stocke simplement l'objet utilisateur renvoyé par l'API dans le state React. Il n'y a pas d'utilisation d'`AsyncStorage` pour la persistance entre les sessions de l'application : si l'application est fermée puis rouverte, l'utilisateur doit se reconnecter (une note dans le code de `logout()` mentionne explicitement que cette persistance devrait être ajoutée plus tard).

### 8.3 Configuration de l'API (`config/api.js`)

Toutes les URL de l'API mobile sont construites à partir d'une seule adresse IP :

```javascript
export const IP_ADRESS = "192.168.184.88:80";
export const BASE_URL = `http://${IP_ADRESS}/mon-iut`;
```

C'est le point le plus important à modifier lors de la mise en route du projet en local (voir section 11).

### 8.4 Écrans principaux

`LoginScreen.js` : formulaire de connexion avec matricule et mot de passe, appel à `login.php`, et stockage du résultat dans le contexte via `setUser`.

`AccueilScreen.js` : écran d'accueil affichant le nom de l'étudiant, sa filière, son cycle et son niveau, avec des raccourcis vers le planning et les documents.

`PlanningScreen.js` : liste des emplois du temps disponibles. Chaque fiche vérifie si le fichier PDF est déjà présent localement (via `expo-file-system`). Si oui, un appui ouvre directement le fichier (avec `IntentLauncher` sur Android, ou le menu de partage natif sur iOS). Si non, un appui déclenche le téléchargement.

`AcademiqueScreen.js` : liste des matières par semestre, avec calcul et affichage de la moyenne pondérée et du statut de validation de chaque UE.

`StageScreen.js` : deux onglets. Le premier redirige vers le portail externe de gestion des stages. Le second affiche les documents de cours (filtrés par matière) et les documents administratifs, avec le même mécanisme de téléchargement/ouverture que le planning.

`ProfileScreen.js` : fiche d'identité de l'étudiant, accès à l'écran de changement de mot de passe, et bouton de déconnexion avec une fenêtre modale de confirmation.

`secondScreens/NotificationScreen.js` : liste des notifications, avec un style visuel différent selon le type (`URGENT`, `INFO`, ou autre).

`secondScreens/newPasswordScreen.js` : formulaire de changement de mot de passe en trois champs (ancien, nouveau, confirmation).

### 8.5 Dépendances importantes du mobile

D'après `package.json` :
- `expo` (SDK 54) : environnement de développement et de build.
- `expo-router` : présent dans les dépendances mais la navigation active du projet utilise `@react-navigation/*` (Stack et Bottom Tabs), pas le système de fichiers d'Expo Router. Un développeur qui voudrait migrer vers Expo Router devrait revoir toute la structure de navigation actuelle.
- `expo-file-system` : téléchargement et vérification de présence des fichiers PDF en local.
- `expo-sharing` et `expo-intent-launcher` : ouverture des fichiers PDF téléchargés.
- `@react-native-firebase/*` : présent dans les dépendances (app, auth, firestore) mais non utilisé dans le code actuel des écrans fournis. Cela suggère une intégration Firebase prévue ou en cours, à vérifier avec l'équipe avant de l'utiliser ou de la retirer.
- `@react-three/fiber`, `@react-three/drei`, `three` : présents dans les dépendances, sans utilisation visible dans les écrans actuels. Probablement liés à une fonctionnalité expérimentale ou abandonnée.

---

## 9. Authentification et sessions

### 9.1 Authentification du personnel (admin, enseignant, responsable pédagogique)

Le flux est le suivant :

1. Le personnel se connecte via `backend_api/index.php`, qui envoie `email` et `password` à `Controllers/authController.php`.
2. Le contrôleur vérifie d'abord dans `admins`. Si trouvé, il stocke l'admin dans `$_SESSION['admin']` et redirige vers `Views/admin/index.php`.
3. Sinon, il vérifie dans `professeurs`. Si trouvé, il stocke le professeur dans `$_SESSION['user']`, calcule `is_responsable` à partir du champ `niveau_responsabilite`, et redirige soit vers `Views/responsablePedagogique/index.php` (si responsable), soit vers `Views/enseignant/index.html` (sinon).
4. Si rien n'est trouvé, un message d'erreur est renvoyé.

Les mots de passe sont stockés et comparés en clair dans la base de données, sans hachage. C'est un point de sécurité important à corriger avant toute mise en production réelle (voir section 12).

### 9.2 Authentification des étudiants (mobile)

Le flux est plus simple : l'application mobile envoie le matricule et le mot de passe à `login.php`, qui compare directement avec la valeur stockée en base (également en clair). En cas de succès, toutes les informations de l'étudiant, y compris ses matières et ses notes, sont renvoyées en une seule réponse et stockées dans le contexte React côté mobile.

Il n'y a pas de jeton d'authentification (pas de JWT, pas de session HTTP côté mobile). Chaque requête ultérieure vers l'API (emploi du temps, documents, notifications) transmet directement l'identifiant du parcours et le niveau de l'étudiant en paramètre d'URL, sans revérifier l'identité de l'appelant.

---

## 10. Installation et mise en route

### 10.1 Prérequis

- Un serveur PHP avec Apache (ou équivalent), par exemple via XAMPP, WAMP ou MAMP.
- MySQL ou MariaDB.
- Node.js et npm pour l'application mobile.
- L'outil Expo CLI (installé automatiquement via `npx expo`).
- Un téléphone avec l'application Expo Go, ou un émulateur Android/iOS, pour tester l'application mobile.

### 10.2 Mise en route du backend

1. Copier le dossier `backend_api` dans le répertoire servi par le serveur web local (par exemple `htdocs/mon-iut` pour XAMPP), de sorte que l'URL de base soit `http://localhost/mon-iut`.
2. Créer une base de données nommée `mon-iut` dans phpMyAdmin ou en ligne de commande.
3. Importer le fichier `backend_api/Models/mon-iut.sql` dans cette base.
4. Vérifier les identifiants de connexion dans `backend_api/Models/function.php` (par défaut : hôte `localhost`, utilisateur `root`, mot de passe vide). Adapter si l'environnement local utilise d'autres identifiants.
5. Vérifier également les identifiants dans `backend_api/Views/responsablePedagogique/controllers/connbd.php` et `backend_api/Views/enseignant/config.php`, qui doivent pointer vers la même base.
6. Ouvrir `http://localhost/mon-iut/index.php` dans un navigateur pour vérifier que la page de connexion s'affiche.

### 10.3 Mise en route de l'application mobile

1. Se placer dans le dossier `mobile_app`.
2. Installer les dépendances :
```
npm install
```
3. Modifier l'adresse IP dans `mobile_app/app/config/api.js` pour qu'elle corresponde à l'adresse IP locale de la machine qui héberge le backend (voir section 11 pour trouver cette adresse).
4. Démarrer le serveur de développement Expo :
```
npx expo start
```
5. Scanner le QR code avec l'application Expo Go, ou lancer un émulateur.

### 10.4 Comptes de test disponibles dans l'export SQL fourni

D'après le fichier `mon-iut.sql`, les comptes suivants existent déjà :

Étudiants (mot de passe en clair) :
- Matricule `24GLO01IU`, mot de passe `abakar2026`.
- Matricule `22GLO`, mot de passe `konai2026`.
- Matricule `25GLO77IU`, mot de passe `talla2026`.

Professeurs :
- `kani@gmail.com`, mot de passe `123456` (enseignant simple).
- `dassi@gmail.com`, mot de passe `123456` (responsable pédagogique, `niveau_responsabilite` = 2).
- `batoure@gmail.com`, mot de passe `123456` (enseignant simple).

Il n'y a pas de compte administrateur préconfiguré visible dans l'export fourni : il faudra en créer un manuellement dans la table `admins` pour tester l'espace admin.

---

## 11. Configuration réseau entre le mobile et le backend

C'est le point qui pose le plus souvent problème lors de la prise en main du projet, car l'application mobile ne peut pas utiliser `localhost` pour contacter le backend : `localhost` sur un téléphone ou un émulateur désigne l'appareil lui-même, pas la machine de développement.

### 11.1 Étapes à suivre

1. S'assurer que le téléphone (ou l'émulateur) et l'ordinateur qui héberge le backend PHP sont connectés au même réseau Wi-Fi.
2. Trouver l'adresse IP locale de l'ordinateur :
   - Sous Windows : ouvrir une invite de commande et taper `ipconfig`, chercher la ligne "Adresse IPv4".
   - Sous macOS ou Linux : taper `ifconfig` ou `ip addr`, chercher l'adresse de l'interface réseau active (souvent au format `192.168.x.x`).
3. Reporter cette adresse dans `mobile_app/app/config/api.js`, à la place de la valeur actuelle `192.168.184.88`.
4. S'assurer que le pare-feu de l'ordinateur autorise les connexions entrantes sur le port utilisé par le serveur PHP (généralement le port 80).
5. Redémarrer le serveur Expo après modification de ce fichier, car les changements dans `config/api.js` ne sont pas toujours rechargés à chaud correctement pour toutes les valeurs exportées.

### 11.2 Pourquoi cette adresse doit être modifiée par chaque développeur

L'adresse IP locale actuellement enregistrée dans le projet (`192.168.184.88`) correspond au réseau du dernier développeur qui l'a testée. Chaque nouveau développeur doit la remplacer par sa propre adresse IP locale pour que l'application mobile puisse atteindre son backend.

---

## 12. Problèmes connus et dette technique

Cette section liste les points qui méritent une attention particulière ou une correction avant une mise en production.

### 12.1 Sécurité

- Les mots de passe sont stockés en clair dans la base de données, aussi bien pour les étudiants que pour le personnel. Il est recommandé d'utiliser `password_hash()` et `password_verify()` de PHP pour hacher les mots de passe avant stockage, et d'ajouter un script de migration pour les comptes existants.
- Certains contrôleurs anciens (`Views/responsablePedagogique/controllers/note.php`, par exemple) construisent des requêtes SQL par concaténation directe de variables provenant de `$_POST`, ce qui expose à des injections SQL. Ces requêtes doivent être réécrites avec des requêtes préparées, à l'image de ce qui est déjà fait dans `Controllers/etudiantControllers/` et `Controllers/adminControllers/`.
- Il n'existe pas de jeton d'authentification pour les appels API de l'application mobile. N'importe quel appareil peut appeler `get_edt.php`, `get_docs.php` ou `get_notifications.php` avec n'importe quel `id_parcours`, sans prouver qu'il correspond à un étudiant réellement connecté. Une amélioration possible serait d'introduire un jeton (par exemple un JWT) renvoyé à la connexion, à transmettre ensuite dans chaque requête.

### 12.2 Incohérences fonctionnelles à vérifier

- Les endpoints `get_edt.php`, `get_docs.php` et `get_notifications.php` filtrent directement sur les colonnes `cible_type` et `cible_id` des tables `documents` et `notifications`, sans consulter les tables de liaison `document_destinataires` et `notification_destinataires`. Cela signifie que le statut de lecture (`est_lu`) présent dans `notification_destinataires` n'est actuellement pas exploité côté mobile, et que la liste des destinataires réels (calculée au moment de l'envoi) n'est pas utilisée pour l'affichage. Il faut décider si l'affichage doit se baser sur le ciblage brut (comme actuellement) ou sur la liste de destinataires déjà calculée.
- Dans `backend_api/Views/responsablePedagogique/controllers/not.php`, le cas `cible_type = 'ALL'` contient une requête SQL avec deux clauses `WHERE` consécutives, ce qui est une erreur de syntaxe SQL (`WHERE e.id_parcours = p.id WHERE e.est_actif = 1 ...`). Cette route doit être corrigée avant d'être utilisée.
- Dans `gestion_profs.php` (interface admin), la requête de liste des professeurs utilise `p.idFiliere`, alors que la table `professeurs` dans le schéma SQL fourni ne contient pas de colonne `idFiliere` (le lien entre un professeur responsable et sa filière semble en réalité géré via la colonne `id_responsable` de la table `filieres`). Ce point doit être clarifié et corrigé pour que cette page fonctionne correctement.
- Le fichier `backend_api/Controllers/adminControllers/update_student.php` utilise un chemin d'inclusion suspect : `require_once __DIR__ . '../../Models/function.php';` (il manque un séparateur après `__DIR__`, ce qui peut provoquer un chemin invalide selon le système d'exploitation). Il est préférable d'écrire `__DIR__ . '/../../Models/function.php'`.

### 12.3 Dépendances mobiles non utilisées

Le fichier `package.json` de l'application mobile contient des dépendances liées à Firebase (`@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-firebase/firestore`) et à la 3D (`@react-three/fiber`, `@react-three/drei`, `three`) qui n'apparaissent pas utilisées dans les écrans fournis dans ce projet. Avant de les retirer, il convient de vérifier avec l'équipe si elles sont prévues pour une fonctionnalité à venir.

### 12.4 Absence de persistance de session côté mobile

Comme indiqué en section 8.2, la connexion de l'utilisateur n'est pas conservée entre deux ouvertures de l'application. Une intégration d'`AsyncStorage` (déjà présente dans les dépendances du projet) permettrait de résoudre ce point.

---

## 13. Bonnes pratiques pour contribuer

Pour tout nouveau développement sur ce projet, il est recommandé de suivre les règles suivantes, afin de converger progressivement vers un code plus homogène et plus sûr.

### 13.1 Côté backend

- Toujours utiliser PDO avec des requêtes préparées (`$pdo->prepare(...)->execute([...])`), jamais de concaténation de variables utilisateur dans une requête SQL.
- Toujours inclure `Models/function.php` avec `require_once` pour obtenir la connexion `$pdo`.
- Toujours répondre en JSON avec `header('Content-Type: application/json')` et la structure `{ success, message, data }`.
- Utiliser des transactions PDO (`beginTransaction`, `commit`, `rollBack`) dès qu'une opération touche plusieurs tables.
- Éviter d'ajouter du nouveau code dans le style `mysqli` des anciens contrôleurs. Si une fonctionnalité existante doit être modifiée, en profiter pour la migrer vers PDO.

### 13.2 Côté mobile

- Centraliser toute nouvelle URL d'API dans `mobile_app/app/config/api.js`, ne jamais écrire une URL en dur dans un écran.
- Réutiliser le contexte `AuthContext` pour accéder aux informations de l'utilisateur connecté (`useAuth()`), ne pas dupliquer cette logique.
- Respecter le style visuel existant : fond sombre (`#0F172A`), cartes (`#1E293B`), couleur d'accent ambre/orange (`#F59E0B`), pour garder une cohérence visuelle entre les écrans.
- Pour tout nouvel écran nécessitant des fichiers téléchargeables, réutiliser le même mécanisme de vérification/téléchargement/ouverture déjà présent dans `PlanningScreen.js` et `StageScreen.js`.

### 13.3 Côté base de données

- Toute nouvelle fonctionnalité de ciblage de destinataires (documents ou notifications) doit respecter le mécanisme déjà en place (`cible_type`, `cible_id`, `niveau_cible`) plutôt que d'en inventer un nouveau.
- Toute suppression de compte (étudiant ou professeur) doit passer par une désactivation logique (`est_actif = 0`), jamais par une suppression physique de la ligne, afin de conserver l'intégrité des données historiques (notes, documents envoyés).

---

## 14. Glossaire

| Terme | Définition |
|---|---|
| Cycle | Niveau général d'étude : BTS, DUT ou LICENCE. |
| Filière | Grand domaine d'études rattaché à un cycle, par exemple Génie Informatique. |
| Parcours | Spécialisation à l'intérieur d'une filière, par exemple Génie Logiciel ou Réseaux et Télécommunications. |
| UE | Unité d'Enseignement, c'est-à-dire une matière évaluée avec une moyenne et un statut de validation. |
| CC | Contrôle Continu, une des composantes de la note finale d'une matière. |
| TP | Travaux Pratiques, composante optionnelle de la note finale selon les matières. |
| Synthèse | Examen final d'une matière, composante la plus importante de la moyenne. |
| Responsable pédagogique | Un professeur ayant une responsabilité supplémentaire de gestion sur une filière (indiqué par le champ `niveau_responsabilite`). |
| Cible / Ciblage | Mécanisme qui définit à qui un document ou une notification est destiné (tous, un cycle, une filière, un parcours, ou un étudiant précis). |
| Soft delete | Désactivation logique d'un enregistrement (mise à 0 d'un champ `est_actif`) plutôt que sa suppression physique. |
| PDO | PHP Data Objects, extension PHP moderne pour l'accès aux bases de données avec support des requêtes préparées. |
| mysqli | Extension PHP plus ancienne pour l'accès à MySQL, encore présente dans certaines parties du projet. |
| Expo | Ensemble d'outils qui simplifie le développement d'applications React Native. |
| JSON | Format d'échange de données texte utilisé entre le backend et l'application mobile. |
