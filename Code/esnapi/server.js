var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    server = app.listen(3001),
    config = require('./config.json'),
    jwt = require("jsonwebtoken"),
    http = require("http"),
    helper = require("./functions/helper.js"),
    data = require("./functions/dataMgr.js");

app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('uploads'))

var WebSocket = require('ws');
var wss = new WebSocket.Server({ port: 9998, path:'/task' });
var clients = [];

/** WEB SOCKETS
 * tNull = typing is over
 */
    wss.on('connection', function connection(ws){
        console.log('connected ws');
        ws.on('message', function incoming(message){
            try {
                console.log("incoming message: " + message);
                //A message with the element newConnectionxxx will create a new client
                if(message.includes('{"newConnectionxxx":0,')) {
                    var json = JSON.parse(message);
                    
                    var obj = { "client":ws, "room":json.taskId, "personId":json.personId };

                    clients.push(obj);
                    console.log("online clients: " + clients.length)

                    /** Mark task as 'seen' */
                    data.db("CALL EditTaskMember(" + helper.fpInt(json.taskId) + "," + helper.fpInt(json.personId) + ",NULL," + helper.fpDate(helper.getTodayISO()) + 
                                        ",NULL,NULL,NULL);",
                    conn, function(error, result){
                        console.log(JSON.stringify(result[0]));
                    });
                }
                else if(message.includes('{"disconnectingClient":')){
                    var jsonMsg = JSON.parse(message);
                    clients.pop(clients.filter(function(client){
                        return client.personId = jsonMsg.disconnectingClient;
                    }));                    
                }
                else {
                    var jsonMsg = JSON.parse(message);    
                    clients.forEach(function each(client){
                        console.log(client.personId);
                        if(client.client != ws && client.room === jsonMsg.taskId && client.client.readyState === WebSocket.OPEN){
                            console.log("sending: " + jsonMsg.message);
                            client.client.send(message); 
                        }
                    })
                }            
            } catch(err) {
                console.log(err.message);
            }
        })
    });

var conn = mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
});

var apiRoutes = express.Router();

/** VERIFY TOKEN
 * 
 */
    apiRoutes.use(function(req,res,next){

        var bearerHeader = req.headers["authorization"];
        if(bearerHeader !== undefined){
            var bearer = bearerHeader.split(" ");
            var token = bearer[1];

            jwt.verify(token, config.auth.secret, function(err,decoded){
                if(err){
                    return res.status(403).send({ message: "Authentication Failed" });
                }
                else{
                    req.decoded = decoded;
                    next();
                }
            });        

        }
        else{
            return res.status(403).send({ message: "no token provided" });
        }    

    });

