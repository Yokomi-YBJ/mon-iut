const express = require('express');
const router = express.Router();

const adminRoutes = require('./adminRoutes');
const enseignantRoutes = require('./enseignantRoutes');
const responsableRoutes = require('./responsableRoutes');

router.use('/admin', adminRoutes);
router.use('/enseignant', enseignantRoutes);
router.use('/responsable', responsableRoutes);

module.exports = router;
