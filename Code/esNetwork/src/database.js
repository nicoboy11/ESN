import { network } from './config.js';

module.exports = function database() {
    this.request = function (type, sp, params, onStart, onSuccess, onError) {
        fetch(network.server + sp, { 
            method: type, 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params) 
        })
        .then(onStart)
        .then(onSuccess)
        .catch(onError);  
    }
}




/*fetch(network.server + 'loginUser', { 
    method: 'POST', 
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email, 
        password 
    }) 
})
.then(this.handleResponse.bind(this))
.then(this.onLoginResponse.bind(this))
.catch(this.onError.bind(this));      */   