/** =================== PERSON ==================================
 * 
 */

    /** Register User
     * 
     */
        app.post('/person',function(req,res){

            data.db("CALL CreatePerson(" + helper.fpVarchar(req.body.names) + "," + helper.fpVarchar(req.body.firstLastName) + "," + helper.fpVarchar(req.body.secondLastName) + 
                                "," + helper.fpDate(req.body.dateOfBirth) + "," + helper.fpVarchar(req.body.email) + "," + helper.fpVarchar(req.body.mobile) + "," + helper.fpVarchar(req.body.phone) + "," + helper.fpVarchar(req.body.ext) + 
                                "," + helper.fpVarchar(req.body.password) + "," + helper.fpInt(req.body.genderId) + "," + helper.fpInt(req.body.highestPersonId) + 
                                "," + helper.fpVarchar(req.body.avatar) + "," + helper.fpVarchar(req.body.token) + "," + helper.fpInt(req.body.roleId) + ");",

            conn,function(error,result){
                if(data.handle(error,res,true)){
                    res.status(200).end( JSON.stringify(result[0]) );
                }
                
            });

        });

    /** Log In
     *
     */
        app.post('/loginUser',function(req,res){
            data.db("CALL GetLogin(" + helper.fpVarchar(req.body.email) + "," + helper.fpVarchar(req.body.password) + ")",conn,function(error,result){
                //Check response from Database
                if(data.handle(error,res,true)){
                    //Get token and send back to client
                    var token = jwt.sign(
                                    {"email":req.body.email, "password":req.body.password, "personId": result[0][0]["personId"]}, 
                                    config.auth.secret/*,
                                    {expiresIn: 36000}*/
                    );

                    result[0][0]["token"] = token;
                    res.status(200).end( JSON.stringify(result[0]) );
                }
            });    
        });

    /** GET - PERSON BY ID
     * 
     */
        apiRoutes.get('/person/:id',function(req,res){
            data.db("CALL GetPerson(" + req.params.id + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });

    /** GET - NETWORK BY ID
     *      Get all the people in your network meaning all your employees
     */
        apiRoutes.get('/network/:id',function(req,res){
            data.db("CALL GetNetwork(" + req.params.id + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });

    /** GET - PEOPLE
     *      Get all the people in your company
     */
        apiRoutes.get('/network',function(req,res){
            data.db("CALL GetPeople();",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });        

    /** PUT - PERSON BY ID
     *      Edit any person data ID in parameter and the rest in BODY
     */
        apiRoutes.put('/person/:id',function(req,res){
            data.reqUpload(req,'avatar', helper.fpInt(req.params.id), function(fileName,params){
                data.db("CALL EditPerson(" + helper.fpInt(req.params.id) +
                                    "," + helper.fpVarchar(params.names) + "," + helper.fpVarchar(params.firstLastName) + "," + helper.fpVarchar(params.secondLastName) + 
                                    "," + helper.fpDate(params.dateOfBirth) + "," + helper.fpVarchar(params.email) + "," + helper.fpVarchar(params.mobile) + "," + helper.fpVarchar(params.phone) + 
                                    "," + helper.fpVarchar(params.ext) + "," + helper.fpVarchar(params.password) + "," + helper.fpInt(params.genderId) + 
                                    "," + helper.fpDate(params.startDate) + "," + helper.fpDate(params.endDate) + "," + helper.fpInt(params.higherPersonId) + 
                                    "," + helper.fpDate(params.lastLogin) + "," + helper.fpVarchar(params.fileName) + "," + helper.fpVarchar(params.description) + 
                                    "," + helper.fpVarchar(params.job) + "," + helper.fpInt(params.roleId) + "," + helper.fpVarchar(params.theme) + 
                                    "," + helper.fpVarchar(params.token) + "," + helper.fpBool(params.isIosSync) + "," + helper.fpBool(params.isAndroidSync) + 
                                    "," + helper.fpVarchar(params.os_android) + "," + helper.fpVarchar(params.os_ios) + "," + helper.fpVarchar(params.os_chrome) + "," + helper.fpVarchar(params.os_safari) + ");",
                conn,function(error,result){
                    if(data.handle(error,res,true)){
                        data.handleResponse(result,res,"");
                    }
                });
            });
        });

    /** GET - HIERARCHY BY ID
     *      Get immediate employees
     */
        apiRoutes.get('/hierarchy/:id',function(req,res){
            data.db("CALL GetHierarchy(" + helper.fpInt(req.params.id) + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res);
                }
            });       
        });
    /** GET - FREE HIERARCHY BY ID
     *      Get immediate employees
     */
        apiRoutes.get('/freeHierarchy',function(req,res){
            data.db("CALL GetFreeHierarchy();",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res);
                }
            });       
        });    

/** =================== FOLLOWERS ===============================
 * 
 */
    /** POST - PERSON/FOLLOWS
     *      Person 'A' will start following person 'B'
     */
        apiRoutes.post('/person/:a/follows/:b',function(req,res){
            data.db("CALL CreateFollower(" + helper.fpInt(req.params.a) + "," + helper.fpInt(req.params.b) + ")",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res);
                }
            });     
        });
    /** DELETE - PERSON/FOLLOWS
     *      Person 'A' will stop following person 'B'
     */
        apiRoutes.delete('/person/:a/follows/:b',function(req,res){
            data.db("CALL DeleteFollower(" + helper.fpInt(req.params.a) + "," + helper.fpInt(req.params.b) + ")",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res);
                }
            });        
        });
    /** GET - PERSON/FOLLOWS
     *      Get all the people that person 'A' follows
     */
        apiRoutes.get('/person/:a/follows',function(req,res){
            data.db("CALL GetFollows(" + helper.fpInt(req.params.a) + ")",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res);
                }
            });       
        });
    /** GET - PERSON/FOLLOWERS
     *      Get all the people that follows person 'A'
     */
        apiRoutes.get('/person/:a/followers',function(req,res){
            data.db("CALL GetFollowers(" + helper.fpInt(req.params.a) + ")",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res);
                }
            });       
        });
