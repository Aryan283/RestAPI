const mongoose = require('mongoose');

const userSchema =  mongoose.Schema({
 _id: mongoose.Schema.Types.ObjectId, //This is a long alphanumeric format mongoose used internally
 email: {
    type: String, 
    required: true, 
    unique: true, //avoid duplicacy, although we have used user.find in post still we would put unique here just for optimization
    match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/}, //used for validating email address to a limit (although does not fully checks it yet validates it for the syntax atleast)
 password: {type: String,required: true}  
});

module.exports = mongoose.model('User', userSchema);
