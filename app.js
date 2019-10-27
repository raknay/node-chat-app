const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// import user constructor function form controlers module
const UserClass = require("./controlers/user"); // create userClass reference to User consructor function 
const userObj = new UserClass(); // create an object form UserClass
// import message contructor function from message module
const MessageClass = require("./controlers/message");
const messageObj = new MessageClass();

// Middleware 
app.use(bodyParser.json());

// middleware end

// database connection
mongoose.connect("mongodb://localhost/chat-app?poolSize=100",{ useNewUrlParser: true },function(error){
    if(error){
        console.log("MongoDb connection failed");
        console.log(error);
    } else {
        console.log("MongoDb connection successful");
    }
});

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get("/register", (req, res) => {
    res.render("registration.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

// socket
io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', ' <i>' + socket.username + ' joined the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', ' <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        messageObj.storeMessage({ userName:socket.username, text:message}, function(err,result){
            console.log(err);
            console.log(result);
        });
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

// get messages
app.get("/get/messages", (req, res) => {
    messageObj.getMessages((error, data) => {
        res.send({
            error: error,
            data: data
        });
    });
});

// save user to db
app.post("/register/user", (req, res) => {
    // call storeUser function to save user to db
    userObj.storeUser(req.body, (error, data) => {
        if(error){
            return res.send({
                error: error,
                data: data
            });
        }
        res.send(data);
    })
});

app.get("/get/all/registered/users", (req, res) => {
    userObj.getUsers(function(error, data){
        res.send({
            error: error,
            data: data
        });
    });
});

app.get("/get/users/by/fullname", (req, res) => {
   const fullName = req.query.fullName;
   userObj.getUser(fullName, function(error, data){
       res.send({
        error: error,
        data: data
       });
   });
});

app.get("/update/user/by/username", (req, res) => {
    userObj.updateUser(req.query.userName, req.query.fullName, (error, data, msg) => {
        res.send({
            error: error,
            data: data,
            message: msg
        });
    });
});

app.get("/delete/user/by/username", (req, res) => {
    userObj.deleteUser(req.query.userName, (error, data) => {
        res.send({
            error: error,
            data: data
        });
    });
});

app.post("/login/user", (req, res) => {
    userObj.loginUser(req.body.userName, req.body.password, (error, data) => {
        res.send({
            error: error,
            data: data
        });
    });
});

app.get("/get/messages/by/username", (req,res) => {
    userObj.getUsers((error1, users) => {
        messageObj.getMessages((error2, messages) => {
            for(let user of users){
                user.messageCount = 0;
                for(let message of messages){
                    if(user.userName === message.userName){
                        user.messageCount += 1;
                    }
                }
            }
            for(let message in messages){

            }
            res.send({
                users: users,
                messages: messages
            });
        });
    });
});

app.get("/get/messages/by/usernamev2", (req,res) => {
    userObj.getUsers((error1, users) => {
        messageObj.getMessages((error2, messages) => {
            messageInfo = {};
            for(let message of messages){
                if(!messageInfo[message.userName]){
                    messageInfo[message.userName] = [];
                }
                messageInfo[message.userName].push(message);
            }

            for(let user of users){
                user.messageCount = 0;
                user.messages = [];
                if(messageInfo[user.userName]){
                    user.messageCount = messageInfo[user.userName].length;
                    user.messages = messageInfo[user.userName];
                }
            }
            res.send({
                users: users,
                messages: messages
            });
        });
    });
});
const server = http.listen(7000, function() {
    console.log('listening on *:7000');
});