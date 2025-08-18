const express = require('express');
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Stock search and quotes
router.get('/search', stockController.searchStocks);
router.get('/quote/:symbol', stockController.getStockQuote);
router.post('/quotes', stockController.getMultipleQuotes);

// Stock historical data and profile
router.get('/history/:symbol', stockController.getStockHistory);
router.get('/historical/:symbol', stockController.getHistoricalData);
router.get('/profile/:symbol', stockController.getCompanyProfile);

// Market data
router.get('/trending', stockController.getTrendingStocks);
router.get('/gainers', stockController.getMarketGainers);
router.get('/losers', stockController.getMarketLosers);
router.get('/indices', stockController.getMarketIndices);

module.exports = router;
