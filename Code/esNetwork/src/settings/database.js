import Realm from 'realm';
import { Config } from './';

class Session {}
Session.schema = {
    name: 'Session',
    properties: {
        token: 'string',
        personId: 'int',
        names: 'string',
        firstLastName: 'string',
        secondLastName: 'string',
        dateOfBirth: 'date',
        email: 'string',
        mobile: 'string',
        phone: 'string',
        ext: 'string',
        genderId: 'int',
        avatar: 'string',
        abbr: 'string',  
        levelKey: 'string',
        theme: 'string',
        isSync: 'bool'
    }
};


class Database {

    static getHeader(headerType) {
        const data = Database.realm('Session', { }, 'select', '');
        switch (headerType) {
            case 0:
                return {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        };            
            case 1:
                return {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${data[0].token}`
                };            
            case 2:
                return {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${data[0].token}`
                        };              
            default:
                return {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        };             
        }
    }

    /**
     * 
     * @param {*} type is it a POST, GET, POST or DELETE?
     * @param {*} sp Which procedure is being called?
     * @param {*} params an object with the params
     * @param {*} headerType header types 0: without Auth, 1 with file and token, 2 with token
     * @param {*} onStart 
     * @param {*} onSuccess 
     * @param {*} onError 
     */
    static request(type, sp, params, headerType, onStart, onSuccess, onError) {
        let data = (Object.keys(params).length === 0) ? null : JSON.stringify(params);
        
        if (type === 'POST' || type === 'PUT') {
            if (headerType === 1) {
                data = new FormData();
                const keys = Object.keys(params);
                
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];                    
                    if (params[key] !== undefined) {
                        data.append(key, params[key]);
                    }
                }
            }
        }

        if (type === 'GET') {
            data = null;
        }

        fetch(Config.network.server + sp, { 
            method: type, 
            headers: Database.getHeader(headerType),
            body: data
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
                    if (data[0] === undefined) {
                        realm.create(table, fields);
                    } else {
                        data[0].token = fields.token;
                        data[0].personId = fields.personId;
                    }
                });

                return data[0].token;
            case 'select':
                return data;
            case 'delete':
                realm.write(() => {
                    realm.delete(data);
                });      
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