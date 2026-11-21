const bcrypt = require('bcrypt');
const adminModel = require('../../models/adminModel');
const etudiantModel = require('../../models/etudiantModel');
const professeurModel = require('../../models/professeurModel');
const notificationModel = require('../../models/notificationModel');
const documentModel = require('../../models/documentModel');
const distributionService = require('../../services/distributionService');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;

const adminController = {
  getStats: async (req, res, next) => {
    try {
      const stats = await adminModel.getStats();
      return res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  },

  getEtudiants: async (req, res, next) => {
    try {
      const { cycle, filiere, parcours, niveau, search, actif } = req.query;
      const etudiants = await etudiantModel.findAll({
        cycle: cycle ? parseInt(cycle, 10) : null,
        filiere: filiere ? parseInt(filiere, 10) : null,
        parcours: parcours ? parseInt(parcours, 10) : null,
        niveau,
        search,
        actif: actif !== undefined ? actif === 'true' || actif === '1' : null,
      });
      return res.status(200).json({ success: true, count: etudiants.length, data: etudiants });
    } catch (error) {
      next(error);
    }
  },

  createEtudiant: async (req, res, next) => {
    try {
      const { nom, prenom, matricule, password, id_parcours, niveau, idCycle, est_actif } = req.body;

      // Vérifier si le matricule est déjà utilisé
      const existing = await etudiantModel.findByMatricule(matricule);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `Le matricule ${matricule} est déjà attribué à un autre étudiant.`,
        });
      }

      const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const studentId = await etudiantModel.create({
        nom,
        prenom,
        matricule,
        password: hashedPassword,
        id_parcours,
        niveau,
        idCycle,
        est_actif: est_actif !== undefined ? est_actif : 1,
      });

      return res.status(201).json({
        success: true,
        message: 'Étudiant créé avec succès.',
        data: { id: studentId, matricule, nom, prenom },
      });
    } catch (error) {
      next(error);
    }
  },

  updateEtudiant: async (req, res, next) => {
    try {
      const studentId = parseInt(req.params.id, 10);
      const existing = await etudiantModel.findById(studentId);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Étudiant non trouvé.' });
      }

      await etudiantModel.update(studentId, req.body);
      return res.status(200).json({
        success: true,
        message: 'Informations de l\'étudiant mises à jour.',
      });
    } catch (error) {
      next(error);
    }
  },

  toggleEtudiantStatus: async (req, res, next) => {
    try {
      const studentId = parseInt(req.params.id, 10);
      const student = await etudiantModel.findById(studentId);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Étudiant introuvable.' });
      }

      const newStatus = student.est_actif ? 0 : 1;
      await etudiantModel.update(studentId, { est_actif: newStatus });

      return res.status(200).json({
        success: true,
        message: `Statut de l'étudiant mis à jour : ${newStatus ? 'Actif' : 'Inactif'}.`,
        data: { id: studentId, est_actif: newStatus },
      });
    } catch (error) {
      next(error);
    }
  },

  getProfesseurs: async (req, res, next) => {
    try {
      const profs = await professeurModel.findAll();
      return res.status(200).json({ success: true, count: profs.length, data: profs });
    } catch (error) {
      next(error);
    }
  },

  createProfesseur: async (req, res, next) => {
    try {
      const { nom_complet, identifiant, password, niveau_responsabilite, est_actif } = req.body;

      const existing = await professeurModel.findByIdentifiant(identifiant);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `L'identifiant ${identifiant} est déjà utilisé par un autre professeur.`,
        });
      }

      const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const profId = await professeurModel.create({
        nom_complet,
        identifiant,
        password: hashedPassword,
        niveau_responsabilite,
        est_actif,
      });

      return res.status(201).json({
        success: true,
        message: 'Enseignant enregistré avec succès.',
        data: { id: profId, nom_complet, identifiant },
      });
    } catch (error) {
      next(error);
    }
  },

  updateProfesseur: async (req, res, next) => {
    try {
      const profId = parseInt(req.params.id, 10);
      const prof = await professeurModel.findById(profId);
      if (!prof) {
        return res.status(404).json({ success: false, message: 'Enseignant introuvable.' });
      }

      await professeurModel.update(profId, req.body);
      return res.status(200).json({
        success: true,
        message: 'Informations de l\'enseignant mises à jour.',
      });
    } catch (error) {
      next(error);
    }
  },

  getProfesseurAssignments: async (req, res, next) => {
    try {
      const profId = parseInt(req.params.id, 10);
      const assignments = await professeurModel.getAssignments(profId);
      return res.status(200).json({ success: true, data: assignments });
    } catch (error) {
      next(error);
    }
  },

  assignMatiere: async (req, res, next) => {
    try {
      const { id_professeur, id_matiere, niveau, id_filiere, id_parcours } = req.body;
      const assignmentId = await professeurModel.assignSubject({
        id_professeur,
        id_matiere,
        niveau,
        id_filiere,
        id_parcours,
      });

      return res.status(201).json({
        success: true,
        message: 'Matière affectée avec succès à l\'enseignant.',
        data: { id: assignmentId },
      });
    } catch (error) {
      next(error);
    }
  },

  removeAssignment: async (req, res, next) => {
    try {
      const assignmentId = parseInt(req.params.id, 10);
      await professeurModel.removeAssignment(assignmentId);
      return res.status(200).json({
        success: true,
        message: 'Affectation supprimée.',
      });
    } catch (error) {
      next(error);
    }
  },

  sendAnnonce: async (req, res, next) => {
    try {
      const { titre, contenu, type_notif, cible_type, cible_id, niveau_cible } = req.body;
      const result = await distributionService.dispatchNotification({
        titre,
        contenu,
        type_notif: type_notif || 'INFO',
        id_exp_admin: req.user.id,
        cible_type,
        cible_id,
        niveau_cible: niveau_cible || 'ALL',
      });

      return res.status(201).json({
        success: true,
        message: `Annonce envoyée avec succès à ${result.totalDestinataires} étudiant(s).`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getAnnonces: async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
      const annonces = await notificationModel.getAllWithStats(limit);
      return res.status(200).json({ success: true, data: annonces });
    } catch (error) {
      next(error);
    }
  },

  uploadDocument: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez sélectionner un fichier PDF à téléverser.',
        });
      }

      const { titre, type_doc, cible_type, cible_id, niveau_cible, id_parcours } = req.body;
      const url_fichier = `uploads/documents/${req.file.filename}`;

      const result = await distributionService.dispatchDocument({
        titre: titre || req.file.originalname,
        url_fichier,
        type_doc: type_doc || 'ADMIN',
        id_parcours: id_parcours ? parseInt(id_parcours, 10) : null,
        id_auteur_admin: req.user.id,
        cible_type: cible_type || 'ALL',
        cible_id: cible_id ? parseInt(cible_id, 10) : null,
        niveau_cible: niveau_cible || 'ALL',
      });

      return res.status(201).json({
        success: true,
        message: 'Document téléversé et diffusé avec succès.',
        data: {
          ...result,
          url_fichier,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getDocuments: async (req, res, next) => {
    try {
      const typeDoc = req.query.type || null;
      const docs = await documentModel.getAllWithStats(typeDoc);
      return res.status(200).json({ success: true, data: docs });
    } catch (error) {
      next(error);
    }
  },

  deleteDocument: async (req, res, next) => {
    try {
      const docId = parseInt(req.params.id, 10);
      await documentModel.delete(docId);
      return res.status(200).json({
        success: true,
        message: 'Document supprimé.',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
