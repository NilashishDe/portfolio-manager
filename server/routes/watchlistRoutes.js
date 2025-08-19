// server/routes/watchlistRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/watchlistController');

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.delete('/:symbol', ctrl.remove);

module.exports = router;