/** =================== POSTS ===================================
 * 
 */
    /** POST - POSTS
     *      Create a new post
     */
        apiRoutes.post('/post',function(req,res){
            data.reqUpload(req,'postatt','personId', function(fileName, params){
                data.db("CALL CreatePost(" + helper.fpInt(params.personId) + "," + helper.fpVarchar(params.message) + "," + helper.fpInt(params.messageTypeId) +
                                    "," + helper.fpVarchar(params.fileName) + "," + helper.fpInt(params.attachmentTypeId) + "," + helper.fpInt(params.scopeTypeId) +
                                    "," + helper.fpInt(params.scopeId) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        res.status(200).end( JSON.stringify(result[0]) );
                    }
                });
            });

        });
    /** GET - POSTS
     *     Get all posts relevant to a person
     * 
     */
        apiRoutes.get('/post/:id',function(req,res){
            data.db("CALL GetPost(" + req.params.id + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });
    /** PUT - POSTS
     *      Edit a post with an Id
     */
        apiRoutes.put('/post/:id',function(req,res){
            data.reqUpload(req,'postatt',req.params.id, function(fileName, params){
                data.db("CALL EditPost(" + helper.fpInt(req.params.id) + "," + helper.fpVarchar(params.message) + "," + helper.fpVarchar(params.fileName) + "," +
                                    helper.fpInt(params.attachmentTypeId) + "," + helper.fpInt(params.scopeTypeId) + "," + helper.fpInt(params.scopeId) + ");",
                conn,function(error,result){
                    if(data.handle(error,res,true)){
                        res.status(200).end( responseMsg("Updated") );
                    }
                });
            });
        });

/** =================== TEAMS ===================================
 *  
 */
    /** GET - TEAMS
     *      Get teams a person is part of
     */
        apiRoutes.get('/teams/:personId',function(req,res){
            data.db("CALL GetPersonTeam(" + req.params.personId + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });
/** =================== PROJECTS ================================
 * 
 */
    /** GET - PROJECTS BY ID
     *      All projects relevant to a person
     */
        apiRoutes.get('/personProjects/:personId',function(req,res){
            data.db("CALL GetPersonProjects(" + req.params.personId + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });

    /** POST - PROJECT
     * 
     */
        apiRoutes.post('/project',function(req,res){
            data.reqUpload(req,'projatt','id', function(fileName, params){
                data.db("CALL CreateProject(" + helper.fpVarchar(params.name) + "," + helper.fpVarchar(params.abbr) + "," + helper.fpDate(params.startDate) +
                                    "," + helper.fpInt(params.creatorId) + "," + helper.fpDate(params.dueDate) + "," + helper.fpVarchar(params.fileName) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        var message = JSON.stringify(result[0])
                        if(message === '' || message === undefined){
                            message = '[{"message": "ok"}]'
                        }
                        res.status(200).end( message );
                    }
                });
            });
        });     

    /** PUT - PROJECT
     * 
     */    
        apiRoutes.put('/project/:projectId',function(req,res){    
            data.reqUpload(req,'projatt', helper.fpInt(req.params.projectId), function(fileName,params){
                data.db("CALL EditProject(" + helper.fpInt(req.params.projectId) + "," + helper.fpVarchar(params.name) + "," + helper.fpVarchar(params.abbr) + "," + helper.fpDate(params.startDate) +
                                    "," + helper.fpDate(params.dueDate) + "," + helper.fpVarchar(params.fileName) + ");",
                conn,function(error,result){
                    if(data.handle(error,res,true)){
                        data.handleResponse(result,res,"");
                    }
                });
            });
        });    
    /** POST PROJECT MEMBER
     * 
     */        
        apiRoutes.post('/projectMember',function(req,res){
            data.reqUpload(req,'postatt','personId', function(fileName, params){
                data.db("CALL CreateProjectMember(" + helper.fpInt(params.projectId) + "," + helper.fpInt(params.personId) + "," + helper.fpInt(params.roleId) +
                                    "," + helper.fpDate(params.startDate) + "," + helper.fpDate(params.endDate) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        var message = JSON.stringify(result[0])
                        if(message === '' || message === undefined){
                            message = '[{"message": "ok"}]'
                        }
                        res.status(200).end( message );
                    }
                });
            });
        });    

    /** PUT PROJECT MEMBER
     * 
     */        
        apiRoutes.put('/projectMember',function(req,res){
            data.reqUpload(req,'postatt','personId', function(fileName, params){
                data.db("CALL EditProjectMember(" + helper.fpInt(params.projectId) + "," + helper.fpInt(params.personId) + "," + helper.fpInt(params.roleId) +
                                            "," + helper.fpDate(params.lastSeen) + 
                                    "," + helper.fpDate(params.startDate) + "," + helper.fpDate(params.endDate) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        var message = JSON.stringify(result[0])
                        if(message === '' || message === undefined){
                            message = '[{"message": "ok"}]'
                        }
                        res.status(200).end( message );
                    }
                });
            });
        });       

    /** DELETE PROJECT MEMBER
     * 
     */         
        apiRoutes.delete('/projectMember',function(req,res){
            data.db("CALL DeleteProjectMember(" + helper.fpInt(req.body.projectId) + "," + helper.fpInt(req.body.personId) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        var message = JSON.stringify(result[0])
                        if(message === '' || message === undefined){
                            message = '[{"message": "ok"}]'
                        }
                        res.status(200).end( message );
                    }
                });
        });    
