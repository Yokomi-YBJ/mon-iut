# Mon IUT - Documentation du Projet

## 📱 Application Mobile (Frontend)
L'application mobile **Mon IUT** est une solution multiplateforme (Android & iOS) développée avec **React Native** et **Expo**. Elle est conçue pour offrir aux étudiants de l'IUT de Ngaoundéré une expérience fluide et moderne pour gérer leur vie académique.

### 🚀 Fonctionnalités Clés
- **Authentification Sécurisée** : Accès personnalisé via matricule.
- **Emploi du Temps (Mode Hors-ligne)** : Consultation et téléchargement des plannings PDF avec mise en cache locale.
- **Suivi Académique** : Calcul automatique des moyennes pondérées (Synthèse, CC, TP) et affichage du statut des UE (Validé/Non validé).
- **Gestion des Documents** : Accès aux supports de cours et documents administratifs en téléchargement direct.
- **Notifications & Communiqués** : Réception des informations officielles de la direction en temps réel.
- **Espace Stages** : Accès direct au portail de gestion des stages.

### 🛠️ Stack Technique (Mobile)
- **Framework** : React Native (Expo SDK 54)
- **Langage** : JavaScript / TypeScript
- **Navigation** : React Navigation (Stack & Bottom Tabs)
- **Gestion d'état** : Context API
- **Stockage Local** : Expo File System (pour les PDF)

---

## ⚙️ Système Backend & Administration (API)
Le backend est une architecture **PHP** structurée qui fournit une API REST pour l'application mobile et propose une interface d'administration pour la gestion des données universitaires.

### 🚀 Fonctionnalités Clés
- **API RESTful** : Points de terminaison sécurisés pour l'authentification, la récupération des notes, des plannings et des notifications.
- **Interface d'Administration** :
    - Gestion des étudiants et des professeurs.
    - Publication de communiqués et d'annonces.
    - Gestion des documents et des emplois du temps.
- **Gestion des Fichiers** : Système de téléchargement et de stockage sécurisé des documents (PDF).

### 🛠️ Stack Technique (Backend)
- **Langage** : PHP
- **Base de données** : MySQL (via fichiers SQL fournis)
- **Architecture** : Modèle-Contrôleur (MVC simplifié)
- **Serveur Web** : Compatible avec les environnements Apache/Nginx

---

## 📝 Résumé du Projet (Non-Technique)

**Mon IUT** est un projet scolaire visant à moderniser la communication et l'accès à l'information au sein de l'**IUT de Ngaoundéré**. 

L'objectif principal est de résoudre le problème de la dispersion des informations (emplois du temps papier, notes affichées sur des tableaux, communiqués physiques) en regroupant tout dans une seule application mobile intuitive. Pour l'étudiant, cela signifie avoir son planning dans sa poche (même sans connexion internet), connaître ses moyennes instantanément et recevoir les alertes importantes directement sur son téléphone. Pour l'administration, cela permet une diffusion plus rapide et efficace des informations essentielles.
