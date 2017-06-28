var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    server = app.listen(3001),
    config = require('./config.json'),
    jwt = require("jsonwebtoken"),
    formidable = require("formidable"),
    http = require("http");

app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('uploads'))

var WebSocket = require('ws');
var wss = new WebSocket.Server({ port: 9998, path:'/task' })

var clients = [];

wss.on('connection', function connection(ws){
    console.log('connected ws');
    ws.on('message', function incoming(message){
        console.log("incoming");
        if(message.includes('{"newConnectionxxx":0,')) {
            var json = JSON.parse(message);
            
            var obj = { "client":ws, "room":json.taskId, "personId":json.personId }
            clients.push(obj);
        }
        else {
            var jsonMsg = JSON.parse(message);    
            clients.forEach(function each(client){
                if(client.client != ws && client.room === jsonMsg.taskId && client.client.readyState === WebSocket.OPEN){
                    console.log("sending: " + jsonMsg.message);
                    client.client.send(message); 
                }
            })


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

function db(sql,conn,callback){
    try{
        conn.connect(function(err){

            if(err) console.log(err.message);

            console.log("Executing: " + sql);
            console.log("conected!");

            conn.query(sql,callback);

        });
    }
    catch(err){
        console.log("sqlErr" + err.message);
    }
}

/** Error Handling */
function handle(error,res,show){
    if(error){
        var message = error.message.replace(error.code,"").replace(":","").trim();

        console.log("Error Handle: " + message);

        if(show){
            res.status(422).end( responseMsg(message) );
        }
        console.log("is returning")
        return false;
    }

    return true;
}

function responseMsg(mensaje){
    return JSON.stringify({"message":mensaje});
}

function handleResponse(result,res,errorMessage){

    if(errorMessage == undefined) errorMessage = "";

    if(result != undefined && result[0] != undefined ){
        if(result[0].length == 0){
            if(errorMessage == ""){
                res.status(200).end( "{}" );
            }
            else{
                res.status(401).end( responseMsg(errorMessage) );
            }
        }
        else{
            res.status(200).end( JSON.stringify(result[0]) );
        }
    }
    else{
        res.status(200).end( responseMsg("Ok") );
    }
}

/**
 * Filter parameters
 */
    function fpVarchar(param){

        if(param == undefined)  return "NULL";

        return "'" + param + "'";
    }

    function fpDate(param){

        if(param == undefined)  return "NULL";
        if(param == "") return "NULL";

        return "'" + param + "'";
    }

    function fpInt(param){

        if(param == undefined)  return "NULL";
        if(param == "") return "NULL";

        return param;
    }

    function fpBool(param){

        if(param == undefined)  return "NULL";
        if(param == "") return "NULL";

        return param;
    }


/**
 * 
 * @param {The http request} req 
 * @param {What is the file for? (avatar, post, post message, group, Task, Task Message, Chat)} type 
 * @param {What field needs to be read to name the uploaded file} field 
 * @param {Callback function} callback
 */
function reqUpload(req, type, field, callback){
    /**

    file structure

    uploads/

        avatars: avt_[personId]
        
        photo in post: ph_pst_[postId]
        file in post:  fl_pst_[postId]

        photo in post message: ph_pstm_[postMessageId]
        file in post message:  fl_pstm_[postMessageId]

        photo in group: ph_grp_[groupId]
        file in group: fl_grp_[groupId]
        photo in task: ph_tk_[taskMessageId]
        file in task: fl_tk_[taskMessageId]
        photo in chat: ph_ch_[postId]
        file in task: fl_ch_[postId]
    */

    var form = new formidable.IncomingForm();
    var fileName = '';
    var uniq = new Date().getTime() / 1000;
    var params = {};

    form.parse(req);
    form.on('field', function(name, value){
        params[name] = value;
    }) 
    .on('fileBegin',function(name, file){
        fileName = config.prefixes[type]
        fileName = fileName + (isNaN(field)?params[field]:field) + '_' + uniq + '.' + file.type.split('/')[1];
        file.path = './uploads/' + fileName;
        params['fileName'] = fileName;
        console.log('file created!');
    })
    .on('progress',function(bytesReceived, bytesExpected){
        console.log('progress: ' + bytesReceived + ' : ' + bytesExpected);
    })        
    .on('end',function(){
        if(fileName === ''){
            fileName = undefined;
        }
        callback(fileName, params);
    })
    .on('error', function(err){
        console.log('upload Error:' + err.message);
        callback();
    })
}

/**
 * USER RELATED ROUTES
 */

//  Register new Person
app.post('/person',function(req,res){

    db("CALL CreatePerson(" + fpVarchar(req.body.names) + "," + fpVarchar(req.body.firstLastName) + "," + fpVarchar(req.body.secondLastName) + 
                        "," + fpDate(req.body.dateOfBirth) + "," + fpVarchar(req.body.email) + "," + fpVarchar(req.body.mobile) + "," + fpVarchar(req.body.phone) + "," + fpVarchar(req.body.ext) + 
                        "," + fpVarchar(req.body.password) + "," + fpInt(req.body.genderId) + "," + fpInt(req.body.highestPersonId) + 
                        "," + fpVarchar(req.body.avatar) + "," + fpVarchar(req.body.token) + "," + fpInt(req.body.roleId) + ");",

    conn,function(error,result){
        if(handle(error,res,true)){
            res.status(200).end( JSON.stringify(result[0]) );
        }
        
    });

});

//  Log In
app.post('/loginUser',function(req,res){
    db("CALL GetLogin(" + fpVarchar(req.body.email) + "," + fpVarchar(req.body.password) + ")",conn,function(error,result){
        
        if(handle(error,res,true)){
        
            var errorMessage = "Login Failed! The password or email address is incorrect.";

            if( result != undefined && result[0] != undefined ){
                if(result[0].length == 0){
                    res.status(401).end( responseMsg(errorMessage) );
                }
                else{

                    var token = jwt.sign({ "email":req.body.email,
                                        "password":req.body.password  },config.auth.secret,{
                        expiresIn: 36000
                    });

                    result[0][0]["token"] = token;

                    res.status(200).end( JSON.stringify(result[0]) );
                }
            }
            else{
                res.status(200).end( responseMsg("Ok") );
            }
        }
    });    
});

//  Get Person Info
apiRoutes.get('/person/:id',function(req,res){

    db("CALL GetPerson(" + req.params.id + ")",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res,"");
        }
    });

});

//  Edit Person
apiRoutes.put('/person/:id',function(req,res){

    reqUpload(req,'avatar', fpInt(req.params.id), function(fileName,params){
        db("CALL EditPerson(" + fpInt(req.params.id) +
                            "," + fpVarchar(params.names) + "," + fpVarchar(params.firstLastName) + "," + fpVarchar(params.secondLastName) + 
                            "," + fpDate(params.dateOfBirth) + "," + fpVarchar(params.email) + "," + fpVarchar(params.mobile) + "," + fpVarchar(params.phone) + 
                            "," + fpVarchar(params.ext) + "," + fpVarchar(params.password) + "," + fpInt(params.genderId) + 
                            "," + fpDate(params.startDate) + "," + fpDate(params.endDate) + "," + fpInt(params.higherPersonId) + 
                            "," + fpDate(params.lastLogin) + "," + fpVarchar(params.fileName) + "," + fpVarchar(params.description) + 
                            "," + fpVarchar(params.job) + "," + fpInt(params.roleId) + "," + fpVarchar(params.theme) + 
                            "," + fpVarchar(params.token) + "," + fpBool(params.isIosSync) + "," + fpBool(params.isAndroidSync) + 
                            "," + fpVarchar(params.os_android) + "," + fpVarchar(params.os_ios) + "," + fpVarchar(params.os_chrome) + "," + fpVarchar(params.os_safari) + ");",
        conn,function(error,result){
            if(handle(error,res,true)){
                handleResponse(result,res,"");
            }
        });
    });
});

// Get Hierarchy of a Person
apiRoutes.get('/hierarchy/:id',function(req,res){
    db("CALL GetHierarchy(" + fpInt(req.params.id) + ")",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res);
        }
    });       
});

