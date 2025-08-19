// server/controllers/sharesController.js
const { getCollection } = require('../db');
const { normalizeSymbol, toObjectId, validateBuyPayload } = require('../models/shareModel');
const axios = require('axios');
const { FMP_API_KEY } = require('../apikey');

const SHARES_COLLECTION = 'shares';
const LEDGER_COLLECTION = 'ledger';

// --- START: CACHING LOGIC ---
const cache = {};
const CACHE_DURATION = 5 * 60 * 1000; // Cache data for 5 minutes

// Helper to combine DB data with price data
const combinePriceData = (shares, priceData) => {
    const priceMap = {};
    if (priceData) {
        priceData.forEach(stock => {
            priceMap[stock.symbol] = stock.price;
        });
    }
    return shares.map(share => ({
        ...share,
        currentPrice: priceMap[share.symbol] || 0
    }));
};
// --- END: CACHING LOGIC ---

async function getAll(req, res, next) {
  try {
    const col = getCollection(SHARES_COLLECTION);
    const heldShares = await col.find().toArray();

    if (heldShares.length === 0) {
        return res.json([]);
    }

    const symbols = heldShares.map(share => share.symbol).sort().join(',');
    const now = Date.now();

    // 1. Check for valid, non-expired data in the cache
    if (cache[symbols] && (now - cache[symbols].timestamp < CACHE_DURATION)) {
        console.log("Shares: Returning prices from cache.");
        const sharesWithPrice = combinePriceData(heldShares, cache[symbols].data);
        return res.json(sharesWithPrice);
    }

    // 2. If not in cache, fetch from the API
    console.log("Shares: Fetching fresh prices from API.");
    const url = `https://financialmodelingprep.com/api/v3/quote-short/${symbols}?apikey=${FMP_API_KEY}`;
    const response = await axios.get(url);
    const priceData = response.data;

    // 3. Store the new data and a timestamp in the cache
    cache[symbols] = {
        timestamp: now,
        data: priceData
    };

    const sharesWithPrice = combinePriceData(heldShares, priceData);
    res.json(sharesWithPrice);
  } catch (err) { next(err); }
}

// Helper function to log transactions
const logTransaction = async (transaction) => {
    const ledgerCollection = getCollection(LEDGER_COLLECTION);
    await ledgerCollection.insertOne(transaction);
};

