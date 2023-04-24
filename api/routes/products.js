const express = require("express");
const router = express.Router();
// it provides us with the utility to express different routes and their endpoints
const mongoose = require('mongoose');
const Product = require('../models/product');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
// / -> root
// /a -> in (a)
// . -> THIS dir path
// /a/./ -> still in /a
// /a/./b -> in /a/b
// .. -> go "up" one level   the one we're using
// /a/./b/.. -> /a/b/.. -> /a
// /a/./b/../.. -> /a/.. -> /
// /a/./b/../../c -> /c

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            products: docs.map(doc => {   
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url : 'http://localhost:3000/products/' + doc._id
                    }

//https://www.youtube.com/watch?v=i17a2cHGsIg --> for map method concept
                }
            })
        };
   
        // if(docs.length >= 0) {
            res.status(200).json(response);
        // } else {
        //     res.status(404).json({
        //         message: 'No Entries Found'
        //     });
        // 
    // }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); //we can put where or limit but we are using exec to fetch all
});

router.post("/", upload.single('productImage'),(req, res, next) => {
console.log(req.file);

    // console.log(req.body); this code can be written to see what contents are being passed to the POST request
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requests to /products',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                error: err });
        });
});




router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
     Product.findById(id).exec() //exec() searches for a match in a string, if a match is found it returns the first match else returns null
     .then(doc=>{
        console.log("From Database",doc);
        if(doc){
            res.status(200).json(doc);
        } else{
            res.status(404).json({message: "No valid entry found for the given ID"});
        }
        
    })
     .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});     
     });
});

router.patch('/:productId', (req, res, next) => {
   const id = req.params.productId;
   const updateOps = {};
   for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
   }
   Product.updateOne({_id: id}, {$set: updateOps})
   .exec()
   .then(result => {
    console.log(result);
    res.status(200).json({
        message: 'Product updated',
        request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + id
        }
    })
})
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});     
     })
   
   });

router.delete('/:productId', (req, res, next) => {
   const id = req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Products deleted',
            request :{
                type: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: {name: 'String', price: 'Number'}
                }
            }
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

module.exports = router;