/**
 * Followers
 */

// Add new follower
apiRoutes.post('/user/:a/follows/:b',function(req,res){
    db("CALL CreateFollower(" + fpInt(req.params.a) + "," + fpInt(req.params.b) + ")",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res);
        }
    });     
});

apiRoutes.delete('/user/:a/follows/:b',function(req,res){
    db("CALL DeleteFollower(" + fpInt(req.params.a) + "," + fpInt(req.params.b) + ")",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res);
        }
    });        
});

apiRoutes.get('/user/:a/follows',function(req,res){
    db("CALL GetFollows(" + fpInt(req.params.a) + ")",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res);
        }
    });       
});

apiRoutes.get('/user/:a/followers',function(req,res){
    db("CALL GetFollowers(" + fpInt(req.params.a) + ")",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res);
        }
    });       
});

/**
 * POSTS and FEED made by users
 */
apiRoutes.post('/post',function(req,res){
    reqUpload(req,'postatt','personId', function(fileName, params){
        db("CALL CreatePost(" + fpInt(params.personId) + "," + fpVarchar(params.message) + "," + fpInt(params.messageTypeId) +
                            "," + fpVarchar(params.fileName) + "," + fpInt(params.attachmentTypeId) + "," + fpInt(params.scopeTypeId) +
                            "," + fpInt(params.scopeId) + ");",
        conn, function(error, result){
            if(handle(error,res,true)){
                res.status(200).end( JSON.stringify(result[0]) );
            }
        });
    });

});

apiRoutes.get('/post/:id',function(req,res){
    db("CALL GetPost(" + req.params.id + ");",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res,"");
        }
    });
});

apiRoutes.put('/post/:id',function(req,res){
    reqUpload(req,'postatt',req.params.id, function(fileName, params){
        db("CALL EditPost(" + fpInt(req.params.id) + "," + fpVarchar(params.message) + "," + fpVarchar(params.fileName) + "," +
                            fpInt(params.attachmentTypeId) + "," + fpInt(params.scopeTypeId) + "," + fpInt(params.scopeId) + ");",
        conn,function(error,result){
            if(handle(error,res,true)){
                res.status(200).end( responseMsg("Updated") );
            }
        });
    });
});

