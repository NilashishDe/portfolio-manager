const express = require('express');
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Portfolio CRUD operations
router.get('/', portfolioController.getAllPortfolios);
router.post('/', portfolioController.createPortfolio);
router.get('/:id', portfolioController.getPortfolio);
router.put('/:id', portfolioController.updatePortfolio);
router.delete('/:id', portfolioController.deletePortfolio);

// Stock operations within portfolio
router.post('/:id/stocks', portfolioController.addStock);
router.put('/:id/stocks/:stockId', portfolioController.updateStock);
router.delete('/:id/stocks/:stockId', portfolioController.removeStock);

// Portfolio price updates
router.put('/:id/update-prices', portfolioController.updatePortfolioPrices);

module.exports = router;
