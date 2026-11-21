const { query } = require('../config/db');

const notificationModel = {
  create: async ({
    titre,
    contenu,
    type_notif = 'INFO',
    id_exp_admin = null,
    id_exp_prof = null,
    cible_type = 'ALL',
    cible_id = null,
    niveau_cible = 'ALL',
  }) => {
    const result = await query(
      `INSERT INTO notifications (titre, contenu, type_notif, date_envoi, id_exp_admin, id_exp_prof, cible_type, cible_id, niveau_cible)
       VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)`,
      [titre, contenu, type_notif, id_exp_admin, id_exp_prof, cible_type, cible_id, niveau_cible]
    );
    return result.insertId;
  },

  addDestinataires: async (id_notification, studentIds) => {
    if (!studentIds || studentIds.length === 0) return 0;

    // Construction de requête multi-lignes pour efficacité
    const placeholders = studentIds.map(() => '(?, ?, 0)').join(', ');
    const params = [];
    studentIds.forEach((id) => {
      params.push(id_notification, id);
    });

    const result = await query(
      `INSERT INTO notification_destinataires (id_notification, id_etudiant, est_lu)
       VALUES ${placeholders}`,
      params
    );
    return result.affectedRows;
  },

  getForStudent: async (idEtudiant) => {
    return query(
      `SELECT n.id, n.titre, n.contenu, n.type_notif, n.date_envoi,
              nd.est_lu, nd.id as id_destinataire,
              COALESCE(a.nom_admin, p.nom_complet, 'Administration') as auteur
       FROM notification_destinataires nd
       JOIN notifications n ON nd.id_notification = n.id
       LEFT JOIN admins a ON n.id_exp_admin = a.id
       LEFT JOIN professeurs p ON n.id_exp_prof = p.id
       WHERE nd.id_etudiant = ?
       ORDER BY n.date_envoi DESC`,
      [idEtudiant]
    );
  },

  markAsRead: async (id_notification, id_etudiant) => {
    const result = await query(
      `UPDATE notification_destinataires SET est_lu = 1
       WHERE id_notification = ? AND id_etudiant = ?`,
      [id_notification, idEtudiant]
    );
    return result.affectedRows > 0;
  },

  getAllWithStats: async (limit = 50) => {
    return query(
      `SELECT n.id, n.titre, n.contenu, n.type_notif, n.date_envoi,
              n.cible_type, n.cible_id, n.niveau_cible,
              COALESCE(a.nom_admin, p.nom_complet, 'Administration') as expediteur,
              COUNT(nd.id) as total_destinataires,
              SUM(CASE WHEN nd.est_lu = 1 THEN 1 ELSE 0 END) as total_lus
       FROM notifications n
       LEFT JOIN admins a ON n.id_exp_admin = a.id
       LEFT JOIN professeurs p ON n.id_exp_prof = p.id
       LEFT JOIN notification_destinataires nd ON n.id = nd.id_notification
       GROUP BY n.id
       ORDER BY n.date_envoi DESC
       LIMIT ?`,
      [limit]
    );
  },
};

module.exports = notificationModel;
