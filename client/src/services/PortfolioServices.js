const baseURL = 'http://localhost:5000/api/shares/';
const ledgerURL = 'http://localhost:5000/api/ledger/';

export const getHeldShares = () => {
    return fetch(baseURL)
    .then(res => res.json())
}

export const getLedger = () => {
    return fetch(ledgerURL)
    .then(res => res.json());
}

export const postNewShareAdd = (payload) => {
    return fetch(baseURL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
}

export const editCurrentSharesDB = (id, payload) => {
    return fetch(baseURL + id, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
}

export const deleteShares = (id, payload) => {
    return fetch(baseURL + id, {
        method: 'DELETE',
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    })
}