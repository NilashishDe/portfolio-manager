const axios = require('axios');

// Get API key from environment variables
const API_KEY = process.env.FMP_API_KEY || process.env.STOCK_API_KEY;

// Get real-time stock quote
exports.getStockQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${API_KEY}`
    );
    return res.json(response.data[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get historical stock data
exports.getHistoricalData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1day', from, to } = req.query;
    
    let url;
    if (from && to) {
      url = `https://financialmodelingprep.com/api/v3/historical-chart/${period}/${symbol}?from=${from}&to=${to}&apikey=${API_KEY}`;
    } else {
      url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${API_KEY}`;
    }
    
    const response = await axios.get(url);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Alias for backward compatibility with routes
exports.getStockHistory = exports.getHistoricalData;

// Get company profile
exports.getCompanyProfile = async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`
    );
    return res.json(response.data[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get financial statements
exports.getFinancialStatements = async (req, res) => {
  try {
    const { symbol, type = 'income-statement' } = req.params;
    const { period = 'annual', limit = 5 } = req.query;
    
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/${type}/${symbol}?period=${period}&limit=${limit}&apikey=${API_KEY}`
    );
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Search stocks
exports.searchStocks = async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&apikey=${API_KEY}`
    );
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get multiple quotes
exports.getMultipleQuotes = async (req, res) => {
  try {
    const { symbols } = req.body;
    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ error: 'Symbols array is required' });
    }
    
    const symbolsStr = symbols.join(',');
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/quote/${symbolsStr}?apikey=${API_KEY}`
    );
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get market indices
exports.getMarketIndices = async (req, res) => {
  try {
    const indices = ['%5EGSPC', '%5EDJI', '%5EIXIC']; // S&P 500, Dow Jones, NASDAQ
    const promises = indices.map(index => 
      axios.get(`https://financialmodelingprep.com/api/v3/quote/${index}?apikey=${API_KEY}`)
    );
    
    const results = await Promise.all(promises);
    const data = results.map(result => result.data[0]);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get trending stocks
exports.getTrendingStocks = async (req, res) => {
  try {
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${API_KEY}`
    );
    return res.json(response.data.slice(0, 10));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get market gainers
exports.getMarketGainers = async (req, res) => {
  try {
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${API_KEY}`
    );
    return res.json(response.data.slice(0, 10));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get market losers
exports.getMarketLosers = async (req, res) => {
  try {
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${API_KEY}`
    );
    return res.json(response.data.slice(0, 10));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
