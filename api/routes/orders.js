const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Product = require('../models/product');
const Order = require('../models/order');


   router.get('/', (req, res, next) =>{ 
    Order.find()
    .populate('product')
    .select('product quanitity _id')
    .exec()
    .then(docs =>{
       
         res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/' + doc._id
                    }
                }
            })
         });
    }).catch(err => {
        res.status(500);
        error: err
    });
});

router.post('/',(req, res, next) => {
Product.findById(req.body.productId)
.then(product => {
  if(!product){
    return res.status(404).json({
        message: 'Product not found'
    });
  }
     const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    
       });
      return order.save()
       
       .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored',
            createdProduct : {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url : 'http://localhost:3000/' + result._id
            }
        });
       })
       .catch(err =>{
        res.status(500).json({
            message: 'Product Not Found',
            error: err
        });
    });
});
});
      
router.get('/:orderId',(req, res, next) => {
   Order.findById(req.param.orderId)
   .exec()
   .then(order =>{
    if(!order){
        return res.status(404).json({
             message: 'No valid Order found for that Id'
         });
     }
    res.status(200).json({
        order: order,
        request: {
            type: 'GET',
            url: 'http://localhost:3000/orders' 
        }
    })
   })
   .catch(err=>{
    res.status(500).json({
        error: err
    })
   })
});

router.delete('/:orderId',(req, res, next) => {
    const id  = req.params.orderId; 
    Order.deleteOne({ _id: id})
    .exec()
    .then(order =>{
       
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {productId: "ID", quantity: "Number"}
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            message: 'I dont know what this is'
        })
    })
    
});


module.exports = router