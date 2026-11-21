const express = require('express');
const router = express.Router();
const structureController = require('../controllers/structureController');

// Routes publiques / semi-publiques pour la sélection dans les formulaires et filtres
router.get('/', structureController.getFullStructure);
router.get('/cycles', structureController.getCycles);
router.get('/filieres', structureController.getFilieres);
router.get('/parcours', structureController.getParcours);
router.get('/matieres', structureController.getMatieres);

module.exports = router;
