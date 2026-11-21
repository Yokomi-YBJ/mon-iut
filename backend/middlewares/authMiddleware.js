const { verifyAccessToken } = require('../config/jwt');
const logger = require('../config/logger');

/**
 * Middleware d'authentification par JWT
 * Vérifie la présence et la validité du token Bearer dans l'en-tête Authorization
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé. En-tête d\'autorisation manquant.',
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Format du jeton invalide. Format attendu : Bearer <token>',
    });
  }

  const token = parts[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, role, identifiant, nom, prenom, ... }
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Jeton d\'accès expiré.',
        code: 'TOKEN_EXPIRED',
      });
    }
    logger.warn(`Tentative d'accès avec jeton invalide: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Jeton d\'accès invalide ou corrompu.',
      code: 'TOKEN_INVALID',
    });
  }
};

module.exports = authenticateJWT;
