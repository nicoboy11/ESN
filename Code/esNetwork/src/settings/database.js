import Realm from 'realm';
import { Config } from './';

class Session {}
Session.schema = {
    name: 'Session',
    properties: {
        token: 'string',
        personId: 'int'
    }
};


class Database {

    static request(type, sp, params, onStart, onSuccess, onError) {
        const data = Database.realm('Session', { }, 'select', '');

        fetch(Config.network.server + sp, { 
            method: type, 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${data[0].token}`
            },
            body: (Object.keys(params).length === 0) ? null : JSON.stringify(params)
        })
        .then(onStart)
        .then(onSuccess)
        .catch(onError);  
    }

    static realm(table, fields, action, filter) {
        const realm = new Realm({ 
            schema: [Session]   
        });

        let data = realm.objects(table);

        switch (action) {
            case 'create':
                realm.write(() => {
                    if (data[0].length === 0) {
                        realm.create(table, { token: fields.token, personId: fields.personId });
                    } else {
                        data[0].token = fields.token;
                        data[0].personId = fields.personId;
                    }
                });

                return data[0].token;
            case 'select':
                return data;

            default:
                return data;
        }
        /*
        if (action === 'create') {
            realm.write(() => {
                if (data.length === 0) {
                    realm.create(table, { token: fields.token, personId: fields.personId });
                } else {
                    data.token = fields.token;
                }
            });

            return data[0].token;
        }

        return data;*/
    }

}

export { Database };
  /*
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
    };*/
/*
    this.realm = function (table, fields, action, filter) {
        let realm = new Realm({ schema: [Session] });
        let data = realm.objects(table);

        if (action === 'create') {
            realm.write(() => {
                if (data.length === 0) {
                    realm.create(table, { token: fields.token, personId: fields.personId });
                } else {
                    data.token = fields.token;
                }
            });

            return data[0].token;
        }

        return data;
    };
};*/

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