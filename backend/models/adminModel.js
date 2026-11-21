const { query } = require('../config/db');

const adminModel = {
  findByIdentifiant: async (identifiant) => {
    const rows = await query(
      'SELECT id, nom_admin, identifiant, password FROM admins WHERE identifiant = ? LIMIT 1',
      [identifiant]
    );
    return rows[0] || null;
  },

  findById: async (id) => {
    const rows = await query(
      'SELECT id, nom_admin, identifiant FROM admins WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  updatePassword: async (id, hashedPassword) => {
    const result = await query(
      'UPDATE admins SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  },

  getStats: async () => {
    const [
      studentsCount,
      activeStudentsCount,
      teachersCount,
      docsCount,
      notifsCount,
      filieresCount,
      parcoursCount,
    ] = await Promise.all([
      query('SELECT COUNT(*) as total FROM etudiants'),
      query('SELECT COUNT(*) as total FROM etudiants WHERE est_actif = 1'),
      query('SELECT COUNT(*) as total FROM professeurs WHERE est_actif = 1'),
      query('SELECT COUNT(*) as total FROM documents'),
      query('SELECT COUNT(*) as total FROM notifications'),
      query('SELECT COUNT(*) as total FROM filieres'),
      query('SELECT COUNT(*) as total FROM parcours'),
    ]);

    return {
      totalEtudiants: studentsCount[0]?.total || 0,
      etudiantsActifs: activeStudentsCount[0]?.total || 0,
      totalProfesseurs: teachersCount[0]?.total || 0,
      totalDocuments: docsCount[0]?.total || 0,
      totalNotifications: notifsCount[0]?.total || 0,
      totalFilieres: filieresCount[0]?.total || 0,
      totalParcours: parcoursCount[0]?.total || 0,
    };
  },
};

module.exports = adminModel;
