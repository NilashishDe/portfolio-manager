// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connect } = require('./db');
const sharesRoutes = require('./routes/sharesRoutes');
const marketRoutes = require('./routes/marketRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');

const app = express();
app.use(cors());
app.use(express.json());

async function start() {
  try {
    await connect();
    // Mount routes
    app.use('/api/shares', sharesRoutes);
    app.use('/api/market', marketRoutes);
    app.use('/api/ledger', ledgerRoutes); // 2. Use ledger routes
    app.use('/api/watchlist', watchlistRoutes);
    // Global error handler
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).json({ error: err.message || 'Server error' });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
