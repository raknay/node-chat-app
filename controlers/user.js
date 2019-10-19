let UserCollection = require('../models/user').user;

function User() {};

User.prototype.storeUser = function(data,callback){

    let userObj = new UserCollection({
        userName: data.userName,
        emailId: data.emailId,
        password: data.password,
        fullName: data.fullName,
        registeredDate: new Date()
    });
    
    userObj.save(function(error,result){
        if(error){
            console.log("Something went wrong");
            result = "Something went wrong while saving the user"
        }

        callback(error,result)
    });

}

module.exports =User;