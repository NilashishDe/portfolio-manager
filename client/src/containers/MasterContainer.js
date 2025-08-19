import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchedData } from '../components/stockMarketComponents/fetchedData';
import TopBar from '../components/sharedComponents/TopBar';
import SideBar from '../components/sharedComponents/SideBar';
import PortfolioContainer from "./PortfolioContainer";
import StockMarketContainer from './StockMarketContainer';
import StockDetailPage from './StockDetailPage';
import HistoryContainer from './HistoryContainer';
import WatchlistContainer from './WatchlistContainer'; // 1. Import WatchlistContainer
import "./master.css";

const MasterContainer = () => {
    const [apiData] = useState(fetchedData);
    
    // The favourites state is no longer needed here as it's managed by the watchlist
    const [stockFavourites, setStockFavourites] = useState([]);
    const addToFavourites = (favourite) => {
        if (stockFavourites.find(f => f.symbol === favourite.symbol)) return;
        setStockFavourites([favourite, ...stockFavourites]);
    };

    return (
        <Router>
            <TopBar />
            <div className="sidebar-content-container">
                <SideBar />
                <Routes>
                    <Route path='/' element={<PortfolioContainer apiData={apiData} />} />
                    <Route path='/stockmarket' element={<StockMarketContainer stocks={apiData} stockFavourites={stockFavourites} />} />
                    <Route path='/stockmarket/:symbol' element={<StockDetailPage addToFavourites={addToFavourites} />} />
                    <Route path='/history' element={<HistoryContainer />} />
                    {/* 2. Add the new route for the watchlist page */}
                    <Route path='/watchlist' element={<WatchlistContainer />} />
                </Routes>
            </div>
        </Router>
    );
}

export default MasterContainer;
