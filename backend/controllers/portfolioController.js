const Portfolio = require('../models/Portfolio');
const axios = require('axios');

const portfolioController = {
  // Get all portfolios for user
  getAllPortfolios: async (req, res) => {
    try {
      const portfolios = await Portfolio.find({ userId: req.userId })
        .sort({ createdAt: -1 });
      
      return res.json({
        success: true,
        count: portfolios.length,
        portfolios
      });
    } catch (error) {
      console.error('Get portfolios error:', error);
      return res.status(500).json({ error: 'Server error fetching portfolios' });
    }
  },

  // Create new portfolio
  createPortfolio: async (req, res) => {
    try {
      const { name } = req.body;
      
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Portfolio name is required' });
      }

      // Check if portfolio name already exists for this user
      const existingPortfolio = await Portfolio.findOne({
        userId: req.userId,
        name: name.trim()
      });
      
      if (existingPortfolio) {
        return res.status(400).json({ error: 'Portfolio name already exists' });
      }

      const portfolio = new Portfolio({
        name: name.trim(),
        userId: req.userId,
        stocks: [],
        totalValue: 0,
        totalInvested: 0
      });
      
      await portfolio.save();

      return res.status(201).json({
        success: true,
        message: 'Portfolio created successfully',
        portfolio
      });
    } catch (error) {
      console.error('Create portfolio error:', error);
      return res.status(500).json({ error: 'Server error creating portfolio' });
    }
  },

  // Get specific portfolio
  getPortfolio: async (req, res) => {
    try {
      const portfolio = await Portfolio.findOne({
        _id: req.params.id,
        userId: req.userId
      });
      
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      return res.json({
        success: true,
        portfolio
      });
    } catch (error) {
      console.error('Get portfolio error:', error);
      return res.status(500).json({ error: 'Server error fetching portfolio' });
    }
  },

  // Update portfolio name
  updatePortfolio: async (req, res) => {
    try {
      const { name } = req.body;
      
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Portfolio name is required' });
      }

      // Check if new name already exists for this user (excluding current portfolio)
      const existingPortfolio = await Portfolio.findOne({
        userId: req.userId,
        name: name.trim(),
        _id: { $ne: req.params.id }
      });
      
      if (existingPortfolio) {
        return res.status(400).json({ error: 'Portfolio name already exists' });
      }

      const portfolio = await Portfolio.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { name: name.trim() },
        { new: true, runValidators: true }
      );

      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      return res.json({
        success: true,
        message: 'Portfolio updated successfully',
        portfolio
      });
    } catch (error) {
      console.error('Update portfolio error:', error);
      return res.status(500).json({ error: 'Server error updating portfolio' });
    }
  },

  // Delete portfolio
  deletePortfolio: async (req, res) => {
    try {
      const portfolio = await Portfolio.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId
      });
      
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      return res.json({
        success: true,
        message: 'Portfolio deleted successfully'
      });
    } catch (error) {
      console.error('Delete portfolio error:', error);
      return res.status(500).json({ error: 'Server error deleting portfolio' });
    }
  },

  // Add stock to portfolio
  addStock: async (req, res) => {
    try {
      const { symbol, companyName, quantity, purchasePrice } = req.body;

      // Validation
      if (!symbol || !companyName || !quantity || !purchasePrice) {
        return res.status(400).json({ error: 'All stock fields are required' });
      }

      if (quantity <= 0 || purchasePrice <= 0) {
        return res.status(400).json({ error: 'Quantity and purchase price must be positive' });
      }

      const portfolio = await Portfolio.findOne({
        _id: req.params.id,
        userId: req.userId
      });
      
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      // Check if stock already exists in portfolio
      const existingStock = portfolio.stocks.find(
        stock => stock.symbol.toLowerCase() === symbol.toLowerCase()
      );

      if (existingStock) {
        // Update existing stock (add to quantity and recalculate average price)
        const newQuantity = parseInt(quantity);
        const newPrice = parseFloat(purchasePrice);
        
        const totalQuantity = existingStock.quantity + newQuantity;
        const totalValue = (existingStock.quantity * existingStock.purchasePrice) + (newQuantity * newPrice);
        const averagePrice = totalValue / totalQuantity;

        existingStock.quantity = totalQuantity;
        existingStock.purchasePrice = averagePrice;

        portfolio.totalInvested += newQuantity * newPrice;
        await portfolio.save();

        return res.json({
          success: true,
          message: 'Stock quantity updated successfully',
          portfolio
        });
      } else {
        // Add new stock
        const newStock = {
          symbol: symbol.toUpperCase(),
          companyName,
          quantity: parseInt(quantity),
          purchasePrice: parseFloat(purchasePrice),
          currentPrice: parseFloat(purchasePrice),
          purchaseDate: new Date()
        };
        
        portfolio.stocks.push(newStock);
        portfolio.totalInvested += parseInt(quantity) * parseFloat(purchasePrice);
        await portfolio.save();

        return res.status(201).json({
          success: true,
          message: 'Stock added successfully',
          portfolio
        });
      }
    } catch (error) {
      console.error('Add stock error:', error);
      return res.status(500).json({ error: 'Server error adding stock' });
    }
  },

  // Update stock in portfolio
  updateStock: async (req, res) => {
    try {
      const { quantity, purchasePrice } = req.body;

      const portfolio = await Portfolio.findOne({
        _id: req.params.id,
        userId: req.userId
      });
      
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const stock = portfolio.stocks.id(req.params.stockId);
      if (!stock) {
        return res.status(404).json({ error: 'Stock not found in portfolio' });
      }

      // Update total invested amount
      portfolio.totalInvested -= stock.quantity * stock.purchasePrice;

      if (quantity !== undefined) stock.quantity = parseInt(quantity);
      if (purchasePrice !== undefined) stock.purchasePrice = parseFloat(purchasePrice);

      portfolio.totalInvested += stock.quantity * stock.purchasePrice;
      await portfolio.save();

      return res.json({
        success: true,
        message: 'Stock updated successfully',
        portfolio
      });
    } catch (error) {
      console.error('Update stock error:', error);
      return res.status(500).json({ error: 'Server error updating stock' });
    }
  },

  // Remove stock from portfolio
  removeStock: async (req, res) => {
    try {
      const portfolio = await Portfolio.findOne({
        _id: req.params.id,
        userId: req.userId
      });
      
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const stockIndex = portfolio.stocks.findIndex(
        stock => stock._id.toString() === req.params.stockId
      );
      
      if (stockIndex === -1) {
        return res.status(404).json({ error: 'Stock not found in portfolio' });
      }

      const removedStock = portfolio.stocks[stockIndex];
      portfolio.totalInvested -= removedStock.quantity * removedStock.purchasePrice;
      portfolio.stocks.splice(stockIndex, 1);

      await portfolio.save();

      return res.json({
        success: true,
        message: 'Stock removed successfully',
        portfolio
      });
    } catch (error) {
      console.error('Remove stock error:', error);
      return res.status(500).json({ error: 'Server error removing stock' });
    }
  },

  // Update portfolio with current stock prices
  updatePortfolioPrices: async (req, res) => {
    try {
      const portfolio = await Portfolio.findOne({
        _id: req.params.id,
        userId: req.userId
      });
      
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      if (portfolio.stocks.length === 0) {
        return res.json({
          success: true,
          message: 'No stocks to update',
          portfolio
        });
      }

      // Get symbols for API call
      const symbols = portfolio.stocks.map(stock => stock.symbol).join(',');

      try {
        const response = await axios.get(
          `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${process.env.FMP_API_KEY}`
        );
        const quotes = response.data;

        let totalCurrentValue = 0;

        // Update current prices
        portfolio.stocks.forEach(stock => {
          const quote = quotes.find(q => q.symbol === stock.symbol);
          if (quote) {
            stock.currentPrice = quote.price;
          }
          totalCurrentValue += stock.quantity * stock.currentPrice;
        });

        portfolio.totalValue = totalCurrentValue;
        await portfolio.save();

        return res.json({
          success: true,
          message: 'Portfolio prices updated successfully',
          portfolio
        });
      } catch (apiError) {
        console.error('API error:', apiError);
        return res.status(500).json({ error: 'Failed to fetch current stock prices' });
      }
    } catch (error) {
      console.error('Update portfolio prices error:', error);
      return res.status(500).json({ error: 'Server error updating portfolio prices' });
    }
  }
};

module.exports = portfolioController;
