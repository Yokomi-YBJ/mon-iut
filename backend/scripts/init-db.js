require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const logger = require('../config/logger');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;

async function initDatabase() {
  const connection = await pool.getConnection();
  try {
    logger.info('Démarrage de l\'initialisation du schéma de la base de données...');

    // 1. Table admins
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`admins\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`nom_admin\` varchar(100) NOT NULL,
        \`identifiant\` varchar(50) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`identifiant\` (\`identifiant\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 2. Table cycle
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`cycle\` (
        \`idCycle\` int(1) NOT NULL AUTO_INCREMENT,
        \`nomCycle\` varchar(7) NOT NULL,
        PRIMARY KEY (\`idCycle\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 3. Table professeurs
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`professeurs\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`nom_complet\` varchar(100) NOT NULL,
        \`identifiant\` varchar(50) NOT NULL,
        \`niveau_responsabilite\` int(1) DEFAULT NULL,
        \`password\` varchar(255) NOT NULL,
        \`est_actif\` tinyint(1) DEFAULT 1,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`identifiant\` (\`identifiant\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 4. Table filieres
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`filieres\` (
        \`id_filiere\` int(11) NOT NULL AUTO_INCREMENT,
        \`nom_filiere\` varchar(100) NOT NULL,
        \`id_cycle\` int(11) DEFAULT NULL,
        \`id_responsable\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id_filiere\`),
        KEY \`fk_filiere_cycle\` (\`id_cycle\`),
        KEY \`fk_filiere_responsable\` (\`id_responsable\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 5. Table parcours
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`parcours\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`nom_parcours\` varchar(100) NOT NULL,
        \`id_filiere\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`id_dep\` (\`id_filiere\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 6. Table matieres
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`matieres\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`code_matiere\` varchar(20) DEFAULT NULL,
        \`nom_matiere\` varchar(100) NOT NULL,
        \`semestre\` enum('S1','S2','S3','S4','S5','S6') DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`code_matiere\` (\`code_matiere\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 7. Table affectations_matieres
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`affectations_matieres\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_matiere\` int(11) DEFAULT NULL,
        \`niveau\` enum('DUT1','DUT2','BTS1','BTS2','LICENCE') NOT NULL,
        \`id_filiere\` int(11) DEFAULT NULL,
        \`id_parcours\` int(11) DEFAULT NULL,
        \`id_professeur\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`id_matiere\` (\`id_matiere\`),
        KEY \`id_dep\` (\`id_filiere\`),
        KEY \`id_parcours\` (\`id_parcours\`),
        KEY \`fk_affectation_prof\` (\`id_professeur\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 8. Table etudiants
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`etudiants\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`nom\` varchar(100) NOT NULL,
        \`prenom\` varchar(100) NOT NULL,
        \`matricule\` varchar(50) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`id_parcours\` int(3) DEFAULT NULL,
        \`niveau\` enum('1','2','3') NOT NULL,
        \`idCycle\` int(1) NOT NULL,
        \`est_actif\` tinyint(1) DEFAULT 1,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`matricule\` (\`matricule\`),
        KEY \`id_parcours\` (\`id_parcours\`),
        KEY \`cycle\` (\`idCycle\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 9. Table documents
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`documents\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`titre\` varchar(150) DEFAULT NULL,
        \`url_fichier\` varchar(255) DEFAULT NULL,
        \`type_doc\` enum('EDT','ADMIN','COURS') NOT NULL,
        \`date_publication\` timestamp NOT NULL DEFAULT current_timestamp(),
        \`id_parcours\` int(11) DEFAULT NULL,
        \`id_auteur_admin\` int(11) DEFAULT NULL,
        \`id_auteur_prof\` int(11) DEFAULT NULL,
        \`cible_type\` enum('ALL','CYCLE','FILIERE','PARCOURS','ETUDIANT') NOT NULL DEFAULT 'ALL',
        \`cible_id\` int(11) DEFAULT NULL,
        \`niveau_cible\` varchar(10) DEFAULT 'ALL',
        PRIMARY KEY (\`id\`),
        KEY \`id_parcours\` (\`id_parcours\`),
        KEY \`id_auteur_admin\` (\`id_auteur_admin\`),
        KEY \`id_auteur_prof\` (\`id_auteur_prof\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 10. Table document_destinataires
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`document_destinataires\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_document\` int(11) NOT NULL,
        \`id_etudiant\` int(11) NOT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`fk_doc_id\` (\`id_document\`),
        KEY \`fk_doc_etu\` (\`id_etudiant\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 11. Table notifications
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`notifications\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`titre\` varchar(150) DEFAULT NULL,
        \`contenu\` text DEFAULT NULL,
        \`type_notif\` enum('INFO','ALERTE','ADMIN') DEFAULT 'INFO',
        \`date_envoi\` timestamp NOT NULL DEFAULT current_timestamp(),
        \`id_exp_admin\` int(11) DEFAULT NULL,
        \`id_exp_prof\` int(11) DEFAULT NULL,
        \`cible_type\` enum('ALL','CYCLE','FILIERE','PARCOURS','ETUDIANT') NOT NULL DEFAULT 'ALL',
        \`cible_id\` int(11) DEFAULT NULL,
        \`niveau_cible\` varchar(10) DEFAULT 'ALL',
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 12. Table notification_destinataires
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`notification_destinataires\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_notification\` int(11) DEFAULT NULL,
        \`id_etudiant\` int(11) DEFAULT NULL,
        \`est_lu\` tinyint(1) DEFAULT 0,
        PRIMARY KEY (\`id\`),
        KEY \`id_notification\` (\`id_notification\`),
        KEY \`id_etudiant\` (\`id_etudiant\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 13. Table notes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`notes\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_etudiant\` int(11) DEFAULT NULL,
        \`id_matiere\` int(11) DEFAULT NULL,
        \`note_cc\` decimal(4,2) DEFAULT NULL,
        \`note_tp\` decimal(4,2) DEFAULT NULL,
        \`note_synthese\` decimal(4,2) DEFAULT NULL,
        \`semestre\` enum('S1','S2','S3','S4','S5','S6') NOT NULL,
        \`date_saisie\` timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (\`id\`),
        KEY \`id_etudiant\` (\`id_etudiant\`),
        KEY \`id_matiere\` (\`id_matiere\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    logger.info('Schéma validé. Vérification des données initiales...');

    // Insertion des cycles de base
    const [existingCycles] = await connection.query('SELECT COUNT(*) as count FROM cycle');
    if (existingCycles[0].count === 0) {
      await connection.query(`
        INSERT INTO cycle (idCycle, nomCycle) VALUES
        (1, 'BTS'),
        (2, 'DUT'),
        (3, 'LICENCE');
      `);
      logger.info('Cycles insérés (BTS, DUT, LICENCE).');
    }

    // Insertion d'un administrateur par défaut sécurisé
    const [existingAdmin] = await connection.query('SELECT COUNT(*) as count FROM admins');
    if (existingAdmin[0].count === 0) {
      const hashedAdminPassword = await bcrypt.hash('admin123', BCRYPT_ROUNDS);
      await connection.query(`
        INSERT INTO admins (nom_admin, identifiant, password)
        VALUES ('Directeur Admin', 'admin@iut.cm', ?)
      `, [hashedAdminPassword]);
      logger.info('Administrateur par défaut créé : admin@iut.cm (mdp: admin123)');
    }

    // Insertion des filières de base si vide
    const [existingFilieres] = await connection.query('SELECT COUNT(*) as count FROM filieres');
    if (existingFilieres[0].count === 0) {
      await connection.query(`
        INSERT INTO filieres (id_filiere, nom_filiere, id_cycle, id_responsable) VALUES
        (1, 'Génie Biologique (GBIO)', 2, NULL),
        (2, 'Génie Industriel et Maintenance (GIM)', 2, NULL),
        (3, 'Génie Informatique (GIN)', 2, NULL),
        (4, 'Génie Civil et Construction Durable (GCD)', 2, NULL);
      `);
      logger.info('Filières insérées.');
    }

    // Insertion des professeurs si vide
    const [existingProfs] = await connection.query('SELECT COUNT(*) as count FROM professeurs');
    if (existingProfs[0].count === 0) {
      const defaultProfPass = await bcrypt.hash('123456', BCRYPT_ROUNDS);
      await connection.query(`
        INSERT INTO professeurs (id, nom_complet, identifiant, niveau_responsabilite, password, est_actif) VALUES
        (1, 'Dr Kani', 'kani@gmail.com', NULL, ?, 1),
        (2, 'Dr Dassi', 'dassi@gmail.com', 2, ?, 1),
        (3, 'Pr Batoure', 'batoure@gmail.com', NULL, ?, 1);
      `, [defaultProfPass, defaultProfPass, defaultProfPass]);

      // Lier Dr Dassi comme responsable de Génie Informatique (filière 3)
      await connection.query('UPDATE filieres SET id_responsable = 2 WHERE id_filiere = 3');
      logger.info('Enseignants créés (mdp: 123456). Dr Dassi assigné Responsable GIN.');
    }

    // Insertion des parcours si vide
    const [existingParcours] = await connection.query('SELECT COUNT(*) as count FROM parcours');
    if (existingParcours[0].count === 0) {
      await connection.query(`
        INSERT INTO parcours (id, nom_parcours, id_filiere) VALUES
        (1, 'Industries Alimentaires et Biotechnologiques (IAB)', 1),
        (2, 'Analyses Biologiques et Biochimiques (ABB)', 1),
        (3, 'Génie de l''Environnement (GEV)', 1),
        (4, 'Génie Industriel et Maintenance (GIM)', 2),
        (5, 'Génie Électrique (GEL)', 2),
        (6, 'Génie Mécanique et Production (GMP)', 2),
        (7, 'Génie Thermique et Énergétique (GTE)', 2),
        (8, 'Génie Logiciel (GLO)', 3),
        (9, 'Réseaux et Télécommunication (RT)', 3),
        (10, 'Intelligence Artificielle (IA)', 3),
        (11, 'Génie Civil et Construction Durable (GCD)', 4);
      `);
      logger.info('Parcours insérés.');
    }

    // Insertion des matières si vide
    const [existingMatieres] = await connection.query('SELECT COUNT(*) as count FROM matieres');
    if (existingMatieres[0].count === 0) {
      await connection.query(`
        INSERT INTO matieres (id, code_matiere, nom_matiere, semestre) VALUES
        (1, 'LAN 311', 'Anglais II ou Français II', 'S3'),
        (2, 'ECS 312', 'Éducation civique et sportive', 'S3'),
        (3, 'IFT 321', 'Infographie', 'S3'),
        (4, 'IFT 322', 'Fondamentaux du Génie Logiciel', 'S3'),
        (5, 'IFT 331', 'Théorie des graphes', 'S3'),
        (6, 'IFT 332', 'Télématique et réseaux', 'S3'),
        (7, 'IFT 341', 'Algorithmes et structures de données II', 'S3'),
        (8, 'IFT 342', 'Analyse et conception en UML', 'S3'),
        (9, 'IFT 351', 'Programmation orientée objet en C++', 'S3'),
        (10, 'IFT 353', 'Programmation avec .NET', 'S3'),
        (11, 'SPP 411', 'Stage ouvrier et Projet d''intégration', 'S4'),
        (12, 'SPP 412', 'Stage Agent de Maîtrise', 'S4'),
        (13, 'IFT 421', 'Circuits logiques', 'S4'),
        (14, 'IFT 422', 'Administration et gestion de réseaux', 'S4'),
        (15, 'IFT 431', 'Compilation', 'S4'),
        (16, 'IFT 432', 'Développement d''applications Web', 'S4'),
        (17, 'MAT 441', 'Probabilité et statistique', 'S4'),
        (18, 'IFT 442', 'Langages formels et automates', 'S4');
      `);
      logger.info('Matières insérées.');
    }

    // Insertion d'étudiants de test si vide
    const [existingEtudiants] = await connection.query('SELECT COUNT(*) as count FROM etudiants');
    if (existingEtudiants[0].count === 0) {
      const p1 = await bcrypt.hash('abakar2026', BCRYPT_ROUNDS);
      const p2 = await bcrypt.hash('konai2026', BCRYPT_ROUNDS);
      const p3 = await bcrypt.hash('talla2026', BCRYPT_ROUNDS);

      await connection.query(`
        INSERT INTO etudiants (id, nom, prenom, matricule, password, id_parcours, niveau, idCycle, est_actif) VALUES
        (1, 'Abakar', 'Oumarou', '24GLO01IU', ?, 8, '2', 2, 1),
        (2, 'Konai', 'Aline Grace', '22GLO', ?, 1, '2', 2, 1),
        (3, 'Talla', 'Fabrice', '25GLO77IU', ?, 8, '1', 2, 1);
      `, [p1, p2, p3]);
      logger.info('Étudiants insérés avec hachage bcrypt (24GLO01IU, 22GLO, 25GLO77IU).');
    }

    logger.info('Initialisation et amorçage de la base de données terminés avec succès !');
  } catch (error) {
    logger.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
