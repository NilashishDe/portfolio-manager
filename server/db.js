// server/db.js
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'portfolio';
let client;
let db;

async function connect() {
  if (db) return db;
  client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
  await client.connect();
  db = client.db(DB_NAME);
  return db;
}

function getDb() {
  if (!db) throw new Error('Database not connected. Call connect() first.');
  return db;
}

function getCollection(name) {
  return getDb().collection(name);
}

async function close() {
  if (client) await client.close();
}

module.exports = { connect, getDb, getCollection, close };
