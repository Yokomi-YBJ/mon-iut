# Présentation du Projet : **Mon IUT**

Ce document propose une description littérale et technique complète de l’application mobile **Mon IUT**, conçue pour accompagner au quotidien les étudiants de l'**IUT (Institut Universitaire de Technologie) de Ngaoundéré** (Université de Ngaoundéré, Cameroun).

---

## Résumé : Ce que fait l'application en quelques mots

L’application **Mon IUT** est une plateforme mobile centralisée qui simplifie la vie universitaire des étudiants au quotidien. Voici ses actions concrètes :

1. **Accès au Planning en temps réel** : Consultation et téléchargement des emplois du temps de la semaine (au format PDF). Une fois téléchargé, le planning reste accessible **hors-ligne** à tout moment.
2. **Suivi des Notes & Moyennes** : Liste des matières par semestre et **calcul automatique des moyennes pondérées** (70% Synthèse, 30% CC ou 20% CC + 10% TP) pour indiquer si l'UE est validée (Moyenne $\ge$ 10).
3. **Espace Stages & Documents** : Téléchargement de supports de cours et passerelle sécurisée vers le portail officiel de l'école pour postuler à des stages ou gérer ses conventions.
4. **Communiqués & Notifications** : Centre de notifications et fil d'actualités pour rester informé des dernières annonces de la direction en temps réel.
5. **Espace Personnel Sécurisé** : Authentification sécurisée par matricule, modification de mot de passe et récapitulatif des informations d'études (filière, niveau, cycle).

---

## 1. Vision et Objectifs du Projet

L’application **Mon IUT** est une solution mobile moderne et centralisée ayant pour but de digitaliser et de simplifier l'accès à l'information universitaire. Elle rassemble dans un espace unique et sécurisé toutes les fonctionnalités essentielles à la vie étudiante : consultations d'emplois du temps, suivi des notes et moyennes, téléchargement de supports de cours et de documents administratifs, ainsi qu'un accès privilégié aux offres et conventions de stages.

---

## 2. Fiche Technique de l'Application

