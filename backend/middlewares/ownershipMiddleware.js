/**
 * Middleware vérifiant l'identité de l'appelant pour empêcher l'accès aux ressources d'autrui
 * @param {string} paramKey Clé du paramètre d'URL contenant l'ID cible (ex: 'studentId' ou 'id')
 */
const verifyOwnership = (paramKey = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié.',
      });
    }

    // Les administrateurs et responsables ont le droit de gestion
    if (req.user.role === 'admin' || req.user.role === 'responsable') {
      return next();
    }

    const targetId = parseInt(req.params[paramKey] || req.body[paramKey], 10);

    if (targetId && targetId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit. Vous ne pouvez pas accéder aux ressources d\'un autre utilisateur.',
      });
    }

    return next();
  };
};

module.exports = verifyOwnership;
