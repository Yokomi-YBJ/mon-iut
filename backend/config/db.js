const mysql = require('mysql2/promise');
const logger = require('./logger');

/**
 * Configuration de la connexion MySQL / MariaDB / TiDB Cloud
 * - En développement : MySQL local via XAMPP ou conteneur (port 3306)
 * - En production : TiDB Cloud (port 4000 par défaut avec SSL obligatoire)
 */
const getPoolConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    };
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const useSSL = process.env.DB_SSL === 'true' || isProduction;

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || (useSSL ? 4000 : 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mon-iut',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    decimalNumbers: true,
  };

  if (useSSL) {
    config.ssl = {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED !== 'false',
    };
    if (process.env.DB_SSL_CA) {
      const fs = require('fs');
      config.ssl.ca = fs.readFileSync(process.env.DB_SSL_CA);
    }
  }

  return config;
};

const pool = mysql.createPool(getPoolConfig());

/**
 * Exécute une requête préparée avec libération automatique de connexion
 * @param {string} sql Requête SQL avec placeholders '?'
 * @param {Array} params Paramètres de la requête
 * @returns {Promise<Array>} Résultats de la requête
 */
const query = async (sql, params = []) => {
  try {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    logger.error('Erreur SQL:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sql: sql.replace(/\s+/g, ' ').trim(),
    });
    throw error;
  }
};

/**
 * Teste la connexion à la base de données
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 as connected');
    connection.release();
    logger.info('Connexion à la base de données réussie.');
    return true;
  } catch (error) {
    logger.error(`Impossible de se connecter à la base de données: ${error.message}`);
    return false;
  }
};

module.exports = {
  pool,
  query,
  testConnection,
};
