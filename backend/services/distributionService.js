const etudiantModel = require('../models/etudiantModel');
const notificationModel = require('../models/notificationModel');
const documentModel = require('../models/documentModel');
const logger = require('../config/logger');

const distributionService = {
  /**
   * Diffuse une notification vers les étudiants cibles
   */
  dispatchNotification: async ({
    titre,
    contenu,
    type_notif = 'INFO',
    id_exp_admin = null,
    id_exp_prof = null,
    cible_type = 'ALL',
    cible_id = null,
    niveau_cible = 'ALL',
  }) => {
    // 1. Récupération des IDs d'étudiants cibles
    const studentIds = await etudiantModel.getStudentIdsForTarget({
      targetType: cible_type,
      targetValue: cible_id,
      niveau: niveau_cible,
    });

    if (studentIds.length === 0) {
      throw new Error('Aucun étudiant actif ne correspond aux critères de diffusion sélectionnés.');
    }

    // 2. Création de l'enregistrement de notification
    const notificationId = await notificationModel.create({
      titre,
      contenu,
      type_notif,
      id_exp_admin,
      id_exp_prof,
      cible_type,
      cible_id,
      niveau_cible,
    });

    // 3. Liaison avec les destinataires
    const insertedCount = await notificationModel.addDestinataires(notificationId, studentIds);
    logger.info(`Notification diffusée : ID ${notificationId} envoyée à ${insertedCount} étudiants.`);

    return {
      notificationId,
      totalDestinataires: insertedCount,
    };
  },

  /**
   * Diffuse un document vers les étudiants cibles
   */
  dispatchDocument: async ({
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
    // 1. Récupération des IDs d'étudiants cibles
    const studentIds = await etudiantModel.getStudentIdsForTarget({
      targetType: cible_type,
      targetValue: cible_id,
      niveau: niveau_cible,
    });

    // 2. Création du document
    const documentId = await documentModel.create({
      titre,
      url_fichier,
      type_doc,
      id_parcours,
      id_auteur_admin,
      id_auteur_prof,
      cible_type,
      cible_id,
      niveau_cible,
    });

    // 3. Liaison avec les destinataires si des étudiants correspondent
    let insertedCount = 0;
    if (studentIds.length > 0) {
      insertedCount = await documentModel.addDestinataires(documentId, studentIds);
    }

    logger.info(`Document publié : ID ${documentId} associé à ${insertedCount} étudiants.`);

    return {
      documentId,
      totalDestinataires: insertedCount,
    };
  },
};

module.exports = distributionService;
