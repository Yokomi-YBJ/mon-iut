const rateLimit = require('express-rate-limit');

/**
 * Limiteur de débit strict pour les routes sensibles d'authentification
 * (Login, inscription, réinitialisation de mot de passe)
 */
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 15, // max 15 requêtes par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de tentatives de connexion depuis cette adresse IP. Veuillez patienter 15 minutes.',
  },
});

/**
 * Limiteur de débit général pour l'ensemble de l'API
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de requêtes effectuées sur l\'API. Veuillez ralentir.',
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};
