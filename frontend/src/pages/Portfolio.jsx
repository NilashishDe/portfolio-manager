import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import StockList from "../components/StockList";
import BuyStockForm from "../components/BuyStockForm";

export default function Portfolio() {
  const { token } = useContext(AuthContext);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:5000/api/portfolio";

  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_BASE, { headers: { Authorization: `Bearer ${token}` } });
      setPortfolio(res.data.portfolio || []);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPortfolio();
  }, [token]);

  const buyStock = async (ticker, quantity, exchange) => {
    setError(null);
    try {
      await axios.post(
        `${API_BASE}/buy`,
        { ticker, quantity, exchange },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPortfolio();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to buy stock");
    }
  };

  const sellStock = async (stock) => {
    setError(null);
    try {
        await axios.post(
            `${API_BASE}/sell`,
            { ticker: stock.ticker, exchange: stock.exchange },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchPortfolio();
    } catch (err) {
        setError(err.response?.data?.msg || "Failed to sell stock");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Portfolio</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <BuyStockForm onBuy={buyStock} loading={loading} />
      <StockList stocks={portfolio} onSell={sellStock} />
    </div>
  );
}