/**
 * Documentation OpenAPI / Swagger pour l'API Mon IUT
 */
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Mon IUT - API Backend Unifiée',
    version: '2.0.0',
    description:
      'API REST Express.js sécurisée pour la gestion académique et administrative de l\'IUT (Web Admin, Enseignant, Responsable Pédagogique et Application Mobile Étudiant).',
    contact: {
      name: 'Équipe Yokomi Mon IUT',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Serveur API actuel',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Fournir le token JWT sous la forme : Bearer <votre_token>',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Message descriptif de l\'erreur' },
          errors: {
            type: 'array',
            items: { type: 'string' },
            example: ['Le champ email est invalide'],
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nom: { type: 'string', example: 'Abakar' },
          prenom: { type: 'string', example: 'Oumarou' },
          identifiant: { type: 'string', example: '24GLO01IU' },
          role: {
            type: 'string',
            enum: ['admin', 'responsable', 'enseignant', 'etudiant'],
            example: 'etudiant',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['identifiant', 'password'],
        properties: {
          identifiant: { type: 'string', example: 'admin@iut.cm' },
          password: { type: 'string', example: 'admin123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          user: { $ref: '#/components/schemas/User' },
          redirectTo: { type: 'string', example: '/admin' },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/auth/login': {
      post: {
        summary: 'Connexion unifiée (Admin, Enseignant, Responsable, Étudiant)',
        tags: ['Authentification'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Connexion réussie',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          401: {
            description: 'Identifiants invalides',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        summary: 'Rafraîchir le token d\'accès JWT',
        tags: ['Authentification'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Nouveau token généré avec succès' },
          401: { description: 'Token de rafraîchissement invalide ou expiré' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Obtenir le profil de l\'utilisateur actuellement connecté',
        tags: ['Authentification'],
        responses: {
          200: { description: 'Profil utilisateur' },
          401: { description: 'Non authentifié' },
        },
      },
    },
    '/web/admin/stats': {
      get: {
        summary: 'Statistiques du tableau de bord administrateur',
        tags: ['Web - Administration'],
        responses: {
          200: { description: 'Statistiques globales' },
        },
      },
    },
    '/web/admin/etudiants': {
      get: {
        summary: 'Liste filtrée des étudiants',
        tags: ['Web - Administration'],
        parameters: [
          { name: 'cycle', in: 'query', schema: { type: 'integer' } },
          { name: 'filiere', in: 'query', schema: { type: 'integer' } },
          { name: 'parcours', in: 'query', schema: { type: 'integer' } },
          { name: 'niveau', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Liste des étudiants' } },
      },
      post: {
        summary: 'Créer un nouvel étudiant',
        tags: ['Web - Administration'],
        responses: { 201: { description: 'Étudiant créé' } },
      },
    },
    '/web/enseignant/notes': {
      post: {
        summary: 'Saisie ou mise à jour des notes d\'une matière',
        tags: ['Web - Enseignant'],
        responses: { 200: { description: 'Notes enregistrées' } },
      },
    },
    '/mobile/edt': {
      get: {
        summary: 'Récupérer l\'emploi du temps de l\'étudiant connecté',
        tags: ['Mobile - Étudiant'],
        responses: { 200: { description: 'Emploi du temps' } },
      },
    },
    '/mobile/notifications': {
      get: {
        summary: 'Récupérer les notifications de l\'étudiant connecté',
        tags: ['Mobile - Étudiant'],
        responses: { 200: { description: 'Liste des notifications' } },
      },
    },
  },
};

module.exports = swaggerDocument;
