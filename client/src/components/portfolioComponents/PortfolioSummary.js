import React from 'react';
import './PortfolioSummary.css';

const PortfolioSummary = ({ totals }) => {
    // Ensure totals and its properties exist to avoid errors
    const investedAmount = totals?.paid || 0;
    const currentValue = totals?.value || 0;
    const totalPL = currentValue - investedAmount;
    
    // Avoid division by zero
    const plPercentage = investedAmount !== 0 ? (totalPL / investedAmount) * 100 : 0;

    const plColor = totalPL >= 0 ? 'positive' : 'negative';

    return (
        <div className="summary-card">
            <div className="summary-left">
                <span className="summary-label">Current Value</span>
                <span className="summary-value">${currentValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="summary-right">
                <div className="summary-item">
                    <span className="summary-label">Invested Amount</span>
                    <span>${investedAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Total P&L</span>
                    <span className={plColor}>
                        {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                        ({plPercentage.toFixed(2)}%)
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PortfolioSummary;