const { query } = require('../config/db');

const documentModel = {
  create: async ({
    titre,
    url_fichier,
    type_doc = 'ADMIN',
    id_parcours = null,
    id_auteur_admin = null,
    id_auteur_prof = null,
    cible_type = 'ALL',
    cible_id = null,
    niveau_cible = 'ALL',
  }) => {
    const result = await query(
      `INSERT INTO documents (titre, url_fichier, type_doc, date_publication, id_parcours, id_auteur_admin, id_auteur_prof, cible_type, cible_id, niveau_cible)
       VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)`,
      [
        titre,
        url_fichier,
        type_doc,
        id_parcours,
        id_auteur_admin,
        id_auteur_prof,
        cible_type,
        cible_id,
        niveau_cible,
      ]
    );
    return result.insertId;
  },

  addDestinataires: async (id_document, studentIds) => {
    if (!studentIds || studentIds.length === 0) return 0;

    const placeholders = studentIds.map(() => '(?, ?)').join(', ');
    const params = [];
    studentIds.forEach((id) => {
      params.push(id_document, id);
    });

    const result = await query(
      `INSERT INTO document_destinataires (id_document, id_etudiant)
       VALUES ${placeholders}`,
      params
    );
    return result.affectedRows;
  },

  getForStudent: async ({ id_etudiant, type_doc = null, id_parcours = null, niveau = null }) => {
    let sql = `
      SELECT DISTINCT d.id, d.titre, d.url_fichier, d.type_doc, d.date_publication,
             d.cible_type, d.cible_id, d.niveau_cible,
             COALESCE(a.nom_admin, p.nom_complet, 'Administration') as auteur
      FROM documents d
      LEFT JOIN document_destinataires dd ON dd.id_document = d.id AND dd.id_etudiant = ?
      LEFT JOIN admins a ON d.id_auteur_admin = a.id
      LEFT JOIN professeurs p ON d.id_auteur_prof = p.id
      WHERE (
        dd.id_etudiant = ?
        OR d.cible_type = 'ALL'
        OR (d.cible_type = 'PARCOURS' AND d.cible_id = ?)
      )
    `;
    const params = [id_etudiant, id_etudiant, id_parcours];

    if (type_doc) {
      sql += ' AND d.type_doc = ?';
      params.push(type_doc);
    }
    if (niveau && niveau !== 'all') {
      sql += ' AND (d.niveau_cible = ? OR d.niveau_cible = "ALL" OR d.niveau_cible = "all")';
      params.push(niveau);
    }

    sql += ' ORDER BY d.date_publication DESC';
    return query(sql, params);
  },

  getTimetables: async ({ id_parcours, niveau }) => {
    let sql = `
      SELECT d.id, d.titre, d.url_fichier, d.date_publication,
             d.cible_type, d.cible_id, d.niveau_cible,
             COALESCE(a.nom_admin, p.nom_complet, 'Administration') as auteur
      FROM documents d
      LEFT JOIN admins a ON d.id_auteur_admin = a.id
      LEFT JOIN professeurs p ON d.id_auteur_prof = p.id
      WHERE d.type_doc = 'EDT'
        AND (
          d.cible_type = 'ALL'
          OR (d.cible_type = 'PARCOURS' AND d.cible_id = ?)
        )
    `;
    const params = [id_parcours];

    if (niveau && niveau !== 'all') {
      sql += ' AND (d.niveau_cible = ? OR d.niveau_cible = "ALL" OR d.niveau_cible = "all")';
      params.push(niveau);
    }

    sql += ' ORDER BY d.date_publication DESC';
    return query(sql, params);
  },

  getAllWithStats: async (typeDoc = null, limit = 50) => {
    let sql = `
      SELECT d.id, d.titre, d.url_fichier, d.type_doc, d.date_publication,
             d.cible_type, d.cible_id, d.niveau_cible,
             COALESCE(a.nom_admin, p.nom_complet, 'Administration') as auteur,
             COUNT(dd.id) as total_destinataires
      FROM documents d
      LEFT JOIN admins a ON d.id_auteur_admin = a.id
      LEFT JOIN professeurs p ON d.id_auteur_prof = p.id
      LEFT JOIN document_destinataires dd ON d.id = dd.id_document
    `;
    const params = [];

    if (typeDoc) {
      sql += ' WHERE d.type_doc = ?';
      params.push(typeDoc);
    }

    sql += ' GROUP BY d.id ORDER BY d.date_publication DESC LIMIT ?';
    params.push(limit);

    return query(sql, params);
  },

  delete: async (id) => {
    const result = await query('DELETE FROM documents WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = documentModel;
