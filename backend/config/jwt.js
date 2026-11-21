const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_mon_iut_access_jwt_secret_key_123456';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_mon_iut_refresh_jwt_secret_key_654321';
const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '1h';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

/**
 * Génère un Access Token JWT
 * @param {Object} payload { id, role, identifiant, nom, prenom, ... }
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRATION,
    algorithm: 'HS256',
  });
};

/**
 * Génère un Refresh Token JWT
 * @param {Object} payload { id, role }
 */
const generateRefreshToken = (payload) => {
  return jwt.sign({ id: payload.id, role: payload.role }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION,
    algorithm: 'HS256',
  });
};

/**
 * Vérifie un Access Token
 * @param {string} token
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Vérifie un Refresh Token
 * @param {string} token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