/** =================== MISC ====================================
 * 
 */
    /** GET - StateType
     * 
     */
        app.get('/stateType/:stateTypeId',function(req,res){
            data.db("CALL GetStateType(" + req.params.stateTypeId + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });

    /** GET - Gender
     * 
     */
        app.get('/gender/:genderId',function(req,res){
            data.db("CALL GetGender(" + req.params.genderId + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });

    /** GET - Priority
     * 
     */
        app.get('/priority/:priorityId',function(req,res){
            data.db("CALL GetPriority(" + req.params.priorityId + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });

    /** GET - ScopeType
     * 
     */
        app.get('/scopeType/:scopeTypeId',function(req,res){
            data.db("CALL GetScopeType(" + req.params.scopeTypeId + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });

    /** GET - RoleType
     * 
     */
        app.get('/roleType/:roleTypeId',function(req,res){
            data.db("CALL GetRoleType(" + req.params.roleTypeId + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });

    /** GET - AttachmentType
     * 
     */
        app.get('/attachmentType/:attachmentTypeId',function(req,res){
            data.db("CALL GetAttachmentType(" + req.params.attachmentTypeId + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });

    /** GET - Messagetype
     * 
     */
        app.get('/messageType/:messageTypeId',function(req,res){
            data.db("CALL GetMessageType(" + req.params.messageTypeId + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });

/** =================== TASKS ===================================
 * 
 */
    /** GET - TASKS
     *      Get tasks relevant to a person
     */
        apiRoutes.get('/personTasks/:personId/:projectId', function(req,res){
            data.db("CALL GetPersonTasks(" + helper.fpInt(req.params.personId) + "," + helper.fpInt(req.params.projectId) + ")",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res);
                }
            }); 
        });

    /** POST - TASKS
     *     Create new Task
     */
        apiRoutes.post('/task',function(req,res){
            data.reqUpload(req,'postatt','personId', function(fileName, params){
                data.db("CALL CreateTask(" + helper.fpVarchar(params.name) + "," + helper.fpVarchar(params.description) + "," + helper.fpDate(params.startDate) +
                                    "," + helper.fpDate(params.dueDate) + "," + helper.fpInt(params.creatorId) + "," + helper.fpInt(params.projectId)+
                                    "," + helper.fpVarchar(params.calendarId) + "," + helper.fpInt(params.priorityId) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        var message = JSON.stringify(result[0])
                        if(message === '' || message === undefined){
                            message = '[{"message": "ok"}]'
                        }
                        res.status(200).end( message );
                    }
                });
            });
        });

    /** PUT - TASKS
     *      Edit Tasks
     */
        apiRoutes.put('/task/:taskId',function(req,res){
            data.reqUpload(req,'postatt',req.params.taskId, function(fileName, params){
                data.db("CALL EditTask(" + helper.fpInt(req.params.taskId) + "," + helper.fpVarchar(params.name) + "," + helper.fpVarchar(params.description) + "," + helper.fpDate(params.startDate) +
                                    "," + helper.fpDate(params.dueDate) + "," + helper.fpInt(params.projectId) + "," + helper.fpInt(params.stateId) + "," + helper.fpInt(params.progress) +
                                    "," + helper.fpVarchar(params.calendarId) + "," + helper.fpInt(params.priorityId) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        var message = JSON.stringify(result[0])
                        if(message === '' || message === undefined){
                            message = '[{"message": "ok"}]'
                        }
                        res.status(200).end( message );
                    }
                });
            });
        });

    /** GET - TASK MESSAGES
     * 
     */
        apiRoutes.get('/taskMessages/:taskId/:personId',function(req,res){

            data.db("CALL GetTaskMessages(" + req.params.taskId + "," + req.params.personId + ",NULL)",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });

        });

    /** POST - TASK MESSAGES
     * 
     */
        apiRoutes.post('/taskMessages',function(req,res){
            data.reqUpload(req,'postatt','personId', function(fileName, params){
                data.db("CALL CreateTaskMessage(" + helper.fpInt(params.taskId) + "," + helper.fpInt(params.personId) + "," + helper.fpVarchar(params.message) +
                                    "," + helper.fpInt(params.messageTypeId) + "," + helper.fpVarchar(params.fileName) + "," + helper.fpInt(params.attachmentTypeId) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        var message = JSON.stringify(result[0])
                        if(message === '' || message === undefined){
                            message = '[{"message": "ok"}]'
                        }                      

                        res.status(200).end( message );

                        //Get people that should receive a notification
                        var resultObj = JSON.parse(JSON.stringify(result[0]))[0];
                        var members = JSON.parse(resultObj.members);
                        var playerIds = [];

                        //Obtain playerId from people
                        for(member of members) {
                            if(member.personId !== resultObj.personId) {
                                var ids = member.playerIds.split(',');
                                playerIds = playerIds.concat(ids);
                            }
                        }

                        //Notification sent only if there is people to send to
                        if(playerIds.length > 0) {
                            //Message object
                            console.log(config.server.url + 'thumbs/big/' + resultObj.avatar);
                            var message = { 
                                app_id: "9b857769-1cfb-4dbf-9e00-8c7c22c1f24e",
                                contents: {"en": resultObj.person + ": " + resultObj.message},
                                headings: {"en": resultObj.taskName},
                                data:{ taskId: resultObj.taskId, projectId: resultObj.projectId },
                                include_player_ids: playerIds,
                                large_icon: config.server.url + 'thumbs/big/' + resultObj.avatar,
                                android_group: "1",
                                ios_badgeCount: 1,
                                ios_badgeType: 'Increase',
                                big_picture: config.server.url + resultObj.attachment
                            };

                            helper.sendNotification(message); 
                        }                         
                    }
                });
            });
        });

    /** GET - CHECKLIST ITEMS
     * 
     */
        apiRoutes.get('/checkListItem/:id',function(req,res){

            data.db("CALL GetCheckListItem(" + req.params.id + ")",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });

        });

    /** PUT - CHECKLIST ITEMS
     *      Edit checklist item
     */
        apiRoutes.put('/checkListItem',function(req,res){
            data.reqUpload(req,'','checkListId', function(fileName, params){
                data.db("CALL EditCheckListItem(" + helper.fpInt(params.checkListId) + "," + helper.fpInt(params.sortNumber) + "," + helper.fpVarchar(params.item) + "," + helper.fpDate(params.dueDate) +
                                    "," + helper.fpBool(params.isChecked) + "," + helper.fpInt(params.terminatorId) + "," + helper.fpDate(params.terminationDate) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        var message = JSON.stringify(result[0])
                        if(message === '' || message === undefined){
                            message = '[{"message": "ok"}]'
                        }
                        res.status(200).end( message );
                    }
                });
            });
        });

    /** POST - CHECKLIST ITEMS
     *      Edit checklist item
     */
        apiRoutes.post('/checkListItem',function(req,res){
            data.reqUpload(req,'','checkListId', function(fileName, params){
                data.db("CALL CreateCheckListItem(" + helper.fpInt(params.checkListId) + "," + helper.fpVarchar(params.item) + "," + helper.fpInt(params.creatorId) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        var message = JSON.stringify(result[0])
                        if(message === '' || message === undefined){
                            message = '[{"message": "ok"}]'
                        }
                        res.status(200).end( message );
                    }
                });
            });
        });        

    /** PUT - TASK LEADER
     * 
     */
        apiRoutes.put('/task/:taskId/leader/:leaderId',function(req,res){
            console.log(req.decoded.personId);
            data.reqUpload(req,'avatar', helper.fpInt(req.params.taskId), function(fileName,params){
                data.db("CALL ChangeLeader(" + helper.fpInt(req.params.taskId) +
                                    "," + helper.fpInt(req.params.leaderId) + "," + helper.fpInt(req.decoded.personId) + ");",
                conn,function(error,result){
                    if(data.handle(error,res,true)){
                        data.handleResponse(result,res,"");
                    }
                });
                console.log('Entró');
            });
        });
    /** POST - TASK MEMBER
     * 
     */
        apiRoutes.post('/taskMember',function(req,res){
            data.reqUpload(req,'postatt','personId', function(fileName, params){
                data.db("CALL CreateTaskMember(" + helper.fpInt(params.taskId) + "," + helper.fpInt(params.personId) + "," + helper.fpInt(params.roleId) +
                                    "," + helper.fpDate(params.startDate) + "," + helper.fpDate(params.endDate) + "," + helper.fpInt(req.decoded.personId) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        var message = JSON.stringify(result[0])
                        if(message === '' || message === undefined){
                            message = '[{"message": "ok"}]'
                        }
                        res.status(200).end( message );
                    }
                });
            });
        });

    /** DELETE - TASK MEMBER
     * 
     */
        apiRoutes.delete('/taskMember',function(req,res){
            data.db("CALL DeleteTaskMember(" + helper.fpInt(req.body.taskId) + "," + helper.fpInt(req.body.personId) + "," + helper.fpInt(req.decoded.personId) + ");",
            conn, function(error, result){
                if(data.handle(error,res,true)){
                    var message = JSON.stringify(result[0])
                    if(message === '' || message === undefined){
                        message = '[{"message": "ok"}]'
                    }
                    res.status(200).end( message );
                }
            });
        });
    /** PUT - TASK MEMBER
     * 
     */    
        apiRoutes.put('/taskMember',function(req,res){
            data.reqUpload(req,'postatt','personId', function(fileName, params){
                data.db("CALL EditTaskMember(" + helper.fpInt(params.taskId) + "," + helper.fpInt(params.personId) + "," + helper.fpInt(params.roleId) +
                                            "," + helper.fpDate(params.lastSeen) + 
                                    "," + helper.fpDate(params.startDate) + "," + helper.fpDate(params.endDate) + "," + helper.fpBool(params.isPinned) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        var message = JSON.stringify(result[0])
                        if(message === '' || message === undefined){
                            message = '[{"message": "ok"}]'
                        }
                        res.status(200).end( message );
                    }
                });
            });
        });    
