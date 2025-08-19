import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHeldShares } from "../services/PortfolioServices";
import PortfolioSharesList from "../components/portfolioComponents/PortfolioSharesList";
import ChartHoldingsByCompany from "../components/sharedComponents/ChartHoldingsByCompany";
import ColumnChartPortfolioPerformance from "../components/sharedComponents/ColumnChartPortfolioPerformance";
import PortfolioSummary from "../components/portfolioComponents/PortfolioSummary"; // 1. Import the new component
import './PortfolioContainer.css'

const PortfolioContainer = ({apiData}) => {

    const [heldShares, setHeldShares] = useState([]);
    const [sharesWithPrice, setSharesWithPrice] = useState([]);
    const [portfolioTotals, setPortfolioTotals] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getHeldShares()
        .then(shares => setHeldShares(shares))
    }, []);

    useEffect(() => {
        if (apiData && apiData.length > 0 && heldShares.length > 0) {
            const portfolioCurrentPrices = heldShares.map((company) => {
                const apiStock = apiData.find(stock => stock.symbol === company.symbol);
                return {
                    ...company,
                    currentPrice: apiStock ? apiStock.price : 0 
                };
            });
            setSharesWithPrice(portfolioCurrentPrices);
        }
    }, [heldShares, apiData]);

    useEffect(() => {
        const portfolioTotalPaid = Number(
            sharesWithPrice
            .map(holding => holding.avgPurchasePrice * holding.numberOfShares)
            .reduce((previous, current) => (previous + current), 0)
            .toFixed(2)
        );

        const portfolioTotalValue = Number(
            sharesWithPrice
            .map(holding => holding.currentPrice * holding.numberOfShares)
            .reduce((previous, current) => (previous + current), 0)
            .toFixed(2)
        );
        
        const newPortfolioTotals = {
            paid: portfolioTotalPaid,
            value: portfolioTotalValue
        };
        setPortfolioTotals(newPortfolioTotals);        
    }, [sharesWithPrice]);

    const handleStockClick = (symbol) => {
        navigate(`/stockmarket/${symbol}`);
    };

    const removeHeldSharesInCompany = (id) => {
        const temp = [...heldShares];
        const indexToDelete = temp.findIndex(shares => shares._id === id);
        if (indexToDelete > -1) {
            temp.splice(indexToDelete, 1);
            setHeldShares(temp);
        }
    };

    const removeSomeSharesInCompany = (id, updatedShareNumber) => {
        const updatedHeldSharesIndex = heldShares.findIndex(heldShare => heldShare._id === id);
        const updatedHeldShares = [...heldShares];
        updatedHeldShares[updatedHeldSharesIndex].numberOfShares = updatedShareNumber;
        setHeldShares(updatedHeldShares);
    };

    const addSomeSharesInCompany = (id, numShares, avgPrice) => {
        const updatedHeldSharesIndex = heldShares.findIndex(heldShare => heldShare._id === id);
        const updatedHeldShares = [...heldShares];
        updatedHeldShares[updatedHeldSharesIndex].numberOfShares = numShares;
        updatedHeldShares[updatedHeldSharesIndex].avgPurchasePrice = avgPrice;
        setHeldShares(updatedHeldShares);
    };

    return (  
        <div className="portfoliocontainer">
            {/* 2. Add the summary component here */}
            <PortfolioSummary totals={portfolioTotals} />

            <PortfolioSharesList 
                heldShares={sharesWithPrice} 
                removeHeldSharesInCompany={removeHeldSharesInCompany} 
                removeSomeSharesInCompany={removeSomeSharesInCompany} 
                addSomeSharesInCompany={addSomeSharesInCompany}
                onStockClick={handleStockClick} 
            />
            <ChartHoldingsByCompany sharesData={sharesWithPrice} />
            <ColumnChartPortfolioPerformance portfolioData={sharesWithPrice} portfolioTotals={portfolioTotals}/>
        </div>
    );
}
 
export default PortfolioContainer;
