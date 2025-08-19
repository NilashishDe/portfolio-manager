// server/routes/marketRoutes.js
const express = require('express');
const router = express.Router();
const market = require('../controllers/marketController');

router.get('/current', market.fetchCurrent);
router.get('/profile/:symbol', market.profile);

router.get('/news/:symbol', market.getNews);
router.get('/indices', market.getUSMarketIndices);
router.get('/search/:query', market.searchStocks);

module.exports = router;
