var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    server = app.listen(3001);

var config = require('./config.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var conn = mysql.createConnection({
    host: config.db.host,
    por: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
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
    }
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
 * USER RELATED ROUTES
 */
app.get('/person/:id',function(req,res){

    db("CALL GetPerson(" + req.params.id + ")",conn,function(error,result){
        handle(error,res,true);
        res.status(200).end(result[0][0]);
    });

});

app.post('/person',function(req,res){

    db("CALL CreatePerson(" + fpVarchar(req.body.names) + "," + fpVarchar(req.body.firstLastName) + "," + fpVarchar(req.body.secondLastName) + 
                        "," + fpDate(req.body.dateOfBirth) + "," + fpVarchar(req.body.email) + "," + fpVarchar(req.body.phone) + "," + fpVarchar(req.body.ext) + 
                        "," + fpVarchar(req.body.password) + "," + fpInt(req.body.genderId) + "," + fpInt(req.body.highestPersonId) + 
                        "," + fpVarchar(req.body.avatar) + "," + fpVarchar(req.body.token) + "," + fpInt(req.body.roleId) + ");",

    conn,function(error,result){
        handle(error,res,true);
        res.status(200).end(JSON.stringify(result[0]));
    });

});

app.put('/person/:id',function(req,res){

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
        handle(error,res,true);
        res.status(200).end( responseMsg("Updated") );
    });

});

app.get('/loginUser',function(req,res){
    db("CALL GetLogin(" + fpVarchar(req.query.email) + "," + fpVarchar(req.query.password) + ")",conn,function(error,result){
        handle(error,res,true);
        handleResponse(result,res,"Login Failed!");
    });    
});

app.get('/hierarchy/:id',function(req,res){
    db("CALL GetHierarchy(" + fpInt(req.params.id) + ")",conn,function(error,result){
        handle(error,res,true);
        handleResponse(result,res);
    });       
});
/**------------------------------------------------------------------------ */
app.post('/user/:a/follows/:b',function(req,res){
    db("CALL CreateFollower(" + fpInt(req.params.a) + "," + fpInt(req.params.b) + ")",conn,function(error,result){
        handle(error,res,true);
        handleResponse(result,res);
    });     
});

app.delete('/user/:a/follows/:b',function(req,res){
    db("CALL DeleteFollower(" + fpInt(req.params.a) + "," + fpInt(req.params.b) + ")",conn,function(error,result){
        handle(error,res,true);
        handleResponse(result,res);
    });        
});

app.get('/user/:a/follows',function(req,res){
    db("CALL GetFollows(" + fpInt(req.params.a) + ")",conn,function(error,result){
        handle(error,res,true);
        handleResponse(result,res);
    });       
});

app.get('/user/:a/followers',function(req,res){
    db("CALL GetFollowers(" + fpInt(req.params.a) + ")",conn,function(error,result){
        handle(error,res,true);
        handleResponse(result,res);
    });       
});

/**
 * POSTS and FEED made by users
 */
app.post('/post',function(req,res){
    /*CALL CreatePost(1,'This is my first post. Welcome!', 1, NULL, NULL, 1, NULL);*/
    res.send('User is creating this post: ' + req.body.userId);
});

app.get('/post/:id',function(req,res){
    /* CALL GetPost(1) */
    res.send('This is the post: ' + req.params.id );
});

app.put('/post/:id',function(req,res){
    /*CALL EditPost(1,'This is a corrected message','url/to/image',1,1,NULL) ***OJO coleasce esta forzado */
    res.send('This edits post ' + req.params.id);
});

app.post('/post/:id/message',function(req,res){
    /*CALL CreatePostMessage(1,2,'cheers!',1,NULL,NULL);*/
    res.send('Creates new message for post: ' + req.params.id);
});

app.delete('/post/:id/message/:id',function(req,res){
    /*CALL DeletePostMessage(2)*/
    res.send('Delete ' + req.params.id);
});

/**
 * Faltan aqui los creates post Users
 * 
 * 
 */

/** FEED */
app.get('/feed/:userId',function(req,res){
    /*CALL GetFeed(3,1,NULL)*/
    res.send('Gets feed relevant to user: ' + req.params.userId );
});