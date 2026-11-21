require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const corsOptions = require('./config/cors');
const logger = require('./config/logger');
const swaggerDocument = require('./config/swagger');
const { testConnection } = require('./config/db');

const { apiLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const structureRoutes = require('./routes/structureRoutes');
const webRoutes = require('./web/routes');
const mobileRoutes = require('./mobile/routes/mobileRoutes');

const app = express();

// ==============================================================================
// Middlewares de Sécurité & Utilitaires
// ==============================================================================

// En-têtes HTTP sécurisés avec Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Configuration CORS
app.use(cors(corsOptions));

// Parsing JSON et URL-encodé
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Journalisation HTTP avec Morgan connecté à Winston
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Fichiers statiques (documents téléversés)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Limitation de débit générale sur les routes API
app.use('/api', apiLimiter);

// ==============================================================================
// Documentation Swagger / OpenAPI
// ==============================================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ==============================================================================
// Point de contrôle de santé (Health check pour Render / monitoring)
// ==============================================================================
app.get('/health', async (req, res) => {
  const isDbConnected = await testConnection();
  return res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'UP' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ==============================================================================
// Montage des Routes Applicatives
// ==============================================================================
app.use('/api/auth', authRoutes);
app.use('/api/structure', structureRoutes);
app.use('/api/web', webRoutes);
app.use('/api/mobile', mobileRoutes);

// Route d'accueil API
app.get('/', (req, res) => {
  return res.status(200).json({
    name: 'Mon IUT API REST',
    version: '2.0.0',
    documentation: '/api-docs',
    health: '/health',
  });
});

// ==============================================================================
// Gestion des Routes Non Trouvées (404) & Erreurs Globales
// ==============================================================================
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Ressource non trouvée : ${req.method} ${req.originalUrl}`,
  });
});

// Middleware centralisé de traitement des erreurs
app.use(errorHandler);

// ==============================================================================
// Démarrage du Serveur
// ==============================================================================
// Render assigne dynamiquement la variable PORT
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    logger.info(`====================================================`);
    logger.info(`Serveur Mon IUT opérationnel sur le port ${PORT}`);
    logger.info(`Documentation Swagger disponible sur : http://localhost:${PORT}/api-docs`);
    logger.info(`Environnement : ${process.env.NODE_ENV || 'development'}`);
    logger.info(`====================================================`);
    await testConnection();
  });
}

module.exports = app;
