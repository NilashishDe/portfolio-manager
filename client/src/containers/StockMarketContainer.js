import React from 'react';
import { useNavigate } from 'react-router-dom';
import StockMarketList from '../components/stockMarketComponents/StockMarketList';
import FavouriteStock from '../components/stockMarketComponents/FavouriteStock';
import { Row, Col } from "react-bootstrap";
import './StockMarketContainer.css';

const StockMarketContainer = ({ stocks, stockFavourites }) => {
    
    const navigate = useNavigate();

    const handleSearchedStock = (stockSymbol) => {
        if (stockSymbol) {
            navigate(`/stockmarket/${stockSymbol}`);
        }
    };

    const displayFavourites = stockFavourites.map((favourite, index) => {
        // We remove stockPrices from here as it's not available in this component anymore
        return <FavouriteStock favourite={favourite} key={index} />;
    });

    return (
        <>
            <div className='stockmarket-container'>
                <Row>
                    <Col>
                        <h2>Stock Market</h2>
                    </Col>
                </Row>
                
                {displayFavourites.length > 0 && <h2>Favourites</h2>}
                {displayFavourites}

                <Row>
                    <Col>
                        {/* FIX: Pass the onStockClick handler to the list */}
                        <StockMarketList stocks={stocks} onStockClick={handleSearchedStock} />
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default StockMarketContainer;
