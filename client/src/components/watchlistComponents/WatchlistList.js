import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { BsFillTrashFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const WatchlistList = ({ watchlist, onRemove }) => {
    const navigate = useNavigate();

    const handleStockClick = (symbol) => {
        navigate(`/stockmarket/${symbol}`);
    };

    const watchlistItems = watchlist.map((stock, index) => (
        <tr key={index} onClick={() => handleStockClick(stock.symbol)} style={{cursor: 'pointer'}}>
            <td>{stock.symbol}</td>
            <td>{stock.name}</td>
            <td>${stock.price.toFixed(2)}</td>
            <td>{stock.volume.toLocaleString()}</td>
            <td>
                <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from firing
                        onRemove(stock.symbol);
                    }}
                >
                    <BsFillTrashFill />
                </Button>
            </td>
        </tr>
    ));

    return (
        <Table size="sm" striped hover className="table">
            <thead className="table-dark">
                <tr>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Volume</th>
                    <th>Remove</th>
                </tr>
            </thead>
            <tbody>
                {watchlistItems}
            </tbody>
        </Table>
    );
};

export default WatchlistList;