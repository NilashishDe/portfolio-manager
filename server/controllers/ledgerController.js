// server/controllers/ledgerController.js
const { getCollection } = require('../db');
const COLLECTION = 'ledger';

// GET all transactions from the ledger
async function getAll(req, res, next) {
  try {
    const ledgerCollection = getCollection(COLLECTION);
    // Find all transactions and sort them by date descending
    const transactions = await ledgerCollection.find().sort({ date: -1 }).toArray();
    res.json(transactions);
  } catch (err) { 
    next(err); 
  }
}

module.exports = { getAll };
