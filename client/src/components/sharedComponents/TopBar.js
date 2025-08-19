import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./topbar.css";
import { getIndexes, searchStocks } from '../../services/ApiServices';
import { BsSearch } from "react-icons/bs"; // 1. Import the search icon

const TopBar = () => {
    const [indexes, setIndexes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const navigate = useNavigate();

    // Effect for fetching indexes (existing logic)
    useEffect(() => {
        const fetchIndexes = () => {
            getIndexes().then(data => {
                if (data && data.length > 0) setIndexes(data);
            }).catch(error => console.error("Error fetching indexes:", error));
        };
        fetchIndexes();
        const interval = setInterval(fetchIndexes, 60000);
        return () => clearInterval(interval);
    }, []);

    // Effect for handling the search dropdown
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            searchStocks(searchQuery).then(data => {
                if (data) {
                    setSearchResults(data);
                }
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleStockSelect = (symbol) => {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearchFocused(false);
        navigate(`/stockmarket/${symbol}`);
    };
    
    const formatIndexName = (name) => {
        if (name.includes('Dow Jones')) return 'Dow Jones';
        if (name.includes('S&P 500')) return 'S&P 500';
        if (name.includes('NASDAQ 100')) return 'Nasdaq 100';
        return name;
    };

    return ( 
        <div className="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <span className="logo">Portfolio Tracker</span>
                </div>

                <div className="topCenter">
                    <div className="search-container">
                        {/* 2. Add the icon here */}
                        <BsSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for stocks..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                        />
                        {isSearchFocused && searchResults.length > 0 && (
                            <div className="search-results">
                                {searchResults.map(stock => (
                                    <div 
                                        key={stock.symbol} 
                                        className="search-result-item"
                                        onClick={() => handleStockSelect(stock.symbol)}
                                    >
                                        <span className="result-symbol">{stock.symbol}</span>
                                        <span className="result-name">{stock.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="topRight">
                    {indexes.map(index => (
                        <div key={index.symbol} className="indexItem">
                            <span className="indexName">{formatIndexName(index.name)}</span>
                            <span className="indexPrice">{index.value}</span>
                            <span className={parseFloat(index.change) >= 0 ? 'indexChangePositive' : 'indexChangeNegative'}>
                                {index.change} ({index.changePct})
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
 
export default TopBar;