*   **Nom de l'application** : Mon IUT
*   **Plateformes** : Android et iOS (Multiplateforme)
*   **Framework Principal** : **React Native** propulsé par **Expo (SDK 54)**
*   **Langage** : JavaScript / TypeScript
*   **Gestion de l'État & Navigation** :
    *   **Context API** (`AuthContext`) pour une gestion unifiée et réactive de la session utilisateur.
    *   **React Navigation** v7 combinant `@react-navigation/stack` (navigation par pile) et `@react-navigation/bottom-tabs` (barre d'onglets inférieure).
*   **Persistance & Stockage local** : `expo-file-system` pour la mise en cache des fichiers PDF (emplois du temps, cours, documents administratifs).
*   **Communication Backend** : API REST (format JSON) construite sous forme de contrôleurs **PHP** hébergés sur un serveur distant (permettant la récupération des emplois du temps, des documents de cours et de l'authentification sécurisée des étudiants).
*   **Chart graphique & UX** :
    *   Design moderne orienté **Dark Mode** (fond bleu-ardoise `#0F172A`, cartes `#1E293B`, contrastes ambre/orange `#F59E0B`).
    *   Animations et transitions fluides (système d'intercalation horizontale typée iOS, intégration de `react-native-reanimated` et `react-native-gesture-handler`).
    *   Usage d'icônes professionnelles issues de `@expo/vector-icons` (Feather, Ionicons, FontAwesome5, MaterialCommunityIcons).

---

## 3. Architecture Logicielle et Navigation

La navigation de l'application est structurée de manière intelligente autour de l'état d'authentification de l'étudiant (`user` stocké dans le `AuthContext`) :

```
                                 [ Lancement de l'App ]
                                            │
                                  ┌─────────┴─────────┐
                                  ▼                   ▼
                            [ Non Connecté ]     [ Connecté ]
                                  │                   │
                                  ▼                   ▼
                           [ Écran de Login ]   [ Menu d'onglets (MainTabs) ]
                                                      │
                       ┌──────────────┬───────────────┼──────────────┬──────────────┐
                       ▼              ▼               ▼              ▼              ▼
                   [Accueil]     [Planning]     [Académique]    [Stages/Docs]    [Profil]
```

*   **Redirection Automatique** : Si aucun utilisateur n'est connecté, l'étudiant est restreint à l'écran de connexion (`LoginScreen`). Dès que l'authentification réussit, l'application le redirige de manière transparente vers l'interface principale (`MainTabs`).
*   **Navigation par Onglets (MainTabs)** : Une barre d'onglets inférieure esthétique et épurée permet de basculer instantanément entre les 5 espaces majeurs de l’application.
*   **Écrans Secondaires** : Des fenêtres hors-flux (Modales ou Stack Screens comme `NotificationScreen` et `newPasswordScreen`) s'ouvrent au-dessus de la barre d'onglets pour préserver le focus visuel de l'étudiant.

---

## 4. Description Littérale des Fonctionnalités Majeures

### A. Connexion Sécurisée (`LoginScreen`)
*   **Interface Épurée** : Présence du logo de l’IUT de Ngaoundéré sur fond sombre avec une typographie soignée.
*   **Saisie Sécurisée** : Les champs de saisie du matricule et du mot de passe sont ergonomiques (bouton d'affichage/masquage du mot de passe avec une icône œil).
*   **Comportement Élastique** : Intégration de `KeyboardAvoidingView` pour éviter le chevauchement du clavier virtuel sur les champs de saisie, garantissant une excellente expérience utilisateur sur tous les formats d'écrans.
*   **Authentification API** : Requête réseau HTTP POST envoyée en temps réel au serveur pour valider les identifiants et récupérer l'ensemble des données spécifiques du profil étudiant (nom, parcours, niveau, matières, etc.).

### B. Accueil Personnalisé (`AccueilScreen`)
*   **Bienvenue Nominative** : Un panneau d'accueil affiche le nom de l'étudiant, sa filière (ex: Informatique) ainsi que son niveau d'études actuel (Licence, DUT, etc.), le tout enrichi par un filigrane de fond artistique en forme de chapeau de diplômé.
*   **Informations Temporelles** : Affichage dynamique de la date du jour au format littéraire français complet (ex : "samedi 11 juillet 2026").
*   **Centre de Notifications** : Une cloche de notifications munie d'un badge ambré affiche en temps réel le nombre de messages administratifs non lus.
*   **Raccourcis & Communiqués** : Des boutons d'accès rapide permettent d'ouvrir en un clic l'emploi du temps ou l'espace des stages. Un espace "Dernier Communiqué" affiche les notes d'information urgentes publiées par la direction de l'école (ex: convocations de délégués).

### C. Emploi du Temps Dynamique (`PlanningScreen`)
*   **Synchronisation en Temps Réel** : L'application récupère l'emploi du temps de la semaine directement depuis l'API en fonction du parcours et du niveau d'études de l'étudiant.
*   **Mise en Cache intelligente (Mode Hors-ligne)** : 
    *   Grâce à `expo-file-system`, l'application vérifie si le document PDF de l'emploi du temps est déjà présent localement sur l’appareil.
    *   Si le fichier n'est pas présent, un clic sur la carte déclenche son téléchargement direct depuis le serveur d'école.
    *   Si le fichier a déjà été téléchargé, il est instantanément ouvert via un lecteur PDF natif (sur Android via un `IntentLauncher` sécurisé par un Content URI, sur iOS via le menu de partage natif `Sharing`).
*   **Actualisation Intuitive (Pull-to-refresh)** : L'étudiant peut faire glisser l'écran vers le bas pour forcer la mise à jour des plannings si des modifications de dernière minute surviennent.

### D. Espace Académique (`AcademiqueScreen`)
*   **Suivi Rigoureux des Notes** : Présentation claire de toutes les Unités d’Enseignement (UE) du semestre.
*   **Onglets de Semestres Dynamiques** : L'interface génère automatiquement des boutons d'onglets pour chaque semestre disponible dans le cursus de l'étudiant (Semestre 1, Semestre 2, etc.).
*   **Calcul de Moyennes Pondérées** :
    *   L’application applique rigoureusement la formule académique de l'IUT pour calculer la moyenne de chaque matière : **70% pour la note de Synthèse (Examen)** et **30% pour le Contrôle Continu (CC)**.
    *   Si un **TP** est présent (détecté dynamiquement dans la base de données), la formule s'ajuste automatiquement : **70% Synthèse + 20% CC + 10% TP**.
*   **Statuts d'UE Dynamiques** : Chaque matière arbore un badge coloré en fonction de ses résultats : 
    *   🟢 **Validée** (Moyenne supérieure ou égale à 10/20).
    *   🔴 **Non validée** (Moyenne inférieure à 10/20).
    *   🟡 **En cours** (Si certaines notes d’examen sont encore en attente de publication).

### E. Espace Stages, Cours & Documents (`StageScreen`)
L’écran dispose d'un système de double-onglet interne permettant de segmenter les ressources :
1.  **Onglet "Stages"** :
    *   Affiche des cartes d'information synthétiques sur les démarches de stage professionnalisant.
    *   Intègre une passerelle web sécurisée via le module `Linking` de React Native, permettant de rediriger l'étudiant directement sur le portail web officiel de gestion des stages de l'IUT de Ngaoundéré (`https://etudiant.iut-ndere.net/stage/Auth`).
2.  **Onglet "Documents"** :
    *   Permet d'accéder à des sous-catégories comme les **Cours** ou les **Documents Administratifs**.
    *   Fournit les cours au format PDF, téléchargeables pour une lecture complète hors-ligne directement sur l'appareil.

### F. Profil & Sécurité (`ProfilScreen`)
*   **Fiche d'identité** : Rappel visuel fort des informations clés de l'étudiant (Avatar, matricule d'inscription, cycle, niveau d'études et filière).
*   **Sécurité des Accès** : Option dédiée pour modifier de manière sécurisée son mot de passe de connexion.
*   **Déconnexion Sécurisée** : L’action de déconnexion fait apparaître une modale de confirmation esthétique et moderne afin d'éviter les déconnexions accidentelles. Après validation, la session utilisateur est détruite et l'étudiant est redirigé en toute sécurité vers l'écran de connexion.

---

## 5. Points Forts de l'Application pour la Présentation

Lors de votre présentation de soutenance ou de projet, voici les **arguments clés (techniques et fonctionnels)** à mettre en avant :

1.  **Optimisation de l'Expérience Utilisateur (UX/UI)** : Le choix d'une charte graphique sombre (Dark Mode) haut de gamme réduit la fatigue oculaire et s'aligne sur les standards de design actuels des applications professionnelles.
2.  **Robustesse du Mode Hors-ligne** : Grâce au mécanisme de détection et de téléchargement local des PDF d'emplois du temps et de cours, l'application reste extrêmement utile même dans des zones à faible couverture réseau (très fréquent sur un campus).
3.  **Calculateur de Moyenne Intelligent** : Le moteur de calcul intégré gère l'absence ou la présence de TPs de façon dynamique, évitant ainsi à l’étudiant de devoir faire des estimations manuelles complexes.
4.  **Connexion directe au Système d'Information de l'IUT** : L'interfaçage avec le backend PHP démontre une intégration réelle et fonctionnelle avec les serveurs de l'université, faisant de cette application un outil prêt à l'emploi.
