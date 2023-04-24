const mongoose = require('mongoose');

const orderSchema =  mongoose.Schema({
 _id: mongoose.Schema.Types.ObjectId, //This is a long alphanumeric format mongoose used internally
 product: {type: mongoose.Schema.Types.ObjectId, ref : 'Product'},
 quantity: {type: Number, /*required: True*/ default: 1, required: true}
});

module.exports = mongoose.model('Order', orderSchema);

//Import Mongoose
//Connect Mongoose Client with the application
//Create Schema
//Create mongoose model
//Make the data set