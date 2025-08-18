import React from "react";

const formatCurrency = (value) => {
    if (value === null || typeof value === 'undefined') return "N/A";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
};

export default function StockList({ stocks, onSell }) {
  if (!stocks || stocks.length === 0) {
    return <p className="mt-8 text-center text-gray-500">Your portfolio is empty.</p>;
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow border">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Ticker</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Exchange</th>
            <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Quantity</th>
            <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Avg. Price</th>
            <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Current Price</th>
            <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Market Value</th>
            <th className="text-right py-3 px-4 uppercase font-semibold text-sm">P/L</th>
            <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {stocks.map((stock) => (
            <tr key={`${stock.ticker}-${stock.exchange}`} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 font-bold">{stock.ticker}</td>
              <td className="py-3 px-4">{stock.exchange}</td>
              <td className="py-3 px-4 text-right">{stock.quantity}</td>
              <td className="py-3 px-4 text-right">{formatCurrency(stock.avgPrice)}</td>
              <td className="py-3 px-4 text-right">{formatCurrency(stock.currentPrice)}</td>
              <td className="py-3 px-4 text-right font-semibold">{formatCurrency(stock.marketValue)}</td>
              <td className={`py-3 px-4 text-right font-semibold ${stock.individualPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stock.individualPL)}
              </td>
              <td className="py-3 px-4 text-center">
                <button onClick={() => onSell(stock)} className="bg-red-500 text-white py-1 px-3 rounded-md text-sm hover:bg-red-600">
                  Sell
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}