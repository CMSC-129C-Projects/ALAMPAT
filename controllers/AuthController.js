const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userController = require('./UserController')
const ObjectId = require("mongodb").ObjectID
require("dotenv/config")


const register = async (req, res, next) => {
    const existingUser = await userController.getUserByEmail(req.body.email)
    //if email does not exist in database
    if (!existingUser) {

        bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
            if (err) {
                res.status(404).json({
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
                password: req.body.password,
                token: hashedPass,
                description: '',
                
                portfolio: [],
                cart: [],
                reservation: [],
                orders: [],

                //for seller type user
                commissions: [],
                products: []
            })
            //save user data on database
            user.save(function(err,user){
                if(err){
                    res.status(400).json({
                        message: 'an error occurred',
                        error: err
                    })
                } else {
                    res.status(200).json({
                        message: 'user registered succesfully',
                        success: true
                    })
                }

            })
                
        })
        
  

    }
    else {//if email is already in database
        res.status(409).json({
            message: 'User Email exists',
            success: false
        })
    }
}


const login = (req, res, next) => {
    var username = req.body.email
    var password = req.body.password

    User.findOne({ $or: [{ email: username }] })
    //if user exists, login 
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.token, function (err, result) {
                    if (err) {
                        
                        res.status(404).json({
                            error: err,
                            loggedin: false
                        })
                    }
                    if (result) {//if password input matches the user password on database
                        let token = jwt.sign({ password: user.password }, process.env.JWT_TOKEN, { expiresIn: '1h' })
                        
                        res.status(200).json({
                            message: 'Login Successful!',
                            userdata: user,
                            token: token,
                            expiresIn: 3600,
                            loggedin: true
                        })
                    } 
                    else{    
                    res.status(401).json({
                        message: 'Password does not match!',
                        loggedin: false
                    })
                    }
                })
            } else {//if input user credentials do not exist in the database
                res.status(404).json({
                    message: 'No user found',
                    loggedin: false
                })
            }
        })
}

module.exports = {
    register, login
}