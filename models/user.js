// user model for new use registration
(function () {
  let mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , userSchema = new Schema({
      userName: { type: String, required: true, unique: true },
      emailId: { type: String, required: true },
      fullName: { type: String, required: true },
      password: { type: String, required: true },
      registeredDate: { type: Date, required: true }
	});
	
  exports.user = mongoose.model('User', userSchema, 'user');
}).call(this);