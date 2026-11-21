const express = require('express');
const router = express.Router();
const mobileController = require('../controllers/mobileController');
const authenticateJWT = require('../../middlewares/authMiddleware');
const requireRole = require('../../middlewares/roleMiddleware');
const { authLimiter } = require('../../middlewares/rateLimiter');

// Connexion mobile (étudiant) protégée par rate limiting
router.post('/login', authLimiter, mobileController.login);

// Routes protégées par JWT (étudiant)
router.use(authenticateJWT, requireRole('etudiant', 'admin'));

// Emploi du temps
router.get('/edt', mobileController.getEdt);

// Documents & Supports
router.get('/docs', mobileController.getDocs);

// Notifications & Communiqués
router.get('/notifications', mobileController.getNotifications);
router.patch('/notifications/:id/read', mobileController.markNotificationRead);

// Notes & Relevé académique
router.get('/notes', mobileController.getNotes);

// Profil & Mot de passe
router.get('/profile', mobileController.getProfile);
router.post('/update-password', mobileController.updatePassword);

module.exports = router;
