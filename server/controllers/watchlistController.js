// server/controllers/watchlistController.js
const { getCollection } = require('../db');
const axios = require('axios');
const { FMP_API_KEY } = require('../apikey');

const WATCHLIST_COLLECTION = 'watchlist';

// --- START: CACHING LOGIC ---
const cache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const combinePriceData = (stocks, priceData) => {
    const priceMap = {};
    if (priceData) {
        priceData.forEach(stock => {
            priceMap[stock.symbol] = { price: stock.price, volume: stock.volume };
        });
    }
    return stocks.map(stock => ({
        ...stock,
        price: priceMap[stock.symbol]?.price || 0,
        volume: priceMap[stock.symbol]?.volume || 0
    }));
};
// --- END: CACHING LOGIC ---

async function getAll(req, res, next) {
  try {
    const col = getCollection(WATCHLIST_COLLECTION);
    const watchlistStocks = await col.find().toArray();

    if (watchlistStocks.length === 0) {
        return res.json([]);
    }

    const symbols = watchlistStocks.map(stock => stock.symbol).sort().join(',');
    const now = Date.now();

    // 1. Check cache
    if (cache[symbols] && (now - cache[symbols].timestamp < CACHE_DURATION)) {
        console.log("Watchlist: Returning prices from cache.");
        const watchlistWithPrices = combinePriceData(watchlistStocks, cache[symbols].data);
        return res.json(watchlistWithPrices);
    }
    
    // 2. Fetch from API
    console.log("Watchlist: Fetching fresh prices from API.");
    const url = `https://financialmodelingprep.com/api/v3/quote-short/${symbols}?apikey=${FMP_API_KEY}`;
    const response = await axios.get(url);
    const priceData = response.data;

    // 3. Store in cache
    cache[symbols] = {
        timestamp: now,
        data: priceData
    };
    
    const watchlistWithPrices = combinePriceData(watchlistStocks, priceData);
    res.json(watchlistWithPrices);
  } catch (err) { next(err); }
}

// --- START: ADDED MISSING FUNCTIONS ---
// POST a new stock to the watchlist
async function create(req, res, next) {
  try {
    const payload = req.body;
    const col = getCollection(WATCHLIST_COLLECTION);

    // Prevent duplicate entries
    const existing = await col.findOne({ symbol: payload.symbol });
    if (existing) {
        return res.status(409).json({ message: 'Stock already in watchlist' });
    }

    const r = await col.insertOne({ name: payload.name, symbol: payload.symbol });
    const inserted = await col.findOne({ _id: r.insertedId });
    res.status(201).json(inserted);
  } catch (err) { next(err); }
}

// DELETE a stock from the watchlist by its symbol
async function remove(req, res, next) {
  try {
    const symbol = req.params.symbol;
    const col = getCollection(WATCHLIST_COLLECTION);
    await col.deleteOne({ symbol: symbol });
    res.json({ message: `Deleted ${symbol}` });
  } catch (err) { next(err); }
}
// --- END: ADDED MISSING FUNCTIONS ---

module.exports = { getAll, create, remove };
