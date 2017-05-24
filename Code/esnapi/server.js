var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    server = app.listen(3001);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

/**
 * USER RELATED ROUTES
 */
app.get('/user/:id',function(req,res){
    /*CALL GetPerson(12)*/
    res.send('This is the user: ' + req.params.id );
});

app.post('/user',function(req,res){
    /*CALL CreatePerson('Even','Sosa','Rodríguez','1985-10-23','even.sosa@gmail.com','07731917608','','password',NULL,'',1); */
    res.send('This creates a new user');
});

app.put('/user/:id',function(req,res){
    res.send('This edits user' + req.params.id);
    /*  CALL EditPerson(4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL)
        --error 1644 = a hierichal loop was found
    */
});

app.get('/loginUser',function(req,res){
    /*CALL GetLogin('even.sosa@gmail.com','passwerd');*/
    res.send('Logs the user in ' + JSON.stringify(req.query));
});

app.get('/hierarchy/:id',function(req,res){
    /*CALL GetHierarchy(5) */
    res.send('The hierarchy for user ' + req.params.id + ' is... ' );
});

/**------------------------------------------------------------------------ */
app.post('/user/:a/follows/:b',function(req,res){
    /*CALL CreateFollower(2,1); 
        --error 1062 = Duplicate entry
    */
    res.send('User ' + req.params.a + ' starts following user ' + req.params.b);
});

app.delete('/user/:a/follows/:b',function(req,res){
    /*CALL DeleteFolloweR(2,1);*/
    res.send('User ' + req.params.a + ' stops following user ' + req.params.b);
});

app.get('/user/:a/follows',function(req,res){
    /*CALL GetFollows(3);*/
    res.send('User ' + req.params.a + ' follows this people' );
});

app.get('/user/:a/followers',function(req,res){
    /*CALL GetFollowers(1);*/
    res.send('Users that follow ' + req.params.a);
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