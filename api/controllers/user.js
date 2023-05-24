const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email}).exec().then(user =>{
        if(user.length >= 1){
            // if(user) if we used this snippet then user would be created but it would return an empty 
            // array because this user does not exist (User.find method returns empty array)
            //therefore we need to check the length  of the array , if its greater than 1 it is a duplicate email
            return res.status(409).json({
                message: 'User exists with this mail id, Please try again with different Id'
            });
        } else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result =>{
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        });
                    })
                    .catch( err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    });
                }
            })
        }
})
}

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email}).exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, function(err, result) {
            // if(err){
            //     return res.status(401).json({
            //         message: 'Auth failed'
            //     });
            // }
            //It is advisable to use above if condition in case the operation fails due to some reason other than incorrect password
            
            // Password correct
            if(result){
               const token =  jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY, 
                {
                    expiresIn: "1h"
                } 
                );
                return res.status(200).json({
                    message: 'Auth succesfull',
                    token: token
                });
            }

            // Password incorrect
            res.status(401).json({
                message: 'Auth failed'
            })
        });
    })
    .catch( err =>{  //this catch block catches the error related to find method for email
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
  
}