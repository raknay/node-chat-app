let MessageCollection = require("../models/message").message;

function Message(){

}

Message.prototype.storeMessage = function(data, callback){
    let messageObj = new MessageCollection({
        userName: data.userName,
        text: data.text,
        date: new Date()
    });

    messageObj.save((error, result) => {
        if(error){
            console.log("something went wrong");
            result = "Couldn't save messages"
        }
        callback(error, result);
    });
};

Message.prototype.getMessages = function(callback){
    MessageCollection.find({}, (error, messages) => {
        callback(error, messages);
    });
};

module.exports = Message;