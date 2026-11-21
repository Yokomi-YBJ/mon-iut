const { query } = require('../config/db');

const noteModel = {
  findByEtudiant: async (idEtudiant) => {
    return query(
      `SELECT n.id, n.id_matiere, m.code_matiere, m.nom_matiere, n.semestre,
              n.note_cc, n.note_tp, n.note_synthese, n.date_saisie,
              ROUND((COALESCE(n.note_cc, 0) * 0.3 + COALESCE(n.note_tp, 0) * 0.2 + COALESCE(n.note_synthese, 0) * 0.5), 2) as moyenne
       FROM notes n
       JOIN matieres m ON n.id_matiere = m.id
       WHERE n.id_etudiant = ?
       ORDER BY n.semestre ASC, m.code_matiere ASC`,
      [idEtudiant]
    );
  },

  findByMatiereAndParcours: async ({ id_matiere, id_parcours, niveau, semestre }) => {
    let sql = `
      SELECT e.id as id_etudiant, e.matricule, e.nom, e.prenom, e.niveau,
             n.id as id_note, n.note_cc, n.note_tp, n.note_synthese, n.semestre,
             m.code_matiere, m.nom_matiere
      FROM etudiants e
      LEFT JOIN notes n ON n.id_etudiant = e.id AND n.id_matiere = ?
      LEFT JOIN matieres m ON m.id = ?
      WHERE e.id_parcours = ? AND e.est_actif = 1
    `;
    const params = [id_matiere, id_matiere, id_parcours];

    if (niveau && niveau !== 'all') {
      sql += ' AND e.niveau = ?';
      params.push(niveau);
    }
    if (semestre) {
      sql += ' AND (n.semestre = ? OR n.semestre IS NULL)';
      params.push(semestre);
    }

    sql += ' ORDER BY e.nom ASC, e.prenom ASC';
    return query(sql, params);
  },

  upsertNote: async ({ id_etudiant, id_matiere, note_cc, note_tp, note_synthese, semestre }) => {
    // Vérifier si une note existe déjà pour cet étudiant dans cette matière et semestre
    const existing = await query(
      'SELECT id FROM notes WHERE id_etudiant = ? AND id_matiere = ? AND semestre = ? LIMIT 1',
      [id_etudiant, id_matiere, semestre]
    );

    if (existing.length > 0) {
      await query(
        `UPDATE notes SET note_cc = ?, note_tp = ?, note_synthese = ?, date_saisie = NOW()
         WHERE id = ?`,
        [note_cc, note_tp, note_synthese, existing[0].id]
      );
      return existing[0].id;
    } else {
      const result = await query(
        `INSERT INTO notes (id_etudiant, id_matiere, note_cc, note_tp, note_synthese, semestre, date_saisie)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [id_etudiant, id_matiere, note_cc, note_tp, note_synthese, semestre]
      );
      return result.insertId;
    }
  },

  getDepartmentNotesSummary: async (idFiliere, semestre = null) => {
    let sql = `
      SELECT m.id as id_matiere, m.code_matiere, m.nom_matiere, n.semestre,
             COUNT(n.id) as nombre_notes,
             ROUND(AVG(COALESCE(n.note_cc, 0) * 0.3 + COALESCE(n.note_tp, 0) * 0.2 + COALESCE(n.note_synthese, 0) * 0.5), 2) as moyenne_classe,
             MIN(COALESCE(n.note_cc, 0) * 0.3 + COALESCE(n.note_tp, 0) * 0.2 + COALESCE(n.note_synthese, 0) * 0.5) as note_min,
             MAX(COALESCE(n.note_cc, 0) * 0.3 + COALESCE(n.note_tp, 0) * 0.2 + COALESCE(n.note_synthese, 0) * 0.5) as note_max
      FROM notes n
      JOIN matieres m ON n.id_matiere = m.id
      JOIN etudiants e ON n.id_etudiant = e.id
      JOIN parcours p ON e.id_parcours = p.id
      WHERE p.id_filiere = ?
    `;
    const params = [idFiliere];

    if (semestre) {
      sql += ' AND n.semestre = ?';
      params.push(semestre);
    }

    sql += ' GROUP BY m.id, m.code_matiere, m.nom_matiere, n.semestre ORDER BY m.code_matiere ASC';
    return query(sql, params);
  },
};

module.exports = noteModel;
