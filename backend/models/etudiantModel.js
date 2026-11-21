const { query } = require('../config/db');

const etudiantModel = {
  findAll: async ({ cycle, filiere, parcours, niveau, search, actif } = {}) => {
    let sql = `
      SELECT e.id, e.nom, e.prenom, e.matricule, e.niveau, e.est_actif,
             e.id_parcours, p.nom_parcours,
             p.id_filiere, f.nom_filiere,
             e.idCycle, c.nomCycle
      FROM etudiants e
      LEFT JOIN parcours p ON e.id_parcours = p.id
      LEFT JOIN filieres f ON p.id_filiere = f.id_filiere
      LEFT JOIN cycle c ON e.idCycle = c.idCycle
      WHERE 1=1
    `;
    const params = [];

    if (cycle) {
      sql += ' AND e.idCycle = ?';
      params.push(cycle);
    }
    if (filiere) {
      sql += ' AND p.id_filiere = ?';
      params.push(filiere);
    }
    if (parcours) {
      sql += ' AND e.id_parcours = ?';
      params.push(parcours);
    }
    if (niveau && niveau !== 'all') {
      sql += ' AND e.niveau = ?';
      params.push(niveau);
    }
    if (actif !== undefined && actif !== null && actif !== '') {
      sql += ' AND e.est_actif = ?';
      params.push(actif ? 1 : 0);
    }
    if (search) {
      sql += ' AND (e.nom LIKE ? OR e.prenom LIKE ? OR e.matricule LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY e.nom ASC, e.prenom ASC';

    return query(sql, params);
  },

  findById: async (id) => {
    const rows = await query(
      `SELECT e.id, e.nom, e.prenom, e.matricule, e.niveau, e.est_actif,
              e.id_parcours, p.nom_parcours,
              p.id_filiere, f.nom_filiere,
              e.idCycle, c.nomCycle
       FROM etudiants e
       LEFT JOIN parcours p ON e.id_parcours = p.id
       LEFT JOIN filieres f ON p.id_filiere = f.id_filiere
       LEFT JOIN cycle c ON e.idCycle = c.idCycle
       WHERE e.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  findByMatricule: async (matricule) => {
    const rows = await query(
      `SELECT e.id, e.nom, e.prenom, e.matricule, e.password, e.niveau, e.est_actif,
              e.id_parcours, p.nom_parcours,
              p.id_filiere, f.nom_filiere,
              e.idCycle, c.nomCycle
       FROM etudiants e
       LEFT JOIN parcours p ON e.id_parcours = p.id
       LEFT JOIN filieres f ON p.id_filiere = f.id_filiere
       LEFT JOIN cycle c ON e.idCycle = c.idCycle
       WHERE e.matricule = ? LIMIT 1`,
      [matricule]
    );
    return rows[0] || null;
  },

  create: async ({ nom, prenom, matricule, password, id_parcours, niveau, idCycle, est_actif = 1 }) => {
    const result = await query(
      `INSERT INTO etudiants (nom, prenom, matricule, password, id_parcours, niveau, idCycle, est_actif)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, prenom, matricule, password, id_parcours, niveau, idCycle, est_actif]
    );
    return result.insertId;
  },

  update: async (id, { nom, prenom, matricule, id_parcours, niveau, idCycle, est_actif }) => {
    const fields = [];
    const values = [];

    if (nom !== undefined) {
      fields.push('nom = ?');
      values.push(nom);
    }
    if (prenom !== undefined) {
      fields.push('prenom = ?');
      values.push(prenom);
    }
    if (matricule !== undefined) {
      fields.push('matricule = ?');
      values.push(matricule);
    }
    if (id_parcours !== undefined) {
      fields.push('id_parcours = ?');
      values.push(id_parcours);
    }
    if (niveau !== undefined) {
      fields.push('niveau = ?');
      values.push(niveau);
    }
    if (idCycle !== undefined) {
      fields.push('idCycle = ?');
      values.push(idCycle);
    }
    if (est_actif !== undefined) {
      fields.push('est_actif = ?');
      values.push(est_actif ? 1 : 0);
    }

    if (fields.length === 0) return true;

    values.push(id);
    const result = await query(
      `UPDATE etudiants SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  updatePassword: async (id, hashedPassword) => {
    const result = await query(
      'UPDATE etudiants SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    // Désactivation logique
    const result = await query(
      'UPDATE etudiants SET est_actif = 0 WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  getStudentIdsForTarget: async ({ targetType, targetValue, niveau = 'all' }) => {
    let sql = 'SELECT e.id FROM etudiants e WHERE e.est_actif = 1';
    const params = [];

    if (targetType === 'CYCLE') {
      sql += ' AND e.idCycle = ?';
      params.push(targetValue);
    } else if (targetType === 'FILIERE') {
      sql = `SELECT e.id FROM etudiants e
             JOIN parcours p ON e.id_parcours = p.id
             WHERE p.id_filiere = ? AND e.est_actif = 1`;
      params.push(targetValue);
    } else if (targetType === 'PARCOURS') {
      sql += ' AND e.id_parcours = ?';
      params.push(targetValue);
    } else if (targetType === 'ETUDIANT') {
      // targetValue peut être un matricule ou un ID numérique
      if (typeof targetValue === 'string' && isNaN(Number(targetValue))) {
        sql += ' AND e.matricule = ?';
      } else {
        sql += ' AND e.id = ?';
      }
      params.push(targetValue);
    }

    if (niveau && niveau !== 'all' && targetType !== 'ETUDIANT') {
      sql += ' AND e.niveau = ?';
      params.push(niveau);
    }

    const rows = await query(sql, params);
    return rows.map((r) => r.id);
  },
};

module.exports = etudiantModel;
