import React, { useState } from "react";

export default function BuyStockForm({ onBuy, loading }) {
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [exchange, setExchange] = useState("NSE");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticker || !quantity) return;
    onBuy(ticker, parseInt(quantity), exchange);
    setTicker("");
    setQuantity("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <input
          type="text"
          placeholder="Stock Ticker (e.g., RELIANCE)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          className="p-2 border rounded-md md:col-span-2"
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="p-2 border rounded-md"
          min="1"
          required
        />
        <div className="flex gap-2">
            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="p-2 border rounded-md w-full"
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
            </select>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 w-full"
              disabled={loading}
            >
              {loading ? "..." : "Buy"}
            </button>
        </div>
      </div>
    </form>
  );
}