const { z } = require('zod');

const loginSchema = z.object({
  identifiant: z
    .string({ required_error: 'L\'identifiant ou matricule est requis' })
    .trim()
    .min(1, 'L\'identifiant ne peut pas être vide'),
  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(1, 'Le mot de passe ne peut pas être vide'),
});

const refreshSchema = z.object({
  refreshToken: z
    .string({ required_error: 'Le token de rafraîchissement est requis' })
    .min(1, 'Token de rafraîchissement invalide'),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'L\'ancien mot de passe est requis'),
  newPassword: z
    .string()
    .min(6, 'Le nouveau mot de passe doit comporter au moins 6 caractères'),
});

const createEtudiantSchema = z.object({
  nom: z.string().trim().min(2, 'Le nom doit comporter au moins 2 caractères'),
  prenom: z.string().trim().min(2, 'Le prénom doit comporter au moins 2 caractères'),
  matricule: z.string().trim().min(3, 'Le matricule doit comporter au moins 3 caractères'),
  password: z.string().min(4, 'Le mot de passe doit comporter au moins 4 caractères'),
  id_parcours: z.coerce.number().int().positive('Le parcours est obligatoire'),
  niveau: z.enum(['1', '2', '3'], { errorMap: () => ({ message: 'Le niveau doit être 1, 2 ou 3' }) }),
  idCycle: z.coerce.number().int().positive('Le cycle est obligatoire'),
  est_actif: z.coerce.number().optional().default(1),
});

const updateEtudiantSchema = z.object({
  nom: z.string().trim().min(2).optional(),
  prenom: z.string().trim().min(2).optional(),
  matricule: z.string().trim().min(3).optional(),
  id_parcours: z.coerce.number().int().positive().optional(),
  niveau: z.enum(['1', '2', '3']).optional(),
  idCycle: z.coerce.number().int().positive().optional(),
  est_actif: z.coerce.number().optional(),
});

const createProfesseurSchema = z.object({
  nom_complet: z.string().trim().min(3, 'Le nom complet est requis'),
  identifiant: z.string().trim().email('L\'identifiant doit être une adresse email valide'),
  password: z.string().min(4, 'Le mot de passe doit comporter au moins 4 caractères'),
  niveau_responsabilite: z.coerce.number().int().nullable().optional(),
  est_actif: z.coerce.number().optional().default(1),
});

const assignMatiereSchema = z.object({
  id_professeur: z.coerce.number().int().positive('L\'ID du professeur est requis'),
  id_matiere: z.coerce.number().int().positive('L\'ID de la matière est requis'),
  niveau: z.enum(['DUT1', 'DUT2', 'BTS1', 'BTS2', 'LICENCE']),
  id_filiere: z.coerce.number().int().nullable().optional(),
  id_parcours: z.coerce.number().int().nullable().optional(),
});

const createNotificationSchema = z.object({
  titre: z.string().trim().min(3, 'Le titre doit comporter au moins 3 caractères'),
  contenu: z.string().trim().min(5, 'Le contenu doit comporter au moins 5 caractères'),
  type_notif: z.enum(['INFO', 'ALERTE', 'ADMIN']).default('INFO'),
  cible_type: z.enum(['ALL', 'CYCLE', 'FILIERE', 'PARCOURS', 'ETUDIANT']),
  cible_id: z.coerce.number().nullable().optional(),
  niveau_cible: z.string().default('ALL'),
});

const saveNotesSchema = z.object({
  id_matiere: z.coerce.number().int().positive(),
  id_parcours: z.coerce.number().int().positive(),
  semestre: z.enum(['S1', 'S2', 'S3', 'S4', 'S5', 'S6']),
  notes: z.array(
    z.object({
      id_etudiant: z.coerce.number().int().positive(),
      note_cc: z.coerce.number().min(0).max(20).nullable().optional(),
      note_tp: z.coerce.number().min(0).max(20).nullable().optional(),
      note_synthese: z.coerce.number().min(0).max(20).nullable().optional(),
    })
  ),
});

module.exports = {
  loginSchema,
  refreshSchema,
  changePasswordSchema,
  createEtudiantSchema,
  updateEtudiantSchema,
  createProfesseurSchema,
  assignMatiereSchema,
  createNotificationSchema,
  saveNotesSchema,
};
