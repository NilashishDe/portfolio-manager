import React, { useState, useEffect } from 'react';
import { getLedger } from '../services/PortfolioServices';
import LedgerList from '../components/ledgerComponents/LedgerList';
import './PageStyles.css';
const HistoryContainer = () => {
    const [ledger, setLedger] = useState([]);

    useEffect(() => {
        getLedger().then(data => {
            if (data) {
                setLedger(data);
            }
        });
    }, []);

    return (
        <div className="portfoliocontainer"> {/* Re-using portfolio container style */}
            <h2>Transaction History</h2>
            <LedgerList transactions={ledger} />
        </div>
    );
};

export default HistoryContainer;