async function getAll(req, res, next) {
  try {
    const col = getCollection(SHARES_COLLECTION);
    const heldShares = await col.find().toArray();

    if (heldShares.length === 0) {
        return res.json([]);
    }

    const symbols = heldShares.map(share => share.symbol).join(',');
    const url = `https://financialmodelingprep.com/api/v3/quote-short/${symbols}?apikey=${FMP_API_KEY}`;
    const response = await axios.get(url);
    const priceData = response.data;

    const priceMap = {};
    if (priceData) {
        priceData.forEach(stock => {
            priceMap[stock.symbol] = stock.price;
        });
    }

    const sharesWithPrice = heldShares.map(share => ({
        ...share,
        currentPrice: priceMap[share.symbol] || 0
    }));

    res.json(sharesWithPrice);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const col = getCollection(SHARES_COLLECTION);
    const doc = await col.findOne({ _id: id });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const payload = req.body;
    const symbol = normalizeSymbol(payload.symbol || payload.name);
    const col = getCollection(SHARES_COLLECTION);
    
    const existing = await col.findOne({ symbol: symbol });

    let finalHolding;
    const purchasePrice = Number(payload.avgPurchasePrice || payload.purchasePrice || 0);

    const newShareData = {
        name: payload.name,
        symbol: symbol,
        purchaseDate: payload.purchaseDate,
        numberOfShares: Number(payload.numberOfShares),
        avgPurchasePrice: purchasePrice
    };

    if (existing) {
      const oldQty = Number(existing.numberOfShares || 0);
      const oldAvg = Number(existing.avgPurchasePrice || 0);
      const newQty = newShareData.numberOfShares;
      
      const totalQty = oldQty + newQty;
      const newAvg = totalQty === 0 ? 0 : ((oldQty * oldAvg) + (newQty * purchasePrice)) / totalQty;

      await col.updateOne(
        { _id: existing._id },
        {
          $set: { 
              name: newShareData.name || existing.name, 
              avgPurchasePrice: newAvg,
              numberOfShares: totalQty
            }
        }
      );
      finalHolding = await col.findOne({ _id: existing._id });
    } else {
      const r = await col.insertOne(newShareData);
      finalHolding = await col.findOne({ _id: r.insertedId });
    }

    await logTransaction({
        type: 'BUY',
        name: finalHolding.name,
        symbol: finalHolding.symbol,
        quantity: newShareData.numberOfShares,
        price: purchasePrice, 
        date: new Date() // --- FIX: Use new Date() for precise timestamp ---
    });

    res.status(201).json(finalHolding);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const sharesCollection = getCollection(SHARES_COLLECTION);
    const originalShare = await sharesCollection.findOne({ _id: id });
    
    await sharesCollection.updateOne({ _id: id }, { $set: req.body });
    const updatedShare = await sharesCollection.findOne({ _id: id });

    const quantityChange = updatedShare.numberOfShares - originalShare.numberOfShares;

    if (quantityChange > 0) {
        const transactionPrice = ((updatedShare.avgPurchasePrice * updatedShare.numberOfShares) - (originalShare.avgPurchasePrice * originalShare.numberOfShares)) / quantityChange;
        await logTransaction({
            type: 'BUY', name: updatedShare.name, symbol: updatedShare.symbol,
            quantity: quantityChange, price: transactionPrice,
            date: new Date() // --- FIX: Use new Date() for precise timestamp ---
        });
    } else if (quantityChange < 0) {
        const url = `https://financialmodelingprep.com/api/v3/quote-short/${updatedShare.symbol}?apikey=${FMP_API_KEY}`;
        const response = await axios.get(url);
        const currentPrice = response.data[0]?.price || 0;

        await logTransaction({
            type: 'SELL', name: updatedShare.name, symbol: updatedShare.symbol,
            quantity: Math.abs(quantityChange), price: currentPrice,
            date: new Date() // --- FIX: Use new Date() for precise timestamp ---
        });
    }

    res.json(updatedShare);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const sharesCollection = getCollection(SHARES_COLLECTION);
    const shareToDelete = await sharesCollection.findOne({ _id: id });

    if (shareToDelete) {
        const url = `https://financialmodelingprep.com/api/v3/quote-short/${shareToDelete.symbol}?apikey=${FMP_API_KEY}`;
        const response = await axios.get(url);
        const currentPrice = response.data[0]?.price || 0;

        await logTransaction({
            type: 'SELL', name: shareToDelete.name, symbol: shareToDelete.symbol,
            quantity: shareToDelete.numberOfShares, price: currentPrice,
            date: new Date() // --- FIX: Use new Date() for precise timestamp ---
        });
        await sharesCollection.deleteOne({ _id: id });
    }
    
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
}

async function buy(req, res, next) {
  try {
    const errMsg = validateBuyPayload(req.body);
    if (errMsg) return res.status(400).json({ error: errMsg });

    const symbol = normalizeSymbol(req.body.symbol);
    const name = req.body.name || symbol;
    const qty = Number(req.body.numberOfShares);
    const price = Number(req.body.purchasePrice);
    const purchaseDate = req.body.purchaseDate || new Date().toISOString().slice(0,10);

    const col = getCollection(SHARES_COLLECTION);
    const existing = await col.findOne({ symbol });

    let finalHolding;

    if (!existing) {
      const doc = { name, symbol, purchaseDate, numberOfShares: qty, avgPurchasePrice: price };
      const r = await col.insertOne(doc);
      finalHolding = await col.findOne({ _id: r.insertedId });
    } else {
      const oldQty = Number(existing.numberOfShares || 0);
      const oldAvg = Number(existing.avgPurchasePrice || 0);
      const totalQty = oldQty + qty;
      const newAvg = totalQty === 0 ? 0 : ((oldQty * oldAvg) + (qty * price)) / totalQty;
      await col.updateOne(
        { _id: existing._id },
        {
          $set: { name: name || existing.name, avgPurchasePrice: newAvg },
          $inc: { numberOfShares: qty }
        }
      );
      finalHolding = await col.findOne({ _id: existing._id });
    }

    await logTransaction({ type: 'BUY', name, symbol, quantity: qty, price, date: new Date() });
    res.status(201).json({ message: 'Buy transaction successful', holding: finalHolding });
  } catch (err) { next(err); }
}

async function sell(req, res, next) {
  try {
    const { symbol, numberOfShares } = req.body;
    if (!symbol || !numberOfShares || Number(numberOfShares) <= 0) {
      return res.status(400).json({ error: 'symbol and numberOfShares (>0) required' });
    }

    const s = normalizeSymbol(symbol);
    const qty = Number(numberOfShares);
    const col = getCollection(SHARES_COLLECTION);
    const existing = await col.findOne({ symbol: s });
    if (!existing) return res.status(404).json({ error: 'Holding not found' });

    const currentQty = Number(existing.numberOfShares || 0);
    if (qty > currentQty) return res.status(400).json({ error: 'Cannot sell more than held', held: currentQty });

    const url = `https://financialmodelingprep.com/api/v3/quote-short/${s}?apikey=${FMP_API_KEY}`;
    const response = await axios.get(url);
    const currentPrice = response.data[0]?.price || 0;

    await logTransaction({ type: 'SELL', name: existing.name, symbol: s, quantity: qty, price: currentPrice, date: new Date() });

    const remaining = currentQty - qty;
    if (remaining === 0) {
      await col.deleteOne({ _id: existing._id });
      return res.json({ message: 'All shares sold; holding removed', symbol: s });
    } else {
      await col.updateOne({ _id: existing._id }, { $set: { numberOfShares: remaining } });
      const updated = await col.findOne({ _id: existing._id });
      return res.json({ message: 'Sold shares', holding: updated });
    }
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove, buy, sell };
