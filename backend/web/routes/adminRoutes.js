const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateJWT = require('../../middlewares/authMiddleware');
const requireRole = require('../../middlewares/roleMiddleware');
const validate = require('../../middlewares/validationMiddleware');
const upload = require('../../middlewares/uploadMiddleware');
const {
  createEtudiantSchema,
  updateEtudiantSchema,
  createProfesseurSchema,
  assignMatiereSchema,
  createNotificationSchema,
} = require('../../middlewares/validators');

// Toutes les routes admin requièrent le rôle 'admin'
router.use(authenticateJWT, requireRole('admin'));

// Statistiques dashboard
router.get('/stats', adminController.getStats);

// Gestion des étudiants
router.get('/etudiants', adminController.getEtudiants);
router.post('/etudiants', validate(createEtudiantSchema), adminController.createEtudiant);
router.put('/etudiants/:id', validate(updateEtudiantSchema), adminController.updateEtudiant);
router.patch('/etudiants/:id/toggle-status', adminController.toggleEtudiantStatus);

// Gestion des professeurs et affectations
router.get('/professeurs', adminController.getProfesseurs);
router.post('/professeurs', validate(createProfesseurSchema), adminController.createProfesseur);
router.put('/professeurs/:id', adminController.updateProfesseur);
router.get('/professeurs/:id/assignments', adminController.getProfesseurAssignments);
router.post('/assignments', validate(assignMatiereSchema), adminController.assignMatiere);
router.delete('/assignments/:id', adminController.removeAssignment);

// Annonces & Notifications
router.get('/annonces', adminController.getAnnonces);
router.post('/annonces', validate(createNotificationSchema), adminController.sendAnnonce);

// Documents & Emplois du temps
router.get('/documents', adminController.getDocuments);
router.post('/documents', upload.single('fichier'), adminController.uploadDocument);
router.delete('/documents/:id', adminController.deleteDocument);

module.exports = router;
