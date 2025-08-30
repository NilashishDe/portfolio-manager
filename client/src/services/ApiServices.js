import {apikey} from './apikey';


export const getCurrentStocks = () => {

    return fetch(`https://financialmodelingprep.com/api/v3/stock-screener?marketCapLowerThan=10000000000000&betaMoreThan=1&volumeMoreThan=100&exchange=NYSE,NASDAQ&apikey=${apikey}`)
    .then(res => res.json());
};

const SERVER_URL = 'https://portfolio-manager-nu.vercel.app';

const watchlistURL = `${SERVER_URL}/api/watchlist/`;

export const getStockNews = (symbol) => {
    return fetch(`${SERVER_URL}/api/market/news/${symbol}`)
        .then(res => res.json());
};
export const getIndexes = () => {
    // This now calls the correct endpoint from your marketRoutes.js
    return fetch(`${SERVER_URL}/api/market/indices`)
        .then(res => res.json());
}
export const searchStocks = (query) => {
    if (!query) {
        return Promise.resolve([]); // Return empty array if query is empty
    }
    return fetch(`${SERVER_URL}/api/market/search/${query}`)
        .then(res => res.json());
}
export const getWatchlist = () => {
    return fetch(watchlistURL).then(res => res.json());
}

export const addToWatchlist = (stock) => {
    const payload = {
        name: stock.companyName,
        symbol: stock.symbol
    };
    return fetch(watchlistURL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    }).then(res => res.json());
}

export const removeFromWatchlist = (symbol) => {
    return fetch(watchlistURL + symbol, {
        method: 'DELETE'
    });
}
// export const getStockItemDetails = (symbol) => {
//     const url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apikey}`
//     debugger
//     return fetch(url)
//     .then(res => {
//         debugger
//         console.log(res.json())})
//     .then(res => res.json());
// };
