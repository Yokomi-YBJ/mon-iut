/**
 * Configuration CORS avec liste blanche dynamique
 * Compatible avec :
 * - Le développement web local (localhost:5173, localhost:3000)
 * - Les déploiements Vercel (*.vercel.app)
 * - Le backend Render
 * - Les requêtes mobiles (origin: undefined ou null)
 */
const getAllowedOrigins = () => {
  const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : [];

  return [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8081',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    ...envOrigins,
  ];
};

const corsOptions = {
  origin: (origin, callback) => {
    // Les requêtes mobiles natives ou curl/Postman n'ont pas d'en-tête Origin
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = getAllowedOrigins();

    // Vérification exacte
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Autoriser les sous-domaines vercel.app en production si configuré
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Autoriser les déploiements onrender.com
    if (origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }

    return callback(new Error(`Origine CORS non autorisée : ${origin}`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Disposition'],
  maxAge: 86400, // 24 heures en cache preflight
};

module.exports = corsOptions;
