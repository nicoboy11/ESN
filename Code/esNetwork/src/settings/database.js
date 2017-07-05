import Realm from 'realm';
import { Config } from './';

/** Local database REALM
 * 
 *  
 *      Here all schemas that will be used in the local database are loaded, 
 *      they should have an equivalent
 *      table in the mysql server. A class should be defined and then the schema
 */
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

    class Person {}
    Person.schema = {
        personId: 'int',
		names: 'string',	
		firstLastName: 'string',
		secondLastName: 'string',
        person: 'string',
		dateOfBirth: 'date',
		email: 'string',
        mobile: 'string',
        genderId: 'int',
        gender: 'string',
		phone: 'string',
		ext: 'string',
		startDate: 'date',
		endDate: 'date',
		higherPersonId: 'int',
        higherPerson: 'string',
		lastLogin: 'date',
		avatar: 'string',
		description: 'string',
		job: 'string',
		roleId: 'int',
		abbr: 'string',
        levelKey: 'string',
        theme: 'string'
    };    

    class ScopeType {}
    ScopeType.schema = {
        name: 'ScopeType',
        properties: {
            id: 'int',
            description: 'string'
        }
    };

    class RoleType {}
    RoleType.schema = {
        name: 'RoleType',
        properties: {
            id: 'int',
            description: 'string'
        }        
    };

    class StateType {}
    StateType.schema = {
        name: 'StateType',
        properties: {
            id: 'int',
            description: 'string'
        }        
    };

    class AttachmentType {}
    AttachmentType.schema = {
        name: 'AttachmentType',
        properties: {
            id: 'int',
            description: 'string'
        }
    };

    class Gender {}
    Gender.schema = {
        name: 'Gender',
        properties: {
            id: 'int',
            description: 'string'
        }
    };

    class Priority {}
    Priority.schema = {
        name: 'Priority',
        properties: {
            id: 'int',
            description: 'string'
        }
    };

    class MessageType {}
    MessageType.schema = {
        name: 'MessageType',
        properties: {
            id: 'int',
            description: 'string'
        }
    };       


/** Database class
 *      This class controlls communication between the app and the databases (both local and remote)
 */
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

        static getClass(table) {
            switch (table) {
                case 'Session':
                    return Session;
                case 'Priority':
                    return Priority;
                default:
                    return Session;
            }
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
        }

    }

export { Database };
 