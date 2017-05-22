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
    res.send('This is the user: ' + req.params.id );
});

app.post('/user',function(req,res){
    res.send('This creates a new user');
});

app.put('/user/:id',function(req,res){
    res.send('This edits user' + req.params.id);
});

app.get('/existsUser',function(req,res){
    res.send('Checks if user Exists' + JSON.stringify(req.query));
});

app.get('/loginUser',function(req,res){
    res.send('Logs the user in ' + JSON.stringify(req.query));
});
/**------------------------------------------------------------------------ */
app.post('/user/:a/follows/:b',function(req,res){
    res.send('User ' + req.params.a + ' starts following user ' + req.params.b);
});

app.delete('/user/:a/follows/:b',function(req,res){
    res.send('User ' + req.params.a + ' stops following user ' + req.params.b);
});

app.get('/user/:a/follows',function(req,res){
    res.send('User ' + req.params.a + ' follows this people' );
});

app.get('/user/:a/followers',function(req,res){
    res.send('Users that follow ' + req.params.a);
});

/**
 * POSTS and FEED made by users
 */
app.post('/post',function(req,res){
    res.send('User is creating this post: ' + req.body.userId);
});

app.get('/post/:id',function(req,res){
    res.send('This is the post: ' + req.params.id );
});

app.put('/post/:id',function(req,res){
    res.send('This edits post ' + req.params.id);
});

app.post('/post/:id/message',function(req,res){
    res.send('Creates new message for post: ' + req.params.id);
});

app.delete('/post/:id/message/:id',function(req,res){
    res.send('Delete ' + req.params.id);
});
/** FEED */
app.get('/feed/:userId',function(req,res){
    res.send('Gets feed relevant to user: ' + req.params.userId );
});