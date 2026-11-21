const authService = require('../../services/authService');
const documentModel = require('../../models/documentModel');
const notificationModel = require('../../models/notificationModel');
const noteModel = require('../../models/noteModel');
const etudiantModel = require('../../models/etudiantModel');

const mobileController = {
  login: async (req, res, next) => {
    try {
      const { matricule, password, identifiant } = req.body;
      const loginId = matricule || identifiant;

      if (!loginId || !password) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez renseigner votre matricule et mot de passe.',
        });
      }

      const result = await authService.login({ identifiant: loginId, password });

      return res.status(200).json({
        success: true,
        message: 'Connexion mobile réussie.',
        token: result.accessToken,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Matricule ou mot de passe incorrect.',
      });
    }
  },

  getEdt: async (req, res, next) => {
    try {
      const idParcours = req.user.id_parcours;
      const niveau = req.user.niveau;

      const docs = await documentModel.getTimetables({
        id_parcours: idParcours,
        niveau,
      });

      return res.status(200).json({
        success: true,
        count: docs.length,
        data: docs,
      });
    } catch (error) {
      next(error);
    }
  },

  getDocs: async (req, res, next) => {
    try {
      const idEtudiant = req.user.id;
      const idParcours = req.user.id_parcours;
      const niveau = req.user.niveau;
      const typeDoc = req.query.type || null; // 'COURS' ou 'ADMIN' ou null

      const docs = await documentModel.getForStudent({
        id_etudiant: idEtudiant,
        type_doc: typeDoc,
        id_parcours: idParcours,
        niveau,
      });

      return res.status(200).json({
        success: true,
        count: docs.length,
        data: docs,
      });
    } catch (error) {
      next(error);
    }
  },

  getNotifications: async (req, res, next) => {
    try {
      const idEtudiant = req.user.id;
      const notifs = await notificationModel.getForStudent(idEtudiant);

      return res.status(200).json({
        success: true,
        count: notifs.length,
        data: notifs,
      });
    } catch (error) {
      next(error);
    }
  },

  markNotificationRead: async (req, res, next) => {
    try {
      const idNotification = parseInt(req.params.id, 10);
      const idEtudiant = req.user.id;

      await notificationModel.markAsRead(idNotification, idEtudiant);

      return res.status(200).json({
        success: true,
        message: 'Notification marquée comme lue.',
      });
    } catch (error) {
      next(error);
    }
  },

  getNotes: async (req, res, next) => {
    try {
      const idEtudiant = req.user.id;
      const notes = await noteModel.findByEtudiant(idEtudiant);

      return res.status(200).json({
        success: true,
        count: notes.length,
        data: notes,
      });
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const idEtudiant = req.user.id;
      const profile = await etudiantModel.findById(idEtudiant);

      if (!profile) {
        return res.status(404).json({ success: false, message: 'Étudiant non trouvé.' });
      }

      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },

  updatePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const idEtudiant = req.user.id;

      await authService.changePassword({
        userId: idEtudiant,
        role: 'etudiant',
        oldPassword,
        newPassword,
      });

      return res.status(200).json({
        success: true,
        message: 'Mot de passe modifié avec succès.',
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = mobileController;
