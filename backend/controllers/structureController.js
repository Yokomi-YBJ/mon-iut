const structureModel = require('../models/structureModel');

const structureController = {
  getFullStructure: async (req, res, next) => {
    try {
      const data = await structureModel.getFullStructure();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  getCycles: async (req, res, next) => {
    try {
      const cycles = await structureModel.getCycles();
      return res.status(200).json({ success: true, data: cycles });
    } catch (error) {
      next(error);
    }
  },

  getFilieres: async (req, res, next) => {
    try {
      const cycleId = req.query.cycle ? parseInt(req.query.cycle, 10) : null;
      const filieres = await structureModel.getFilieres(cycleId);
      return res.status(200).json({ success: true, data: filieres });
    } catch (error) {
      next(error);
    }
  },

  getParcours: async (req, res, next) => {
    try {
      const filiereId = req.query.filiere ? parseInt(req.query.filiere, 10) : null;
      const parcours = await structureModel.getParcours(filiereId);
      return res.status(200).json({ success: true, data: parcours });
    } catch (error) {
      next(error);
    }
  },

  getMatieres: async (req, res, next) => {
    try {
      const { semestre } = req.query;
      const matieres = await structureModel.getMatieres(semestre);
      return res.status(200).json({ success: true, data: matieres });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = structureController;
