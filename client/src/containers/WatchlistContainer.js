import React, { useState, useEffect } from 'react';
import { getWatchlist, removeFromWatchlist } from '../services/ApiServices';
import WatchlistList from '../components/watchlistComponents/WatchlistList';
import './PageStyles.css';
const WatchlistContainer = () => {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        fetchWatchlistData();
    }, []);

    const fetchWatchlistData = () => {
        getWatchlist().then(data => {
            if (data) {
                setWatchlist(data);
            }
        });
    };

    const handleRemoveStock = (symbol) => {
        removeFromWatchlist(symbol).then(() => {
            // Refresh the list after removing a stock
            fetchWatchlistData();
        });
    };

    return (
        <div className="portfoliocontainer"> {/* Re-using portfolio container style */}
            <h2>My Watchlist</h2>
            <WatchlistList watchlist={watchlist} onRemove={handleRemoveStock} />
        </div>
    );
};

export default WatchlistContainer;