// server/routes/sharesRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sharesController');

// basic CRUD
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

// buy / sell
router.post('/buy', ctrl.buy);
router.post('/sell', ctrl.sell);

module.exports = router;
