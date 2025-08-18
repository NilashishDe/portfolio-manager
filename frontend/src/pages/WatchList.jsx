import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Helper function to format currency consistently
const formatCurrency = (value) => {
    if (value === null || typeof value === 'undefined') return "N/A";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
};

export default function Watchlist() {
    const [watchlist, setWatchlist] = useState([]);
    const [ticker, setTicker] = useState('');
    const [exchange, setExchange] = useState('NSE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext);

    const API_BASE = "http://localhost:5000/api/watchlist";

    const fetchWatchlist = async () => {
        setLoading(true);
        setError(''); // Clear previous errors
        try {
            const res = await axios.get(API_BASE, { headers: { Authorization: `Bearer ${token}` } });
            
            if (Array.isArray(res.data)) {
                setWatchlist(res.data);
            } else {
                setWatchlist([]); 
            }

        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to fetch watchlist');
            setWatchlist([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchWatchlist();
        }
    }, [token]);

    const handleAdd = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post(API_BASE, { ticker, exchange }, { headers: { Authorization: `Bearer ${token}` } });
            setTicker('');
            fetchWatchlist(); 
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to add stock');
        }
    };

    const handleRemove = async (stock) => {
        setError('');
        try {
            await axios.delete(`${API_BASE}/${stock.ticker}/${stock.exchange}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchWatchlist(); 
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to remove stock');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Watchlist</h1>
            
            {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded-md">{error}</p>}
            
            <form onSubmit={handleAdd} className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Stock Ticker (e.g., INFY)"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                        className="p-2 border rounded-md md:col-span-2"
                        required
                    />
                     <select
                        value={exchange}
                        onChange={(e) => setExchange(e.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value="NSE">NSE</option>
                        <option value="BSE">BSE</option>
                    </select>
                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Add to Watchlist</button>
                </div>
            </form>

            {loading && <p className="text-center text-gray-500">Loading watchlist...</p>}
            
            {!loading && watchlist.length === 0 && !error && (
                <p className="text-center text-gray-500 mt-8">Your watchlist is empty.</p>
            )}
            
            {!loading && watchlist.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {watchlist.map(stock => (
                        <div key={`${stock.ticker}-${stock.exchange}`} className="bg-white p-4 rounded-lg shadow border">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{stock.ticker} <span className="text-xs text-gray-500">{stock.exchange}</span></h3>
                                    <p className="font-semibold text-2xl">{formatCurrency(stock.price)}</p>
                                </div>
                                <button onClick={() => handleRemove(stock)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                            </div>
                             {/* --- FINAL FIX: Handle cases where changePercent is null or undefined --- */}
                             <div className={`mt-2 font-semibold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(stock.change)} ({stock.changePercent ? parseFloat(stock.changePercent).toFixed(2) : '0.00'}%)
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
