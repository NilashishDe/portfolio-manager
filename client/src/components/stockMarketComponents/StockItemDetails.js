import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Accordion, Row, Col, Card } from "react-bootstrap";
import { AiFillFileAdd } from "react-icons/ai";
import { postNewShareAdd } from "../../services/PortfolioServices";
import { getStockNews } from "../../services/ApiServices";
import ChartHoldingPriceHistory from '../sharedComponents/ChartHoldingPriceHistroy';
import { addToWatchlist } from '../../services/ApiServices'; // Import the new service
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md'; // Import icons
import './StockMarket.css';


const StockItemDetails = ({ addToFavourites, stockPrices, stockDetails }) => {
    const [showAddPosition, setShowAddPosition] = useState(false);
    const [newNumShares, setNewNumShares] = useState(0);
    const [news, setNews] = useState([]);
    const [isWatchlisted, setIsWatchlisted] = useState(false); 

    useEffect(() => {
        if (stockDetails && stockDetails.symbol) {
            getStockNews(stockDetails.symbol).then(data => {
                if (data && data.length > 0) {
                    setNews(data);
                }
            });
        }
    }, [stockDetails]);

    const handleShowAddPosition = () => setShowAddPosition(true);
    const handleCloseAddPosition = () => {
        setShowAddPosition(false);
        setNewNumShares(0);
    };

    const handleNewNumShares = event => setNewNumShares(event.target.value);

    const handleAddPositionSubmit = (event) => {
        event.preventDefault();
        const currentPrice = (stockPrices[0].open + stockPrices[0].change);

        const shares = {
            name: stockDetails.companyName,
            symbol: stockDetails.symbol,
            purchaseDate: new Date().toISOString().slice(0, 10),
            numberOfShares: Number(newNumShares),
            avgPurchasePrice: Number(currentPrice.toFixed(2)),
        };

        if (newNumShares <= 0) {
            return;
        } else {
            postNewShareAdd(shares);
            handleCloseAddPosition();
        }
    };



    const handleAddToWatchlist = () => {
        addToWatchlist(stockDetails).then(() => {
            setIsWatchlisted(true); // Update state to show it's been added
        });
    };
    
    
    return (
        <> 
            {stockDetails && stockPrices && (
                <div className='card'>
                    <Card style={{width:'100%', margin:'auto'}}>
                        <Card.Header>
                            <Button variant="success" onClick={handleShowAddPosition}>
                                <AiFillFileAdd />
                            </Button>
                            <h3 style={{textAlign:'center', display: 'inline-block', width: '80%'}}>
                                <b>{stockDetails.companyName}</b>
                                <Button 
                                    variant="outline-danger" 
                                    onClick={handleAddToWatchlist} 
                                    style={{marginLeft:'5%'}}
                                    disabled={isWatchlisted} // Disable button after adding
                                >
                                    {isWatchlisted ? <MdFavorite /> : <MdFavoriteBorder />} 
                                    {isWatchlisted ? ' Added' : ' Add to Watchlist'}
                                </Button>
                            </h3>
                        </Card.Header>
                        <Card.Body className='text-center'>
                            <Row>
                                <Col xs={3}>
                                    <img src={stockDetails.image} style={{width:'15%', margin:'auto'}} alt={`${stockDetails.companyName} logo`}></img>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='text-center'>
                                    <ul style={{listStyle:'none', paddingLeft: 0}}>
                                        <li><b>Symbol: </b>{stockDetails.symbol}</li>
                                        <li><b>Current share price: </b>$ {(stockPrices[0].open + stockPrices[0].change).toFixed(2)}</li>
                                        {stockPrices[0].change >= 0 ?
                                            <li style={{color:'#00b300'}}><b>Current day change: </b> $ {stockPrices[0].change} ({(stockPrices[0].change *100 /stockPrices[0].open).toFixed(2)} %) ▲ </li> :
                                            <li style={{color:'red'}}><b>Current day change: </b> $ {stockPrices[0].change} ({(stockPrices[0].change *100 /stockPrices[0].open).toFixed(2)} %) ▼ </li>
                                        }
                                        {(stockPrices[0].close - stockPrices[64].close) >= 0 ?
                                            <li style={{color:'#00b300'}}><b>Change since 3 months ago: </b> $ {(stockPrices[0].close - stockPrices[64].close).toFixed(2)} ({((stockPrices[0].close - stockPrices[64].close) *100 / stockPrices[64].close).toFixed(2)} %) ▲ </li> :
                                            <li style={{color:'red'}}><b>Change since 3 months ago: </b> $ {(stockPrices[0].close - stockPrices[64].close).toFixed(2)} ({((stockPrices[0].close - stockPrices[64].close) *100 / stockPrices[64].close).toFixed(2)} %) ▼ </li>
                                        }
                                        <li><b>Last dividend: </b>{stockDetails.lastDiv}</li>
                                        <li><b>Sector: </b>{stockDetails.sector}</li>
                                        <li><b>Industry: </b>{stockDetails.industry}</li>
                                        <li><b>Website: </b><a href={stockDetails.website} target="_blank" rel="noopener noreferrer">{stockDetails.website}</a></li>
                                        <li><b>Ceo: </b>{stockDetails.ceo}</li>
                                        <li><b>Country: </b>{stockDetails.country}, <b>Currency: </b>{stockDetails.currency}</li>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header><b>Description: </b></Accordion.Header>
                                                <Accordion.Body style={{height:'200px', overflowY:'scroll'}}>
                                                    {stockDetails.description}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            {news.length > 0 && (
                                                <Accordion.Item eventKey="1">
                                                    <Accordion.Header><b>Recent News</b></Accordion.Header>
                                                    <Accordion.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                        {news.map((article) => (
                                                            <div key={article.uuid} className="mb-3 text-start">
                                                                <h6><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></h6>
                                                                <p className="mb-1" style={{fontSize: '0.9em'}}>{article.snippet}</p>
                                                                <small className="text-muted">
                                                                    {article.source} - {new Date(article.published_at).toLocaleDateString()}
                                                                </small>
                                                                {news.indexOf(article) < news.length - 1 && <hr/>}
                                                            </div>
                                                        ))}
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            )}
                                        </Accordion>
                                        <li className="mt-3"><ChartHoldingPriceHistory holdingData={stockDetails}/></li>
                                    </ul>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </div>
            )}

            {stockDetails && stockPrices && (
                <Modal show={showAddPosition} onHide={handleCloseAddPosition} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Position in {stockDetails.symbol}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Number of Shares to Add</Form.Label>
                                <Form.Control onChange={handleNewNumShares} type="number" placeholder="Number of Shares" step="1" min="0"/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Price Paid Per Share</Form.Label>
                                <Form.Control type="number" readOnly defaultValue={(stockPrices[0].open + stockPrices[0].change).toFixed(2)} />
                                <Form.Text className="text-muted">
                                    <p>Using current market value.</p>
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
            )}
        </>
    );
};

export default StockItemDetails;
