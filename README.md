
# 📊 Portfolio Tracker

The **Portfolio Tracker** app allows users to track their shareholdings' performance and total portfolio value in real-time.  
The **Discover** page lets users search for stocks (via external APIs), compare them, and add them to their portfolio.  
Real-time stock data comes from the **NASDAQ exchange** via [Financial Modeling Prep](https://financialmodelingprep.com/) and [MarketAux](https://www.marketaux.com/).

Built with the **MERN stack**: MongoDB, Express, React, Node.js.


## 📌 Project Brief
A local trader came with a portfolio of shares and wanted to analyze it more effectively.  
This Minimum Viable Product (MVP) displays her portfolio and helps her make better decisions using **real-time market data**.

---

## ✅ MVP Features
- Add / Remove / Update / Delete shares.
- View **total current value** of portfolio.
- Track **individual and total performance trends**.
- Fetch live stock prices from external APIs.
- Visualize portfolio composition and value trends with charts.

---

## ✨ Extensions
- View **current price** of each shareholding.
- View **average buy price** and **profit/loss**.
- Compare multiple stocks side by side.
- Search for new stocks and temporarily add them for comparison.
- Visualize paid price vs current value vs profit/loss.

---

## 🔌 APIs, Libraries, and Resources
- [Financial Modeling Prep](https://financialmodelingprep.com/) – stock and market data API.  
- [MarketAux](https://www.marketaux.com/) – financial news & market data.  
- [HighCharts](https://www.highcharts.com/) – charts & visualizations.  
- [React](https://reactjs.org/) – frontend library.  
- [Express](https://expressjs.com/) – backend framework.  
- [MongoDB](https://www.mongodb.com/) – database.  
- [Node.js](https://nodejs.org/) – runtime environment.  

---

## 🛠️ Tech Stack
- **Frontend:** React, CSS, Bootstrap, HighCharts  
- **Backend:** Node.js, Express, REST APIs  
- **Database:** MongoDB  
- **Languages:** JavaScript, HTML, Tailwind CSS  

---

## 📂 Project Structure
```

portfolio-tracker/
│
├── client/              # React frontend
│   ├── public/          # Static files
│   └── src/             # Components, services, containers
│
├── server/              # Node.js backend
│   ├── controllers/     # Route handlers
│   ├── routes/          # API routes
│   ├── models/          # Data models
│   ├── db/              # Database config + seeds
│   └── .env             # Environment variables (not committed)
│
└── README.md

````

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/NilashishDe/portfolio-manager.git
cd portfolio-manager
````

### 2. Install dependencies

**Frontend (React client):**

```bash
cd client
npm install
npm start
```

**Backend (Express server):**

```bash
cd server
npm install
npm run seeds 
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server/` directory:

```env

PORT=5000
MONGO_URI=mongodb://localhost:27017
DB_NAME=portfolio

# FinancialModelingPrep API Key (keep secret)
FMP_API_KEY=your_fmp_api_key_here

# MarketAux API Key
MARKETAUX_API_KEY=your_marketaux_api_key_here


## 📊 Usage

1. Start the **backend**: `npm run dev` (from `server/`)
2. Start the **frontend**: `npm start` (from `client/`)
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. Add shares, view performance, explore trends, and discover new stocks.


