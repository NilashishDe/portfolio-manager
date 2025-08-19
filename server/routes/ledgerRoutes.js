// server/routes/ledgerRoutes.js
const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/ledgerController');

// Route to get all ledger transactions
router.get('/', ledgerController.getAll);

module.exports = router;