/** =================== FEED ====================================
 * 
 */
    /** GET - FEED
     *      Get feed according to scope
     */
        apiRoutes.get('/feed/:userId/:scopeTypeId',function(req,res){
            data.db("CALL GetFeed(" + helper.fpInt(req.params.userId) + "," + helper.fpInt(req.params.scopeTypeId) + ",1)",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res);
                }
            }); 
        });
/** =================== Check in/out ====================================
 * 
 */
    /** POST - LocationCheck
     * 
     */
        apiRoutes.post('/locationCheck',function(req,res){
            data.reqUpload(req,'','', function(fileName, params){
                data.db("CALL CreateLocationCheck(" + helper.fpInt(params.personId) + "," + helper.fpDate(params.checkDate) + "," + helper.fpBool(params.isCheckin) + 
                                "," + helper.fpInt(params.companyId) + "," + helper.fpInt(params.officeId) + ");",
                conn, function(error, result){
                    if(data.handle(error,res,true)){
                        var message = JSON.stringify(result[0])
                        if(message === '' || message === undefined){
                            message = '[{"message": "ok"}]'
                        }
                        res.status(200).end( message );
                    }
                });
            });
        });   

    /** GET - LocationCheck
     * 
     */
        apiRoutes.get('/locationCheck/:personId',function(req,res){
            data.db("CALL GetLocationCheck(" + req.params.personId + ");",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res,"");
                }
            });
        });



