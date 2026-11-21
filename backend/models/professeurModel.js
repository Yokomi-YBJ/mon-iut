const { query } = require('../config/db');

const professeurModel = {
  findAll: async () => {
    return query(
      `SELECT p.id, p.nom_complet, p.identifiant, p.niveau_responsabilite, p.est_actif,
              f.id_filiere, f.nom_filiere
       FROM professeurs p
       LEFT JOIN filieres f ON f.id_responsable = p.id
       ORDER BY p.nom_complet ASC`
    );
  },

  findById: async (id) => {
    const rows = await query(
      `SELECT p.id, p.nom_complet, p.identifiant, p.niveau_responsabilite, p.est_actif,
              f.id_filiere, f.nom_filiere
       FROM professeurs p
       LEFT JOIN filieres f ON f.id_responsable = p.id
       WHERE p.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  findByIdentifiant: async (identifiant) => {
    const rows = await query(
      `SELECT p.id, p.nom_complet, p.identifiant, p.password, p.niveau_responsabilite, p.est_actif,
              f.id_filiere, f.nom_filiere
       FROM professeurs p
       LEFT JOIN filieres f ON f.id_responsable = p.id
       WHERE p.identifiant = ? LIMIT 1`,
      [identifiant]
    );
    return rows[0] || null;
  },

  create: async ({ nom_complet, identifiant, password, niveau_responsabilite = null, est_actif = 1 }) => {
    const result = await query(
      `INSERT INTO professeurs (nom_complet, identifiant, password, niveau_responsabilite, est_actif)
       VALUES (?, ?, ?, ?, ?)`,
      [nom_complet, identifiant, password, niveau_responsabilite, est_actif]
    );
    return result.insertId;
  },

  update: async (id, { nom_complet, identifiant, niveau_responsabilite, est_actif }) => {
    const fields = [];
    const values = [];

    if (nom_complet !== undefined) {
      fields.push('nom_complet = ?');
      values.push(nom_complet);
    }
    if (identifiant !== undefined) {
      fields.push('identifiant = ?');
      values.push(identifiant);
    }
    if (niveau_responsabilite !== undefined) {
      fields.push('niveau_responsabilite = ?');
      values.push(niveau_responsabilite);
    }
    if (est_actif !== undefined) {
      fields.push('est_actif = ?');
      values.push(est_actif);
    }

    if (fields.length === 0) return true;

    values.push(id);
    const result = await query(
      `UPDATE professeurs SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  updatePassword: async (id, hashedPassword) => {
    const result = await query(
      'UPDATE professeurs SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    // Désactivation logique pour préserver l'intégrité référentielle
    const result = await query(
      'UPDATE professeurs SET est_actif = 0 WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  getAssignments: async (profId) => {
    return query(
      `SELECT am.id, am.id_matiere, m.code_matiere, m.nom_matiere, m.semestre,
              am.niveau, am.id_filiere, f.nom_filiere,
              am.id_parcours, p.nom_parcours
       FROM affectations_matieres am
       JOIN matieres m ON am.id_matiere = m.id
       LEFT JOIN parcours p ON am.id_parcours = p.id
       LEFT JOIN filieres f ON am.id_filiere = f.id_filiere OR p.id_filiere = f.id_filiere
       WHERE am.id_professeur = ?
       ORDER BY m.code_matiere ASC`,
      [profId]
    );
  },

  assignSubject: async ({ id_professeur, id_matiere, niveau, id_filiere = null, id_parcours = null }) => {
    const result = await query(
      `INSERT INTO affectations_matieres (id_professeur, id_matiere, niveau, id_filiere, id_parcours)
       VALUES (?, ?, ?, ?, ?)`,
      [id_professeur, id_matiere, niveau, id_filiere, id_parcours]
    );
    return result.insertId;
  },

  removeAssignment: async (id) => {
    const result = await query(
      'DELETE FROM affectations_matieres WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = professeurModel;
