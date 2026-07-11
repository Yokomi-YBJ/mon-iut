-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 23 fév. 2026 à 13:16
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mon-iut`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `nom_admin` varchar(100) NOT NULL,
  `identifiant` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `affectations_matieres`
--

CREATE TABLE `affectations_matieres` (
  `id` int(11) NOT NULL,
  `id_matiere` int(11) DEFAULT NULL,
  `niveau` enum('DUT1','DUT2','BTS1','BTS2','LICENCE') NOT NULL,
  `id_filiere` int(11) DEFAULT NULL,
  `id_parcours` int(11) DEFAULT NULL,
  `id_professeur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `affectations_matieres`
--

INSERT INTO `affectations_matieres` (`id`, `id_matiere`, `niveau`, `id_filiere`, `id_parcours`, `id_professeur`) VALUES
(1, 2, 'DUT2', NULL, 8, NULL),
(2, 3, 'DUT2', NULL, 8, NULL),
(3, 4, 'DUT2', NULL, 8, 4),
(4, 5, 'DUT2', NULL, 8, NULL),
(5, 6, 'DUT2', NULL, 8, NULL),
(6, 7, 'DUT2', NULL, 8, 1),
(7, 8, 'DUT2', NULL, 8, 3),
(8, 9, 'DUT2', NULL, 8, 3),
(9, 10, 'DUT2', NULL, 8, NULL),
(10, 13, 'DUT2', NULL, 8, NULL),
(11, 14, 'DUT2', NULL, 8, 1),
(12, 15, 'DUT2', NULL, 8, NULL),
(13, 16, 'DUT2', NULL, 8, NULL),
(14, 18, 'DUT2', NULL, 8, NULL),
(15, 1, 'DUT2', NULL, 8, NULL),
(16, 17, 'DUT2', NULL, 8, NULL),
(17, 11, 'DUT2', NULL, 8, NULL),
(18, 12, 'DUT2', NULL, 8, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `cycle`
--

CREATE TABLE `cycle` (
  `idCycle` int(1) NOT NULL,
  `nomCycle` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cycle`
--

INSERT INTO `cycle` (`idCycle`, `nomCycle`) VALUES
(1, 'BTS'),
(2, 'DUT'),
(3, 'LICENCE');

-- --------------------------------------------------------

--
-- Structure de la table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `titre` varchar(150) DEFAULT NULL,
  `url_fichier` varchar(255) DEFAULT NULL,
  `type_doc` enum('EDT','ADMIN','COURS') NOT NULL,
  `date_publication` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_parcours` int(11) DEFAULT NULL,
  `id_auteur_admin` int(11) DEFAULT NULL,
  `id_auteur_prof` int(11) DEFAULT NULL,
  `cible_type` enum('ALL','CYCLE','FILIERE','PARCOURS','ETUDIANT') NOT NULL DEFAULT 'ALL',
  `cible_id` int(11) DEFAULT NULL,
  `niveau_cible` varchar(10) DEFAULT 'ALL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `document_destinataires`
--

CREATE TABLE `document_destinataires` (
  `id` int(11) NOT NULL,
  `id_document` int(11) NOT NULL,
  `id_etudiant` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `etudiants`
--

CREATE TABLE `etudiants` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `matricule` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_parcours` int(3) DEFAULT NULL,
  `niveau` enum('1','2','3') NOT NULL,
  `idCycle` int(1) NOT NULL,
  `est_actif` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `etudiants`
--

INSERT INTO `etudiants` (`id`, `nom`, `prenom`, `matricule`, `password`, `id_parcours`, `niveau`, `idCycle`, `est_actif`) VALUES
(2, 'Abakar', 'Oumarou', '24GLO01IU', 'abakar2026', 8, '2', 2, 1),
(3, 'Konai', 'Aline Grace', '22GLO', 'konai2026', 1, '2', 2, 1),
(4, 'Talla', 'Fabrice', '25GLO77IU', 'talla2026', 8, '1', 2, 1);

-- --------------------------------------------------------

--
-- Structure de la table `filieres`
--

CREATE TABLE `filieres` (
  `id_filiere` int(11) NOT NULL,
  `nom_filiere` varchar(100) NOT NULL,
  `id_cycle` int(11) DEFAULT NULL,
  `id_responsable` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `filieres`
--

INSERT INTO `filieres` (`id_filiere`, `nom_filiere`, `id_cycle`, `id_responsable`) VALUES
(1, 'Génie Biologique (GBIO)', 2, NULL),
(2, 'Génie Industriel et Maintenance (GIM)', 2, NULL),
(3, 'Génie Informatique (GIN)', 2, 3),
(4, 'Génie Civil et Construction Durable(GCD)', 2, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `matieres`
--

CREATE TABLE `matieres` (
  `id` int(11) NOT NULL,
  `code_matiere` varchar(20) DEFAULT NULL,
  `nom_matiere` varchar(100) NOT NULL,
  `semestre` enum('S1','S2','S3','S4','S5','S6') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `matieres`
--

INSERT INTO `matieres` (`id`, `code_matiere`, `nom_matiere`, `semestre`) VALUES
(1, 'LAN 311', 'Anglais II ou Français II', 'S3'),
(2, 'ECS 312', 'Education civique et sportive', 'S3'),
(3, 'IFT 321', 'Infographie', 'S3'),
(4, 'IFT 322', 'Fondamentaux du Génie Logiciel', 'S3'),
(5, 'IFT 331', 'Théorie des graphes', 'S3'),
(6, 'IFT 332', 'Télématique et réseaux', 'S3'),
(7, 'IFT 341', 'Algorithmes et structures de données II', 'S3'),
(8, 'IFT 342', 'Analyse et conception en UML', 'S3'),
(9, 'IFT 351', 'Programmation orientée objet en C++', 'S3'),
(10, 'IFT 353', 'Programmation avec .NET', 'S3'),
(11, 'SPP 411', 'Stage ouvrier et Projet d\'intégration', 'S4'),
(12, 'SPP 412', 'Stage Agent de Maîtrise', 'S4'),
(13, 'IFT 421', 'Circuits logiques', 'S4'),
(14, 'IFT 422', 'Administration et gestion de réseaux', 'S4'),
(15, 'IFT 431', 'Compilation', 'S4'),
(16, 'IFT 432', 'Développement d\'applications Web', 'S4'),
(17, 'MAT 441', 'Probabilité et statistique', 'S4'),
(18, 'IFT 442', 'Langages formels et automates', 'S4');

-- --------------------------------------------------------

--
-- Structure de la table `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `id_etudiant` int(11) DEFAULT NULL,
  `id_matiere` int(11) DEFAULT NULL,
  `note_cc` decimal(4,2) DEFAULT NULL,
  `note_tp` decimal(4,2) DEFAULT NULL,
  `note_synthese` decimal(4,2) DEFAULT NULL,
  `semestre` enum('S1','S2','S3','S4','S5','S6') NOT NULL,
  `date_saisie` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `titre` varchar(150) DEFAULT NULL,
  `contenu` text DEFAULT NULL,
  `type_notif` enum('INFO','ALERTE','ADMIN') DEFAULT NULL,
  `date_envoi` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_exp_admin` int(11) DEFAULT NULL,
  `id_exp_prof` int(11) DEFAULT NULL,
  `cible_type` enum('ALL','CYCLE','FILIERE','PARCOURS','ETUDIANT') NOT NULL DEFAULT 'ALL',
  `cible_id` int(11) DEFAULT NULL,
  `niveau_cible` varchar(10) DEFAULT 'ALL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `titre`, `contenu`, `type_notif`, `date_envoi`, `id_exp_admin`, `id_exp_prof`, `cible_type`, `cible_id`, `niveau_cible`) VALUES
(1, 'payer', 'urgement', 'INFO', '2026-02-11 14:08:12', NULL, NULL, 'PARCOURS', 8, 'ALL'),
(2, 'okay', 'bien', 'INFO', '2026-02-23 10:00:15', 1, NULL, 'ALL', NULL, 'ALL'),
(3, 'okay', 'bien', 'INFO', '2026-02-23 10:00:15', 1, NULL, 'ALL', NULL, 'ALL'),
(4, 'Bon', 'ahG', 'INFO', '2026-02-23 10:45:55', NULL, NULL, 'PARCOURS', 8, 'all');

-- --------------------------------------------------------

--
-- Structure de la table `notification_destinataires`
--

CREATE TABLE `notification_destinataires` (
  `id` int(11) NOT NULL,
  `id_notification` int(11) DEFAULT NULL,
  `id_etudiant` int(11) DEFAULT NULL,
  `est_lu` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notification_destinataires`
--

INSERT INTO `notification_destinataires` (`id`, `id_notification`, `id_etudiant`, `est_lu`) VALUES
(2, 2, 2, 0),
(3, 2, 3, 0),
(4, 2, 4, 0),
(6, 3, 2, 0),
(7, 3, 3, 0),
(8, 3, 4, 0),
(10, 4, 2, 0),
(11, 4, 4, 0);

-- --------------------------------------------------------

--
-- Structure de la table `parcours`
--

CREATE TABLE `parcours` (
  `id` int(11) NOT NULL,
  `nom_parcours` varchar(100) NOT NULL,
  `id_filiere` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `parcours`
--

INSERT INTO `parcours` (`id`, `nom_parcours`, `id_filiere`) VALUES
(1, 'Industries Alimentaires et Biotechnologiques (IAB)', 1),
(2, 'Analyses Biologiques et Biochimiques (ABB)', 1),
(3, 'Génie de l\'Environnement (GEV)', 1),
(4, 'Génie Industriel et Maintenance (GIM)', 2),
(5, 'Génie Électrique (GEL)', 2),
(6, 'Génie MÉcannique et Production (GMP)', 2),
(7, 'Génie Thermique et Énergétique (GEL)', 2),
(8, 'Génie Logiciel (GLO)', 3),
(9, 'Réseaux et Télecommunication (RT)', 3),
(10, 'Intelligence Artificielle (IA)', 3),
(11, 'Génie Civil et Construction Durable(GCD)', 4);

-- --------------------------------------------------------

--
-- Structure de la table `professeurs`
--

CREATE TABLE `professeurs` (
  `id` int(11) NOT NULL,
  `nom_complet` varchar(100) NOT NULL,
  `identifiant` varchar(50) NOT NULL,
  `niveau_responsabilite` int(1) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `est_actif` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `professeurs`
--

INSERT INTO `professeurs` (`id`, `nom_complet`, `identifiant`, `niveau_responsabilite`, `password`, `est_actif`) VALUES
(1, 'Dr Kani', 'kani@gmail.com', NULL, '123456', 1),
(3, 'Dr Dassi', 'dassi@gmail.com', 2, '123456', 1),
(4, 'Pr Batoure', 'batoure@gmail.com', NULL, '123456', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identifiant` (`identifiant`);

--
-- Index pour la table `affectations_matieres`
--
ALTER TABLE `affectations_matieres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_matiere` (`id_matiere`),
  ADD KEY `id_dep` (`id_filiere`),
  ADD KEY `id_parcours` (`id_parcours`),
  ADD KEY `fk_affectation_prof` (`id_professeur`);

--
-- Index pour la table `cycle`
--
ALTER TABLE `cycle`
  ADD PRIMARY KEY (`idCycle`);

--
-- Index pour la table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_parcours` (`id_parcours`),
  ADD KEY `id_auteur_admin` (`id_auteur_admin`),
  ADD KEY `id_auteur_prof` (`id_auteur_prof`);

--
-- Index pour la table `document_destinataires`
--
ALTER TABLE `document_destinataires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_doc_id` (`id_document`),
  ADD KEY `fk_doc_etu` (`id_etudiant`);

--
-- Index pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricule` (`matricule`),
  ADD KEY `id_parcours` (`id_parcours`),
  ADD KEY `cycle` (`idCycle`);

--
-- Index pour la table `filieres`
--
ALTER TABLE `filieres`
  ADD PRIMARY KEY (`id_filiere`),
  ADD KEY `fk_filiere_cycle` (`id_cycle`),
  ADD KEY `fk_filiere_responsable` (`id_responsable`);

--
-- Index pour la table `matieres`
--
ALTER TABLE `matieres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_matiere` (`code_matiere`);

--
-- Index pour la table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_etudiant` (`id_etudiant`),
  ADD KEY `id_matiere` (`id_matiere`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `notification_destinataires`
--
ALTER TABLE `notification_destinataires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_notification` (`id_notification`),
  ADD KEY `id_etudiant` (`id_etudiant`);

--
-- Index pour la table `parcours`
--
ALTER TABLE `parcours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_dep` (`id_filiere`);

--
-- Index pour la table `professeurs`
--
ALTER TABLE `professeurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identifiant` (`identifiant`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `affectations_matieres`
--
ALTER TABLE `affectations_matieres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT pour la table `cycle`
--
ALTER TABLE `cycle`
  MODIFY `idCycle` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `document_destinataires`
--
ALTER TABLE `document_destinataires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `etudiants`
--
ALTER TABLE `etudiants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `filieres`
--
ALTER TABLE `filieres`
  MODIFY `id_filiere` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `matieres`
--
ALTER TABLE `matieres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `notification_destinataires`
--
ALTER TABLE `notification_destinataires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `parcours`
--
ALTER TABLE `parcours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `professeurs`
--
ALTER TABLE `professeurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `affectations_matieres`
--
ALTER TABLE `affectations_matieres`
  ADD CONSTRAINT `affectations_matieres_ibfk_1` FOREIGN KEY (`id_matiere`) REFERENCES `matieres` (`id`),
  ADD CONSTRAINT `affectations_matieres_ibfk_2` FOREIGN KEY (`id_filiere`) REFERENCES `filieres` (`id_filiere`),
  ADD CONSTRAINT `affectations_matieres_ibfk_3` FOREIGN KEY (`id_parcours`) REFERENCES `parcours` (`id`),
  ADD CONSTRAINT `fk_affectation_prof` FOREIGN KEY (`id_professeur`) REFERENCES `professeurs` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`id_parcours`) REFERENCES `parcours` (`id`),
  ADD CONSTRAINT `documents_ibfk_2` FOREIGN KEY (`id_auteur_admin`) REFERENCES `admins` (`id`),
  ADD CONSTRAINT `documents_ibfk_3` FOREIGN KEY (`id_auteur_prof`) REFERENCES `professeurs` (`id`);

--
-- Contraintes pour la table `document_destinataires`
--
ALTER TABLE `document_destinataires`
  ADD CONSTRAINT `fk_doc_etu` FOREIGN KEY (`id_etudiant`) REFERENCES `etudiants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_doc_id` FOREIGN KEY (`id_document`) REFERENCES `documents` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD CONSTRAINT `etudiants_ibfk_1` FOREIGN KEY (`id_parcours`) REFERENCES `parcours` (`id`),
  ADD CONSTRAINT `etudiants_ibfk_2` FOREIGN KEY (`idCycle`) REFERENCES `cycle` (`idCycle`);

--
-- Contraintes pour la table `filieres`
--
ALTER TABLE `filieres`
  ADD CONSTRAINT `fk_filiere_cycle` FOREIGN KEY (`id_cycle`) REFERENCES `cycle` (`idCycle`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_filiere_responsable` FOREIGN KEY (`id_responsable`) REFERENCES `professeurs` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`id_etudiant`) REFERENCES `etudiants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`id_matiere`) REFERENCES `matieres` (`id`);

--
-- Contraintes pour la table `notification_destinataires`
--
ALTER TABLE `notification_destinataires`
  ADD CONSTRAINT `notification_destinataires_ibfk_1` FOREIGN KEY (`id_notification`) REFERENCES `notifications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notification_destinataires_ibfk_2` FOREIGN KEY (`id_etudiant`) REFERENCES `etudiants` (`id`);

--
-- Contraintes pour la table `parcours`
--
ALTER TABLE `parcours`
  ADD CONSTRAINT `parcours_ibfk_1` FOREIGN KEY (`id_filiere`) REFERENCES `filieres` (`id_filiere`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
