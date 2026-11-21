const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateJWT = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');
const {
  loginSchema,
  refreshSchema,
  changePasswordSchema,
} = require('../middlewares/validators');

// Connexion unifiée avec protection contre le bruteforce
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// Rafraîchissement de token
router.post('/refresh', validate(refreshSchema), authController.refresh);

// Déconnexion
router.post('/logout', authController.logout);

// Profil de l'utilisateur connecté
router.get('/me', authenticateJWT, authController.me);

// Changement de mot de passe
router.post(
  '/change-password',
  authenticateJWT,
  validate(changePasswordSchema),
  authController.changePassword
);

module.exports = router;
