// server/models/shareModel.js
const { ObjectId } = require('mongodb');

function normalizeSymbol(symbol) {
  return String(symbol || '').toUpperCase();
}

function toObjectId(id) {
  try { return new ObjectId(id); } catch { return null; }
}

function validateBuyPayload(body) {
  const { symbol, numberOfShares, purchasePrice } = body;
  if (!symbol) return 'symbol is required';
  if (!numberOfShares || Number(numberOfShares) <= 0) return 'numberOfShares must be > 0';
  if (purchasePrice === undefined || Number(purchasePrice) <= 0) return 'purchasePrice must be > 0';
  return null;
}

module.exports = { normalizeSymbol, toObjectId, validateBuyPayload };
