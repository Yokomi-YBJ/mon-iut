const logger = require('../config/logger');

/**
 * Middleware centralisé de gestion des erreurs
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error('Erreur non interceptée dans l\'application:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user ? req.user.id : null,
  });

  // Gestion des erreurs Multer (taille de fichier, etc.)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Le fichier dépasse la taille maximale autorisée (15 Mo).',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Erreur d'envoi de fichier: ${err.message}`,
    });
  }

  // Erreur de validation de format de fichier (Multer custom filter)
  if (err.message && err.message.includes('PDF')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Erreur CORS
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  // Code HTTP par défaut
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  return res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500
      ? 'Une erreur interne est survenue sur le serveur.'
      : err.message || 'Erreur interne du serveur.',
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;
