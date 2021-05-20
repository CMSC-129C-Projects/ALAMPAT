const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userController = require('./UserController')
const ObjectId = require("mongodb").ObjectID
require("dotenv/config")


const register = async (req, res, next) => {
    const existingUser = await userController.getUserByEmail(req.body.email)
    if (!existingUser) {

        bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
            if (err) {
                res.json({
                    error: err
                })
            }

            let final_img = {
                filename: '',
                contentType: '',
                imageBase64: ''
            }

            console.log(req.body)

            let user = new User({
                _id: new ObjectId(),
                name: req.body.name,
                profileImage: final_img,
                DOB: req.body.DOB,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                userType: req.body.userType,
                password: hashedPass,
                description: '',
                
                portfolio: [null],
                cart: [null],
                reservation: [null],
                orders: [null],

                //for seller type user
                commissions: [null],
                products: [null]
            })
            
            user.save(function(err,user){
                if(err){
                    res.json({
                        message: 'an error occurred',
                        error: err
                    })
                } else {
                    res.json({
                        message: 'user registered succesfully',
                        success: true
                    })
                }

            })
                
        })
        
  

    }
    else {
        res.json({
            message: 'User Email exists',
            success: false
        })
    }
}


const login = (req, res, next) => {
    var username = req.body.email
    var password = req.body.password

    User.findOne({ $or: [{ email: username }] })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        
                        res.json({
                            error: err,
                            loggedin: false
                        })
                    }
                    if (result) {
                        let token = jwt.sign({ password: user.password }, process.env.JWT_TOKEN, { expiresIn: '1h' })
                        
                        res.json({
                            message: 'Login Successful!',
                            userdata: user,
                            token: token,
                            expiresIn: 3600,
                            loggedin: true
                        })
                    } 
                    else{    
                    res.status(401).json({
                        message: 'Password does not matched!',
                        loggedin: false
                    })
                    }
                })
            } else {
                res.json({
                    message: 'No user found',
                    loggedin: false
                })
            }
        })
}

module.exports = {
    register, login
}