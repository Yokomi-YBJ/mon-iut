const professeurModel = require('../../models/professeurModel');
const noteModel = require('../../models/noteModel');
const documentModel = require('../../models/documentModel');
const distributionService = require('../../services/distributionService');

const enseignantController = {
  getMyAssignments: async (req, res, next) => {
    try {
      const profId = req.user.id;
      const assignments = await professeurModel.getAssignments(profId);
      return res.status(200).json({ success: true, data: assignments });
    } catch (error) {
      next(error);
    }
  },

  getStudentsAndNotes: async (req, res, next) => {
    try {
      const { id_matiere, id_parcours, niveau, semestre } = req.query;

      if (!id_matiere || !id_parcours) {
        return res.status(400).json({
          success: false,
          message: 'Les paramètres id_matiere et id_parcours sont obligatoires.',
        });
      }

      const list = await noteModel.findByMatiereAndParcours({
        id_matiere: parseInt(id_matiere, 10),
        id_parcours: parseInt(id_parcours, 10),
        niveau: niveau || 'all',
        semestre: semestre || null,
      });

      return res.status(200).json({ success: true, count: list.length, data: list });
    } catch (error) {
      next(error);
    }
  },

  saveNotes: async (req, res, next) => {
    try {
      const { id_matiere, semestre, notes } = req.body;

      if (!Array.isArray(notes) || notes.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'La liste des notes à enregistrer ne peut pas être vide.',
        });
      }

      const savePromises = notes.map((item) =>
        noteModel.upsertNote({
          id_etudiant: item.id_etudiant,
          id_matiere,
          note_cc: item.note_cc !== undefined ? item.note_cc : null,
          note_tp: item.note_tp !== undefined ? item.note_tp : null,
          note_synthese: item.note_synthese !== undefined ? item.note_synthese : null,
          semestre,
        })
      );

      await Promise.all(savePromises);

      return res.status(200).json({
        success: true,
        message: `${notes.length} note(s) enregistrée(s) avec succès.`,
      });
    } catch (error) {
      next(error);
    }
  },

  sendCommunique: async (req, res, next) => {
    try {
      const { titre, contenu, id_parcours, niveau } = req.body;

      const result = await distributionService.dispatchNotification({
        titre,
        contenu,
        type_notif: 'INFO',
        id_exp_prof: req.user.id,
        cible_type: id_parcours ? 'PARCOURS' : 'ALL',
        cible_id: id_parcours ? parseInt(id_parcours, 10) : null,
        niveau_cible: niveau || 'ALL',
      });

      return res.status(201).json({
        success: true,
        message: `Communiqué diffusé à ${result.totalDestinataires} étudiant(s).`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  uploadCourseDoc: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez joindre le support de cours au format PDF.',
        });
      }

      const { titre, id_parcours, niveau } = req.body;
      const url_fichier = `uploads/documents/${req.file.filename}`;

      const result = await distributionService.dispatchDocument({
        titre: titre || req.file.originalname,
        url_fichier,
        type_doc: 'COURS',
        id_parcours: id_parcours ? parseInt(id_parcours, 10) : null,
        id_auteur_prof: req.user.id,
        cible_type: id_parcours ? 'PARCOURS' : 'ALL',
        cible_id: id_parcours ? parseInt(id_parcours, 10) : null,
        niveau_cible: niveau || 'ALL',
      });

      return res.status(201).json({
        success: true,
        message: 'Support de cours publié avec succès.',
        data: { ...result, url_fichier },
      });
    } catch (error) {
      next(error);
    }
  },

  getMyDocuments: async (req, res, next) => {
    try {
      const docs = await documentModel.getAllWithStats('COURS');
      return res.status(200).json({ success: true, data: docs });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = enseignantController;