/**
 * Obtain All teams a person belongs to
 */
apiRoutes.get('/teams/:personId',function(req,res){
    db("CALL GetPersonTeam(" + req.params.personId + ");",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res,"");
        }
    });
});

/*
apiRoutes.put('/team',function(req,res){
    db("CALL EditTeam(" +   fpInt(req.body.teamId) + "," + fpInt(req.body.name) + "," + fpInt(req.body.abbr) + "," + 
                            fpInt(req.body.teamGoal) + "," + fpInt(req.body.parentTeamId) + "," + fpInt(req.body.email) + "," + 
                            fpInt(req.body.address) + "," + fpInt(req.body.postcode) + "," + fpInt(req.body.cityId) + "," + 
                            fpInt(req.body.phone1) + "," + fpInt(req.body.ext1) + "," + fpInt(req.body.phone2) + "," + 
                            fpInt(req.body.ext2) + "," + fpInt(req.body.latitude) + "," + fpInt(req.body.longitude) + "," + 
                            fpInt(req.body.logo) + "," + fpInt(req.body.personId) + "," + fpInt(req.body.stateTypeId) + ")",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res);
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
 */
/**
 * TASKS
 */
 apiRoutes.get('/personTasks/:personId', function(req,res){
    db("CALL GetPersonTasks(" + fpInt(req.params.personId) + ")",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res);
        }
    }); 
 });

 //  Create a new Task
apiRoutes.post('/task',function(req,res){
    reqUpload(req,'postatt','personId', function(fileName, params){
        db("CALL CreateTask(" + fpVarchar(params.name) + "," + fpVarchar(params.description) + "," + fpDate(params.startDate) +
                            "," + fpDate(params.dueDate) + "," + fpInt(params.creatorId) + "," + fpInt(params.projectId)+
                            "," + fpVarchar(params.calendarId) + "," + fpInt(params.priorityId) + ");",
        conn, function(error, result){
            if(handle(error,res,true)){
                var message = JSON.stringify(result[0])
                if(message === '' || message === undefined){
                    message = '[{"message": "ok"}]'
                }
                res.status(200).end( message );
            }
        });
    });
});

//  Create a new Task
apiRoutes.put('/task',function(req,res){
    reqUpload(req,'postatt','personId', function(fileName, params){
        db("CALL EditTask(" + fpInt(params.taskId) + "," + fpVarchar(params.name) + "," + fpVarchar(params.description) + "," + fpDate(params.startDate) +
                            "," + fpDate(params.dueDate) + "," + fpInt(params.projectId) + "," + fpInt(params.stateId) +
                            "," + fpVarchar(params.calendarId) + "," + fpInt(params.priorityId) + ");",
        conn, function(error, result){
            if(handle(error,res,true)){
                var message = JSON.stringify(result[0])
                if(message === '' || message === undefined){
                    message = '[{"message": "ok"}]'
                }
                res.status(200).end( message );
            }
        });
    });
});

//  Get Task Messages
apiRoutes.get('/taskMessages/:taskId/:personId',function(req,res){

    db("CALL GetTaskMessages(" + req.params.taskId + "," + req.params.personId + ",NULL)",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res,"");
        }
    });

});

//  Send Messages
apiRoutes.post('/taskMessages',function(req,res){
    reqUpload(req,'postatt','personId', function(fileName, params){
        db("CALL CreateTaskMessage(" + fpInt(params.taskId) + "," + fpInt(params.personId) + "," + fpVarchar(params.message) +
                            "," + fpInt(params.messageTypeId) + "," + fpVarchar(params.attachment) + "," + fpInt(params.attachmentTypeId) + ");",
        conn, function(error, result){
            if(handle(error,res,true)){
                var message = JSON.stringify(result[0])
                if(message === '' || message === undefined){
                    message = '[{"message": "ok"}]'
                }
                res.status(200).end( message );
            }
        });
    });
});

/*

apiRoutes.put('/task',function(req,res){
    db("CALL EditTask(" +   fpInt(req.body.taskId) + "," + fpInt(req.body.name) + "," + fpInt(req.body.description) + "," + 
                            fpInt(req.body.startDate) + "," + fpInt(req.body.dueDate) + "," + fpInt(req.body.creationDate) + "," + 
                            fpInt(req.body.creatorId) + "," + fpInt(req.body.projectId) + "," + fpInt(req.body.stateId) + "," + 
                            fpInt(req.body.calendarId) + ")",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res);
        }
    });     
});
*/

/** FEED */
apiRoutes.get('/feed/:userId/:scopeTypeId',function(req,res){
    db("CALL GetFeed(" + fpInt(req.params.userId) + "," + fpInt(req.params.scopeTypeId) + ",1)",conn,function(error,result){
        if(handle(error,res,true)){
            handleResponse(result,res);
        }
    }); 
});
















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