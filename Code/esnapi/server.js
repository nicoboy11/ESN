var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    server = app.listen(3001),
    config = require('./config.json'),
    jwt = require("jsonwebtoken");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

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
        console.log(err.message);
    }
}

/** Error Handling */
function handle(error,res,show){
    if(error){
        var message = error.message.replace(error.code,"").replace(":","").trim();

        console.log("Error" + message);

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
            res.status(401).end( responseMsg(errorMessage) );
        }
        else{
            res.status(200).end( JSON.stringify(result[0][0]) );
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
 * USER RELATED ROUTES
 */

//  Register new Person
app.post('/person',function(req,res){

    db("CALL CreatePerson(" + fpVarchar(req.body.names) + "," + fpVarchar(req.body.firstLastName) + "," + fpVarchar(req.body.secondLastName) + 
                        "," + fpDate(req.body.dateOfBirth) + "," + fpVarchar(req.body.email) + "," + fpVarchar(req.body.phone) + "," + fpVarchar(req.body.ext) + 
                        "," + fpVarchar(req.body.password) + "," + fpInt(req.body.genderId) + "," + fpInt(req.body.highestPersonId) + 
                        "," + fpVarchar(req.body.avatar) + "," + fpVarchar(req.body.token) + "," + fpInt(req.body.roleId) + ");",

    conn,function(error,result){
        if(handle(error,res,true)){
            console.log(result[0]);
            console.log(result[0][0]);
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
                        expiresIn: 3600
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

    db("CALL EditPerson(" + fpInt(req.body.id) +
                        "," + fpVarchar(req.body.names) + "," + fpVarchar(req.body.firstLastName) + "," + fpVarchar(req.body.secondLastName) + 
                        "," + fpDate(req.body.dateOfBirth) + "," + fpVarchar(req.body.email) + "," + fpVarchar(req.body.phone) + 
                        "," + fpVarchar(req.body.ext) + "," + fpVarchar(req.body.password) + "," + fpInt(req.body.genderId) + 
                        "," + fpDate(req.body.startDate) + "," + fpDate(req.body.endDate) + "," + fpInt(req.body.higherPersonId) + 
                        "," + fpDate(req.body.lastLogin) + "," + fpVarchar(req.body.avatar) + "," + fpVarchar(req.body.description) + 
                        "," + fpVarchar(req.body.job) + "," + fpInt(req.body.roleId) + "," + fpInt(req.body.theme) + 
                        "," + fpVarchar(req.body.token) + "," + fpBool(req.body.isIosSync) + "," + fpBool(req.body.isAndroidSync) + 
                        "," + fpVarchar(req.body.os_android) + "," + fpVarchar(req.body.os_ios) + "," + fpVarchar(req.body.os_chrome) + "," + fpVarchar(req.body.os_safari) + ");",
    conn,function(error,result){
        if(handle(error,res,true)){
            res.status(200).end( responseMsg("Updated") );
        }
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
    /*CALL CreatePost(1,'This is my first post. Welcome!', 1, NULL, NULL, 1, NULL);*/
    res.send('User is creating this post: ' + req.body.userId);
});

apiRoutes.get('/post/:id',function(req,res){
    /* CALL GetPost(1) */
    res.send('This is the post: ' + req.params.id );
});

apiRoutes.put('/post/:id',function(req,res){
    /*CALL EditPost(1,'This is a corrected message','url/to/image',1,1,NULL) ***OJO coleasce esta forzado */
    res.send('This edits post ' + req.params.id);
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

/** FEED */
apiRoutes.get('/feed/:userId',function(req,res){
    /*CALL GetFeed(3,1,NULL)*/
    res.send('Gets feed relevant to user: ' + req.params.userId );
});


app.use('/',apiRoutes);