import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiFillFileAdd } from "react-icons/ai";
import { postNewShareAdd } from "../../services/PortfolioServices";

const StockMarketItem = ({ stock, onStockClick }) => {
    const [showAddPosition, setShowAddPosition] = useState(false);
    const [newNumShares, setNewNumShares] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleShowAddPosition = () => setShowAddPosition(true);
    const handleCloseAddPosition = () => {
        setShowAddPosition(false);
        setNewNumShares(0); // Reset on close
    };

    const handleNewNumShares = event => setNewNumShares(event.target.value);

    const handleAddPositionSubmit = (event) => {
        event.preventDefault();

        const shares = {
            name: stock.companyName,
            symbol: stock.symbol,
            purchaseDate: new Date().toISOString().slice(0, 10), // Use current date
            numberOfShares: Number(newNumShares),
            avgPurchasePrice: Number(stock.price), // Use current market price from the list
        };

        if (newNumShares <= 0) {
            return;
        } else {
            postNewShareAdd(shares);
            handleCloseAddPosition();
        }
    };

    const handleAddButtonClick = (e) => {
        e.stopPropagation();
        handleShowAddPosition();
    };

    const nameStyle = {
        color: '#0d6efd',
        textDecoration: isHovered ? 'underline' : 'none'
    };

    return (
        <>
            <tr onClick={() => onStockClick(stock.symbol)} style={{ cursor: 'pointer' }}>
                <td>{stock.symbol}</td>
                <td style={{ width: '20%' }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <span style={nameStyle}>{stock.companyName}</span>
                </td>
                <td>$ {stock.price}</td>
                <td>{stock.sector}</td>
                <td style={{ width: '20%' }}>{stock.industry}</td>
                <td>{stock.country}</td>
                <td>
                    <Button variant="success" onClick={handleAddButtonClick}>
                        <AiFillFileAdd />
                    </Button>
                </td>
            </tr>

            <Modal show={showAddPosition} onHide={handleCloseAddPosition} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Position in {stock.symbol}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Number of Shares to Add</Form.Label>
                            <Form.Control onChange={handleNewNumShares} type="number" placeholder="Number of Shares" step="1" min="0"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price Paid Per Share</Form.Label>
                            <Form.Control type="number" readOnly defaultValue={stock.price} />
                            <Form.Text className="text-muted">
                                <p>Using current market value: ${stock.price}</p>
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddPosition}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddPositionSubmit} variant="success" type="submit">
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>    
        </>
    );
};

export default StockMarketItem;
