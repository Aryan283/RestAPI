const mongoose = require('mongoose');

const productSchema =  mongoose.Schema({
 _id: mongoose.Schema.Types.ObjectId, //This is a long alphanumeric format mongoose used internally
  name: {type: String, required: true},
  price: {type: Number, required: true} //required prop ensures that price is always specified in the POST request   
  
});

module.exports = mongoose.model('Product', productSchema);

//Import Mongoose
//Connect Mongoose Client with the application
//Create Schema
//Create mongoose model
//Make the data set