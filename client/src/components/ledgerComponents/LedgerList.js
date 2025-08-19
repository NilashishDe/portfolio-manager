import React from 'react';
import { Table } from 'react-bootstrap';

const LedgerList = ({ transactions }) => {

    const transactionItems = transactions.map((transaction, index) => {
        const totalValue = (transaction.quantity * transaction.price).toFixed(2);
        
        // --- FIX: Format the full timestamp ---
        const formattedDate = new Date(transaction.date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return (
            <tr key={transaction._id || index}>
                <td>{formattedDate}</td>
                <td>{transaction.symbol}</td>
                <td>{transaction.name}</td>
                <td style={{ color: transaction.type === 'BUY' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {transaction.type}
                </td>
                <td>{transaction.quantity}</td>
                <td>${parseFloat(transaction.price).toFixed(2)}</td>
                <td>${totalValue}</td>
            </tr>
        );
    });

    return (
        <Table size="sm" striped hover className="table">
            <thead className="table-dark">
                <tr>
                    <th>Date & Time</th>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total Value</th>
                </tr>
            </thead>
            <tbody>
                {transactionItems}
            </tbody>
        </Table>
    );
};

export default LedgerList;