/*

    apiRoutes.put('/task',function(req,res){
        data.db("CALL EditTask(" +   helper.fpInt(req.body.taskId) + "," + helper.fpInt(req.body.name) + "," + helper.fpInt(req.body.description) + "," + 
                                helper.fpInt(req.body.startDate) + "," + helper.fpInt(req.body.dueDate) + "," + helper.fpInt(req.body.creationDate) + "," + 
                                helper.fpInt(req.body.creatorId) + "," + helper.fpInt(req.body.projectId) + "," + helper.fpInt(req.body.stateId) + "," + 
                                helper.fpInt(req.body.calendarId) + ")",conn,function(error,result){
            if(data.handle(error,res,true)){
                data.handleResponse(result,res);
            }
        });     
    });
    */
    /*
        apiRoutes.put('/team',function(req,res){
            data.db("CALL EditTeam(" +   helper.fpInt(req.body.teamId) + "," + helper.fpInt(req.body.name) + "," + helper.fpInt(req.body.abbr) + "," + 
                                    helper.fpInt(req.body.teamGoal) + "," + helper.fpInt(req.body.parentTeamId) + "," + helper.fpInt(req.body.email) + "," + 
                                    helper.fpInt(req.body.address) + "," + helper.fpInt(req.body.postcode) + "," + helper.fpInt(req.body.cityId) + "," + 
                                    helper.fpInt(req.body.phone1) + "," + helper.fpInt(req.body.ext1) + "," + helper.fpInt(req.body.phone2) + "," + 
                                    helper.fpInt(req.body.ext2) + "," + helper.fpInt(req.body.latitude) + "," + helper.fpInt(req.body.longitude) + "," + 
                                    helper.fpInt(req.body.logo) + "," + helper.fpInt(req.body.personId) + "," + helper.fpInt(req.body.stateTypeId) + ")",conn,function(error,result){
                if(data.handle(error,res,true)){
                    data.handleResponse(result,res);
                }
            });     
        });
    */
    /**
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */











apiRoutes.post('/post/:id/message',function(req,res){
    /*CALL CreatePostMessage(1,2,'cheers!',1,NULL,NULL);*/
    res.send('Creates new message for post: ' + req.params.id);
});

apiRoutes.delete('/post/:id/message/:id',function(req,res){
    /*CALL DeletePostMessage(2)*/
    res.send('Delete ' + req.params.id);
});

/**
 * Faltan aqui los creates post Users
 * 
 * 
 */



app.use('/',apiRoutes);