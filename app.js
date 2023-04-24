
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
app.use(morgan('dev'));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next)=>{
   res.header("Access-Control-Allow-Origin", "*");
   //* means we are providing access to all the origins, we can also restrict this by giving some 
   //specific URL's in place of *

   res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    //line 12 and 13 provides all the possible headers that might be sent along with the requests
    //line 13 is some of the possible headers
   ); 
   if(req.method === 'OPTIONS'){
    // req.method === OPTIONS checks for the OPTIONS of the req made ie OPTIONS is sent by the browser
    // to check if the request is safe to send or not
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
   }
   next();
});



mongoose.connect('mongodb+srv://aryan:aryan@cluster0.eslpnrq.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true}
);





app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404
    next(error);
})
app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;