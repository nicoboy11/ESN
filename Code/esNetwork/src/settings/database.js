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
        name: 'Person',
        properties: {
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
            endDate: { type: 'date', optional: true },
            higherPersonId: 'int',
            higherPerson: 'string',
            parentLevelKey: 'string',
            lastLogin: 'date',
            avatar: 'string',
            description: 'string',
            job: 'string',
            roleId: 'int',
            abbr: 'string',
            levelKey: 'string',
            theme: 'string',
            isParent: 'bool',
            isSync: 'bool'
        }
    };    

    class Project {}
    Project.schema = {
        name: 'Project',
        properties: {
            projectId: 'int',
            name: 'string',
            abbr: 'string',
            startDate: 'date',
            creatorId: 'int',
            dueDate: 'date',
            logo: 'string',
            lastChanged: 'date',
            activeTasks: 'int',
            totalTasks: 'int',
            progress: 'int',
            members: { type: 'list', objectType: 'Person' }
        }
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
        static sync(table, data, callback) {
            switch (table) {
                case 'person':
                    for (let i = 0; i < data.length; i++) {
                        let formBody = new FormData();
                        formBody.append('higherPersonId', data[i].higherPersonId.toString());

                        fetch(`${Config.network.server}person/${data[i].personId}`, { 
                            method: 'PUT', 
                            headers: Database.getHeader(1),
                            body: formBody
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            Database.realm(
                                'Person', 
                                { isSync: true }, 
                                'edit', 
                                `personId=${responseJson[0].personId}`
                            );
                            callback(true, responseJson);
                        })
                        .catch((error) => callback(false, error)); 
                    }
                    return;
                default: return;
            }
        }

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

        /** REQUESTS TO NODE SERVER
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
        
            static request2(method, sp, body, headerType, callback) {
                let data = (Object.keys(body).length === 0) ? null : JSON.stringify(body);
                
                if (method === 'POST' || method === 'PUT') {
                    if (headerType === 1) {
                        data = new FormData();
                        const keys = Object.keys(body);
                        
                        for (let i = 0; i < keys.length; i++) {
                            const key = keys[i];                    
                            if (body[key] !== undefined) {
                                data.append(key, body[key]);
                            }
                        }
                    }
                }

                if (method === 'GET') {
                    data = null;
                }

                fetch(Config.network.server + sp, { 
                    method, 
                    headers: Database.getHeader(headerType),
                    body: data
                })
                .then((response) => response.json())
                .then((responseJson) => callback(false,responseJson) )
                .catch((error) => callback(true,error));                  
            }

        /** getClass
         * 
         * @param {*} table 
         */
            static getClass(table) {
                switch (table) {
                    case 'Session':
                        return Session;
                    case 'Priority':
                        return Priority;
                    case 'Person':
                        return Person;
                    case 'Project':
                        return Project;                        
                    default:
                        return Session;
                }
            }         

        /** realmToObject
         * 
         * @param {*} data 
         */
            static realmToObject(data, table) {
                let array = [];     
                
                for (let i = 0; i < data.length; i++) {
                    let object = {};

                    for (let property in Database.getClass(table).schema.properties) {
                        object[property] = data[i][property];
                    }

                    array.push(object);
                }

                return array;
            }

        /** editRealm - update a realm object
         *  
         * @param {*} object the object to edit
         * @param {*} fields the data to edit
         
            static editRealm(table, object, fields) {
                let objClass = Database.getClass(table);

                for (let property in fields) {
                    object[property]
                }

                return object;
            }
        */

        /** REALM - Manage local database
         * 
         * @param {*} table 
         * @param {*} fields 
         * @param {*} action 
         * @param {*} filter 
         */
            static realm(table, fields, action, filter) {
                const realm = new Realm({ 
                    schema: [Session, Person, Project]   
                });

                let data;

                if (filter !== undefined && filter !== '') {
                    data = realm.objects(table).filtered(filter);
                } else {
                    data = realm.objects(table);
                }
                console.log(data.length);
                switch (action) {
                    case 'create':
                        realm.write(() => {
                            if (data[0] === undefined) {
                                fields.forEach((row) => {
                                    realm.create(table, row);
                                    console.log('inserted: ' + row.names);
                                });
                            } else {
                                data[0].token = fields.token;
                                data[0].personId = fields.personId;
                            }
                        });

                        return data[0].token;
                    case 'select':
                        return data;
                    case 'edit':
                        realm.write(() => {
                            for (let property in fields) {
                                data[0][property] = fields[property];
                            }                            
                        });
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
 