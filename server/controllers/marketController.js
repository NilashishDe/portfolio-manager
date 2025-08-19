// server/controllers/marketController.js
const axios = require('axios');
const cheerio = require('cheerio');
const { FMP_API_KEY } = require('../apikey');

// --- START: CACHING LOGIC ---
const cache = {};
const CACHE_DURATION = 5 * 60 * 1000; // Cache data for 5 minutes
// --- END: CACHING LOGIC ---

const getUSMarketIndices = async (req, res, next) => {
  try {
    const cacheKey = 'marketIndices';
    const now = Date.now();

    // 1. Check for valid, non-expired data in the cache
    if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
        console.log("Market Indices: Returning data from cache.");
        return res.json(cache[cacheKey].data);
    }

    console.log("Market Indices: Fetching fresh data.");
    const url = 'https://www.tradingview.com/markets/indices/quotes-us/';
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);
    let indices = [];

    $('table tbody tr').each((i, el) => {
      let rawName = $(el).find('td:nth-child(1)').text().trim();
      const value = $(el).find('td:nth-child(2)').text().trim();
      const change = $(el).find('td:nth-child(3)').text().trim();
      const changePct = $(el).find('td:nth-child(4)').text().trim();

      if (!rawName) return;
      const symbol = rawName.substring(0, 3).toUpperCase();
      const name = rawName.substring(3).trim();

      if (
        name.includes('Dow Jones Industrial Average Index') ||
        name.includes('S&P 500 Index') ||
        name.includes('NASDAQ 100 Index')
      ) {
        indices.push({ symbol, name, value, change, changePct });
      }
    });

    // 2. Store the new data and a timestamp in the cache
    cache[cacheKey] = {
        timestamp: now,
        data: indices
    };

    res.json(indices);
  } catch (err) {
    next(err);
  }
};


async function fetchCurrent(req, res, next) {
  try {
    const params = {
      marketCapLowerThan: req.query.marketCapLowerThan || '10000000000000',
      betaMoreThan: req.query.betaMoreThan || '1',
      volumeMoreThan: req.query.volumeMoreThan || '100',
      exchange: req.query.exchange || 'NYSE,NASDAQ',
      apikey: FMP_API_KEY
    };
    const url = 'https://financialmodelingprep.com/api/v3/stock-screener';
    const r = await axios.get(url, { params });
    res.json(r.data);
  } catch (err) {
    next(err);
  }
}

async function profile(req, res, next) {
  try {
    const symbol = req.params.symbol;
    const url = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(symbol)}`;
    const r = await axios.get(url, { params: { apikey: FMP_API_KEY } });
    res.json(r.data);
  } catch (err) {
    next(err);
  }
}

async function getNews(req, res, next) {
  try {
    const symbol = req.params.symbol;
    const apiKey = process.env.MARKETAUX_API_KEY;

    const url = `https://api.marketaux.com/v1/news/all?symbols=${encodeURIComponent(symbol)}&filter_entities=true&limit=5&api_token=${apiKey}`;
    
    const response = await axios.get(url);

    res.json(response.data.data); 
  } catch (err) {
    next(err);
  }
}

async function searchStocks(req, res, next) {
  try {
    const query = req.params.query;
    const url = `https://financialmodelingprep.com/api/v3/search-ticker?query=${encodeURIComponent(query)}&limit=10&exchange=NASDAQ,NYSE&apikey=${FMP_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
}

module.exports = { 
  fetchCurrent, 
  profile,
  getNews,
  getUSMarketIndices,
  searchStocks
};
