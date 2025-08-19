import StockMarketItem from './StockMarketItem';
import { Table } from 'react-bootstrap';
import './StockMarket.css'

// FIX 1: Accept onStockClick as a prop
const StockMarketList = ({stocks, onStockClick}) => {

    let stockItems;

    if (stocks) {
        stockItems = stocks.slice(0, 100).map((stock, index) => {
            // FIX 2: Pass the onStockClick handler down to each item
            return <StockMarketItem stock={stock} index={index} key={index} onStockClick={onStockClick}/>
        });
    };

    return (
        <div>
            <Table size="sm" striped hover className="table">
            <thead className="table-dark" >
            <tr>
                <th>Symbol</th>
                <th>Company name</th>
                <th>Average share price</th>
                <th>Sector</th>
                <th>Industry</th>
                <th>Country</th>
                <th>Add Position</th>
            </tr>
            </thead>
                <tbody>
                    {stockItems}
                </tbody>
            </Table>
        </div>
    );
};

export default StockMarketList;
