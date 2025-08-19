import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StockItemDetails from '../components/stockMarketComponents/StockItemDetails';
import { apikey } from '../services/apikey';
import './PageStyles.css';
const StockDetailPage = ({ addToFavourites }) => {
    // This hook gets the stock symbol (e.g., "AAPL") from the URL
    const { symbol } = useParams(); 

    const [stockDetails, setStockDetails] = useState(null);
    const [stockPrices, setStockPrices] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state

    useEffect(() => {
        // Reset state and start loading when the symbol changes
        setIsLoading(true);
        setStockDetails(null);
        setStockPrices(null);

        if (symbol) {
            console.log(`StockDetailPage: Fetching data for ${symbol}`);

            // Create two promises to fetch both sets of data at the same time
            const profilePromise = fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apikey}`)
                .then(res => res.json());

            const pricesPromise = fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=65&apikey=${apikey}`)
                .then(res => res.json());

            // Wait for both promises to resolve
            Promise.all([profilePromise, pricesPromise])
                .then(([profileData, pricesData]) => {
                    console.log("StockDetailPage: Fetched Profile Data:", profileData);
                    console.log("StockDetailPage: Fetched Prices Data:", pricesData);

                    if (profileData && profileData.length > 0) {
                        setStockDetails(profileData[0]);
                    }
                    if (pricesData && pricesData.historical) {
                        setStockPrices(pricesData.historical);
                    }
                })
                .catch(error => console.error("Error fetching stock data:", error))
                .finally(() => setIsLoading(false)); // Stop loading once done
        }
    }, [symbol]); // This effect re-runs ONLY if the symbol in the URL changes

    if (isLoading) {
        return <div style={{ flex: 5, padding: '20px' }}><p>Loading stock details...</p></div>;
    }

    if (!stockDetails || !stockPrices) {
        return <div style={{ flex: 5, padding: '20px' }}><p>Could not find data for symbol: {symbol}</p></div>;
    }

    return (
        <div style={{ flex: 5, padding: '20px' }}>
            <StockItemDetails
                stockDetails={stockDetails}
                stockPrices={stockPrices}
            />
        </div>
    );
};

export default StockDetailPage;
