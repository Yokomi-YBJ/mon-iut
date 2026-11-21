const authService = require('../services/authService');
const logger = require('../config/logger');

const authController = {
  login: async (req, res, next) => {
    try {
      const { identifiant, password } = req.body;
      const result = await authService.login({ identifiant, password });

      logger.info(`Connexion réussie pour l'utilisateur: ${identifiant} (Rôle: ${result.user.role})`);

      return res.status(200).json({
        success: true,
        message: 'Connexion réussie.',
        ...result,
      });
    } catch (error) {
      logger.warn(`Échec de connexion pour ${req.body.identifiant}: ${error.message}`);
      return res.status(401).json({
        success: false,
        message: error.message || 'Identifiant ou mot de passe incorrect.',
      });
    }
  },

  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Jeton actualisé.',
        ...result,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  },

  me: async (req, res) => {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  },

  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      await authService.changePassword({
        userId: req.user.id,
        role: req.user.role,
        oldPassword,
        newPassword,
      });

      logger.info(`Mot de passe modifié pour l'utilisateur ID: ${req.user.id}`);
      return res.status(200).json({
        success: true,
        message: 'Mot de passe mis à jour avec succès.',
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  logout: async (req, res) => {
    return res.status(200).json({
      success: true,
      message: 'Déconnexion réussie.',
    });
  },
};

module.exports = authController;
