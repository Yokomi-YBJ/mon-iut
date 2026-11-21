const express = require('express');
const router = express.Router();
const responsableController = require('../controllers/responsableController');
const authenticateJWT = require('../../middlewares/authMiddleware');
const requireRole = require('../../middlewares/roleMiddleware');
const upload = require('../../middlewares/uploadMiddleware');

// Accessible uniquement aux responsables pédagogiques (et admin transversal)
router.use(authenticateJWT, requireRole('responsable'));

// Vue d'ensemble du département / filière
router.get('/overview', responsableController.getFiliereOverview);

// Liste des étudiants de la filière
router.get('/etudiants', responsableController.getFiliereEtudiants);

// Synthèse et validation des notes de la filière
router.get('/notes-summary', responsableController.getFiliereNotesSummary);

// Publication des emplois du temps (EDT)
router.post('/edt', upload.single('fichier'), responsableController.publishEDT);

// Notifications et circulaires de département
router.post('/notifications', responsableController.sendFiliereNotification);

module.exports = router;
