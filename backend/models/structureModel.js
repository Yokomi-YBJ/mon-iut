const { query } = require('../config/db');

const structureModel = {
  getCycles: async () => {
    return query('SELECT idCycle, nomCycle FROM cycle ORDER BY idCycle ASC');
  },

  getFilieres: async (cycleId = null) => {
    let sql = `
      SELECT f.id_filiere, f.nom_filiere, f.id_cycle, c.nomCycle,
             f.id_responsable, p.nom_complet as nom_responsable
      FROM filieres f
      LEFT JOIN cycle c ON f.id_cycle = c.idCycle
      LEFT JOIN professeurs p ON f.id_responsable = p.id
    `;
    const params = [];
    if (cycleId) {
      sql += ' WHERE f.id_cycle = ?';
      params.push(cycleId);
    }
    sql += ' ORDER BY f.nom_filiere ASC';
    return query(sql, params);
  },

  getParcours: async (filiereId = null) => {
    let sql = `
      SELECT p.id, p.nom_parcours, p.id_filiere, f.nom_filiere, f.id_cycle
      FROM parcours p
      LEFT JOIN filieres f ON p.id_filiere = f.id_filiere
    `;
    const params = [];
    if (filiereId) {
      sql += ' WHERE p.id_filiere = ?';
      params.push(filiereId);
    }
    sql += ' ORDER BY p.nom_parcours ASC';
    return query(sql, params);
  },

  getMatieres: async (semestre = null) => {
    let sql = 'SELECT id, code_matiere, nom_matiere, semestre FROM matieres';
    const params = [];
    if (semestre) {
      sql += ' WHERE semestre = ?';
      params.push(semestre);
    }
    sql += ' ORDER BY code_matiere ASC';
    return query(sql, params);
  },

  getFullStructure: async () => {
    const [cycles, filieres, parcours] = await Promise.all([
      query('SELECT idCycle, nomCycle FROM cycle ORDER BY idCycle ASC'),
      query('SELECT id_filiere, nom_filiere, id_cycle, id_responsable FROM filieres ORDER BY nom_filiere ASC'),
      query('SELECT id, nom_parcours, id_filiere FROM parcours ORDER BY nom_parcours ASC'),
    ]);

    const tree = cycles.map((c) => ({
      ...c,
      filieres: filieres
        .filter((f) => f.id_cycle === c.idCycle)
        .map((f) => ({
          ...f,
          parcours: parcours.filter((p) => p.id_filiere === f.id_filiere),
        })),
    }));

    return {
      tree,
      flat: {
        cycles,
        filieres,
        parcours,
      },
    };
  },
};

module.exports = structureModel;
