const axios = require('axios');
const NodeCache = require('node-cache');

const apiKey = process.env.STOCK_API_KEY;
const cache = new NodeCache({ stdTTL: 60 }); // Cache 60 sec

const isValidTicker = (ticker) => /^[A-Z0-9.]+$/.test(ticker);

/**
 * Fetch single quote
 */
const getQuote = async (ticker) => {
  if (!apiKey || !isValidTicker(ticker)) {
    return { ticker, price: null, raw: null };
  }

  // Cache check
  const cached = cache.get(ticker);
  if (cached) return cached;

  const url = `https://eodhistoricaldata.com/api/real-time/${ticker}?api_token=${apiKey}&fmt=json`;
  try {
    const { data } = await axios.get(url, { timeout: 10000 });
    const quote = {
      ticker,
      price: data.close ?? null,
      raw: { d: data.change ?? null, dp: data.change_p ?? null }
    };
    cache.set(ticker, quote);
    return quote;
  } catch (err) {
    console.error(`EODHD API failed for ${ticker}:`, err.message);
    return { ticker, price: null, raw: null };
  }
};

/**
 * Fetch multiple quotes at once
 */
const getQuotes = async (tickers) => {
  const validTickers = tickers.filter(isValidTicker);
  if (!apiKey || validTickers.length === 0) return [];

  const uncached = validTickers.filter(t => !cache.get(t));
  if (uncached.length === 0) {
    return validTickers.map(t => cache.get(t));
  }

  const url = `https://eodhistoricaldata.com/api/real-time/${uncached.join(',')}?api_token=${apiKey}&fmt=json`;
  try {
    const { data } = await axios.get(url, { timeout: 10000 });
    // EODHD returns array for batch requests
    data.forEach(q => {
      const quote = {
        ticker: q.code,
        price: q.close ?? null,
        raw: { d: q.change ?? null, dp: q.change_p ?? null }
      };
      cache.set(q.code, quote);
    });
    return validTickers.map(t => cache.get(t));
  } catch (err) {
    console.error(`Batch EODHD API failed:`, err.message);
    return validTickers.map(t => ({ ticker: t, price: null, raw: null }));
  }
};

module.exports = { getQuote, getQuotes };
