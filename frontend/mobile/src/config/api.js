/**
 * Configuration statique de l'API pour l'application Mobile Mon IUT
 * Contrainte : Ne pas utiliser de variables d'environnement dans la partie mobile.
 */

// Basculer facilement entre environnement local et production
const IS_PRODUCTION = false;

// URL de base de l'API Backend Express.js
// - En local avec émulateur Android : 10.0.2.2:5000/api
// - En local sur machine / simulateur iOS : localhost:5000/api
// - En local sur appareil physique via Wi-Fi : remplacer par l'IP de votre machine (ex: 192.168.1.50:5000/api)
// - En production : URL Render
const API_BASE_URL = 'http://192.168.126.88:5000/api';
const PROD_API_HOST = 'https://mon-iut-api.onrender.com/api';

//export const API_BASE_URL = IS_PRODUCTION ? PROD_API_HOST : LOCAL_API_HOST;

export const API_ENDPOINTS = {
  // Authentification
  login: `${API_BASE_URL}/mobile/login`,
  refresh: `${API_BASE_URL}/auth/refresh`,
  me: `${API_BASE_URL}/auth/me`,

  // Ressources Étudiant
  edt: `${API_BASE_URL}/mobile/edt`,
  docs: `${API_BASE_URL}/mobile/docs`,
  notifications: `${API_BASE_URL}/mobile/notifications`,
  readNotification: (id) => `${API_BASE_URL}/mobile/notifications/${id}/read`,
  notes: `${API_BASE_URL}/mobile/notes`,
  profile: `${API_BASE_URL}/mobile/profile`,
  updatePassword: `${API_BASE_URL}/mobile/update-password`,

  // Racine pour le téléchargement de fichiers statiques
  fileBase: IS_PRODUCTION
    ? 'https://mon-iut-api.onrender.com/'
    : 'http://10.0.2.2:5000/',
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
