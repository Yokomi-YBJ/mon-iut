const express = require('express');
const router = express.Router();
const enseignantController = require('../controllers/enseignantController');
const authenticateJWT = require('../../middlewares/authMiddleware');
const requireRole = require('../../middlewares/roleMiddleware');
const validate = require('../../middlewares/validationMiddleware');
const upload = require('../../middlewares/uploadMiddleware');
const { saveNotesSchema } = require('../../middlewares/validators');

// Routes accessibles aux enseignants et aux responsables
router.use(authenticateJWT, requireRole('enseignant', 'responsable'));

// Matières affectées à l'enseignant
router.get('/assignments', enseignantController.getMyAssignments);

// Saisie et consultation des notes
router.get('/notes', enseignantController.getStudentsAndNotes);
router.post('/notes', validate(saveNotesSchema), enseignantController.saveNotes);

// Communiqués vers les classes de l'enseignant
router.post('/communiques', enseignantController.sendCommunique);

// Supports de cours
router.get('/documents', enseignantController.getMyDocuments);
router.post('/documents', upload.single('fichier'), enseignantController.uploadCourseDoc);

module.exports = router;
