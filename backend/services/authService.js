const bcrypt = require('bcrypt');
const adminModel = require('../models/adminModel');
const professeurModel = require('../models/professeurModel');
const etudiantModel = require('../models/etudiantModel');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../config/jwt');
const logger = require('../config/logger');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;

/**
 * Compare un mot de passe en clair avec un hash bcrypt,
 * avec prise en charge de la migration automatique des anciens mots de passe en clair.
 */
const compareAndMigratePassword = async (plainPassword, storedPassword, updateFn) => {
  // Si le mot de passe est déjà un hash bcrypt (commence par $2a$, $2b$, $2y$)
  if (storedPassword.startsWith('$2')) {
    return bcrypt.compare(plainPassword, storedPassword);
  }

  // Si c'est un ancien mot de passe non haché de la base d'origine
  if (plainPassword === storedPassword) {
    // Migration transparente vers bcrypt
    try {
      const newHash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
      await updateFn(newHash);
      logger.info('Migration de sécurité automatique : mot de passe converti en hash bcrypt.');
    } catch (err) {
      logger.error(`Erreur lors de la migration du mot de passe: ${err.message}`);
    }
    return true;
  }

  return false;
};

const authService = {
  /**
   * Connexion unifiée pour tous les types d'utilisateurs
   */
  login: async ({ identifiant, password }) => {
    // 1. Vérifier si l'utilisateur est un administrateur
    const admin = await adminModel.findByIdentifiant(identifiant);
    if (admin) {
      const isMatch = await compareAndMigratePassword(
        password,
        admin.password,
        (newHash) => adminModel.updatePassword(admin.id, newHash)
      );

      if (isMatch) {
        const payload = {
          id: admin.id,
          nom: admin.nom_admin,
          prenom: '',
          identifiant: admin.identifiant,
          role: 'admin',
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {
          user: payload,
          accessToken,
          refreshToken,
          redirectTo: '/admin',
        };
      }
    }

    // 2. Vérifier si l'utilisateur est un professeur ou responsable pédagogique
    const prof = await professeurModel.findByIdentifiant(identifiant);
    if (prof) {
      if (!prof.est_actif) {
        throw new Error('Votre compte enseignant est désactivé. Veuillez contacter l\'administration.');
      }

      const isMatch = await compareAndMigratePassword(
        password,
        prof.password,
        (newHash) => professeurModel.updatePassword(prof.id, newHash)
      );

      if (isMatch) {
        const isResponsable = prof.niveau_responsabilite !== null && prof.niveau_responsabilite !== undefined;
        const role = isResponsable ? 'responsable' : 'enseignant';

        const payload = {
          id: prof.id,
          nom: prof.nom_complet,
          prenom: '',
          identifiant: prof.identifiant,
          role,
          id_filiere: prof.id_filiere || null,
          nom_filiere: prof.nom_filiere || null,
          niveau_responsabilite: prof.niveau_responsabilite,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {
          user: payload,
          accessToken,
          refreshToken,
          redirectTo: isResponsable ? '/responsable' : '/enseignant',
        };
      }
    }

    // 3. Vérifier si l'utilisateur est un étudiant (par matricule)
    const etudiant = await etudiantModel.findByMatricule(identifiant);
    if (etudiant) {
      if (!etudiant.est_actif) {
        throw new Error('Votre compte étudiant est inactif. Veuillez contacter le secrétariat.');
      }

      const isMatch = await compareAndMigratePassword(
        password,
        etudiant.password,
        (newHash) => etudiantModel.updatePassword(etudiant.id, newHash)
      );

      if (isMatch) {
        const payload = {
          id: etudiant.id,
          nom: etudiant.nom,
          prenom: etudiant.prenom,
          matricule: etudiant.matricule,
          identifiant: etudiant.matricule,
          role: 'etudiant',
          id_parcours: etudiant.id_parcours,
          nom_parcours: etudiant.nom_parcours,
          id_filiere: etudiant.id_filiere,
          nom_filiere: etudiant.nom_filiere,
          niveau: etudiant.niveau,
          idCycle: etudiant.idCycle,
          nomCycle: etudiant.nomCycle,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {
          user: payload,
          accessToken,
          refreshToken,
          redirectTo: '/mobile',
        };
      }
    }

    throw new Error('Identifiant ou mot de passe incorrect.');
  },

  /**
   * Rafraîchissement d'un token d'accès expiré
   */
  refreshToken: async (token) => {
    try {
      const decoded = verifyRefreshToken(token);
      let user = null;

      if (decoded.role === 'admin') {
        user = await adminModel.findById(decoded.id);
        if (user) user.role = 'admin';
      } else if (decoded.role === 'responsable' || decoded.role === 'enseignant') {
        const prof = await professeurModel.findById(decoded.id);
        if (prof && prof.est_actif) {
          const isResponsable = prof.niveau_responsabilite !== null;
          user = {
            id: prof.id,
            nom: prof.nom_complet,
            prenom: '',
            identifiant: prof.identifiant,
            role: isResponsable ? 'responsable' : 'enseignant',
            id_filiere: prof.id_filiere,
            nom_filiere: prof.nom_filiere,
          };
        }
      } else if (decoded.role === 'etudiant') {
        const etu = await etudiantModel.findById(decoded.id);
        if (etu && etu.est_actif) {
          user = {
            id: etu.id,
            nom: etu.nom,
            prenom: etu.prenom,
            matricule: etu.matricule,
            identifiant: etu.matricule,
            role: 'etudiant',
            id_parcours: etu.id_parcours,
            nom_parcours: etu.nom_parcours,
            id_filiere: etu.id_filiere,
            nom_filiere: etu.nom_filiere,
            niveau: etu.niveau,
            idCycle: etu.idCycle,
            nomCycle: etu.nomCycle,
          };
        }
      }

      if (!user) {
        throw new Error('Utilisateur non trouvé ou compte inactif.');
      }

      const newAccessToken = generateAccessToken(user);
      return {
        accessToken: newAccessToken,
        user,
      };
    } catch (err) {
      throw new Error('Token de rafraîchissement invalide ou expiré.');
    }
  },

  /**
   * Modification sécurisée du mot de passe
   */
  changePassword: async ({ userId, role, oldPassword, newPassword }) => {
    let currentStoredPassword = null;
    let updateFn = null;

    if (role === 'admin') {
      const admin = await adminModel.findByIdentifiant((await adminModel.findById(userId))?.identifiant);
      if (admin) {
        currentStoredPassword = admin.password;
        updateFn = (hash) => adminModel.updatePassword(userId, hash);
      }
    } else if (role === 'enseignant' || role === 'responsable') {
      const prof = await professeurModel.findByIdentifiant((await professeurModel.findById(userId))?.identifiant);
      if (prof) {
        currentStoredPassword = prof.password;
        updateFn = (hash) => professeurModel.updatePassword(userId, hash);
      }
    } else if (role === 'etudiant') {
      const etu = await etudiantModel.findByMatricule((await etudiantModel.findById(userId))?.matricule);
      if (etu) {
        currentStoredPassword = etu.password;
        updateFn = (hash) => etudiantModel.updatePassword(userId, hash);
      }
    }

    if (!currentStoredPassword || !updateFn) {
      throw new Error('Utilisateur non trouvé.');
    }

    const isMatch = await compareAndMigratePassword(oldPassword, currentStoredPassword, updateFn);
    if (!isMatch) {
      throw new Error('L\'ancien mot de passe est incorrect.');
    }

    const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await updateFn(newHash);
    return true;
  },
};

module.exports = authService;
