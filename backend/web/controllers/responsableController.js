const structureModel = require('../../models/structureModel');
const etudiantModel = require('../../models/etudiantModel');
const noteModel = require('../../models/noteModel');
const documentModel = require('../../models/documentModel');
const distributionService = require('../../services/distributionService');

const responsableController = {
  getFiliereOverview: async (req, res, next) => {
    try {
      const idFiliere = req.user.id_filiere;

      // Récupérer parcours de cette filière
      const parcours = await structureModel.getParcours(idFiliere);
      const parcoursIds = parcours.map((p) => p.id);

      // Récupérer les étudiants
      const etudiants = await etudiantModel.findAll({
        filiere: idFiliere,
      });

      return res.status(200).json({
        success: true,
        data: {
          id_filiere: idFiliere,
          nom_filiere: req.user.nom_filiere,
          totalParcours: parcours.length,
          parcours,
          totalEtudiants: etudiants.length,
          etudiantsActifs: etudiants.filter((e) => e.est_actif).length,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getFiliereEtudiants: async (req, res, next) => {
    try {
      const idFiliere = req.user.id_filiere;
      const { parcours, niveau, search } = req.query;

      const etudiants = await etudiantModel.findAll({
        filiere: idFiliere,
        parcours: parcours ? parseInt(parcours, 10) : null,
        niveau,
        search,
      });

      return res.status(200).json({ success: true, count: etudiants.length, data: etudiants });
    } catch (error) {
      next(error);
    }
  },

  getFiliereNotesSummary: async (req, res, next) => {
    try {
      const idFiliere = req.user.id_filiere;
      const { semestre } = req.query;

      const summary = await noteModel.getDepartmentNotesSummary(idFiliere, semestre);
      return res.status(200).json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },

  publishEDT: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez téléverser l\'emploi du temps en format PDF.',
        });
      }

      const { titre, id_parcours, niveau } = req.body;
      const url_fichier = `uploads/documents/${req.file.filename}`;

      const result = await distributionService.dispatchDocument({
        titre: titre || req.file.originalname,
        url_fichier,
        type_doc: 'EDT',
        id_parcours: id_parcours ? parseInt(id_parcours, 10) : null,
        id_auteur_prof: req.user.id,
        cible_type: id_parcours ? 'PARCOURS' : 'FILIERE',
        cible_id: id_parcours ? parseInt(id_parcours, 10) : req.user.id_filiere,
        niveau_cible: niveau || 'ALL',
      });

      return res.status(201).json({
        success: true,
        message: 'Emploi du temps publié avec succès.',
        data: { ...result, url_fichier },
      });
    } catch (error) {
      next(error);
    }
  },

  sendFiliereNotification: async (req, res, next) => {
    try {
      const { titre, contenu, id_parcours, niveau } = req.body;

      const result = await distributionService.dispatchNotification({
        titre,
        contenu,
        type_notif: 'INFO',
        id_exp_prof: req.user.id,
        cible_type: id_parcours ? 'PARCOURS' : 'FILIERE',
        cible_id: id_parcours ? parseInt(id_parcours, 10) : req.user.id_filiere,
        niveau_cible: niveau || 'ALL',
      });

      return res.status(201).json({
        success: true,
        message: `Notification pédagogique envoyée à ${result.totalDestinataires} étudiant(s).`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = responsableController;
