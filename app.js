const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// import user constructor function form controlers module
const UserClass = require("./controlers/user"); // create userClass reference to User consructor function 
const userObj = new UserClass(); // create an object form UserClass

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

const server = http.listen(7000, function() {
    console.log('listening on *:7000');
});