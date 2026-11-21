/**
 * Middleware d'autorisation basé sur les rôles
 * @param {string|string[]} allowedRoles Rôle(s) autorisé(s) : 'admin', 'responsable', 'enseignant', 'etudiant'
 */
const requireRole = (...allowedRoles) => {
  // Aplatit si un tableau a été passé
  const roles = allowedRoles.flat();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié.',
      });
    }

    const userRole = req.user.role;

    // L'administrateur a tous les accès transversaux
    if (userRole === 'admin' || roles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Accès interdit. Rôle requis : ${roles.join(' ou ')}. Votre rôle : ${userRole}`,
    });
  };
};

module.exports = requireRole;
