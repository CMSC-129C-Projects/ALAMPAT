const { deleteOne } = require('../models/user');
const User = require('../models/user')
const ObjectId = require("mongodb").ObjectID
const bcrypt = require('bcryptjs')
const multer = require('multer');


const getUserByEmail = async (email) => {
    try {//finds user email in the database
        const user = await User.findOne({ email });
        return user
    }
    catch (error) {
        console.log(error)
        return { error }
    }
}

const getUserList = (req, res, next) => {
    User.find()//gets all existing users in the database
        .then((users)=>{
            console.log(users);
            res.status(200).json({
                userArray: users
            })
        })
}

const getUserByID = (req, res, next) =>{
    User.findById(req.params.id)//gets a certain user by user id
        .then((user)=>{
            if (!user) {
                console.log()
                return res.status(404).json({
                    message: "Data Retrieving Failed",
                    success: false,
                    
                });
            }
            return res.status(200).json({
                message: "Data Retrieved successfully",
                success: true,
                userData: user});
        })
        .catch(error => 
            res.status(400).json({
                message: "Data Retrieviing Failed!!",
                error: error,
                success: false
            })
        );
}

const updateAccount = async(req, res, next) => {
    try {//updates user object data
        bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
            if (err) {
                res.json({
                    message: "Failed hashing the password",
                    error: err
                })
            }

            else{
                console.log(req.params.id);
                const id = req.params.id
               

                //creates a new user object together with the final image object
                let user = {
                    name: req.body.name,
                    profileImage: {
                        filename: req.body.profileImage.filename,
                        contentType: req.body.profileImage.contentType,
                        imageBase64: req.body.profileImage.imageBase64
                    },
                    email: req.body.email,  
                    phoneNumber: req.body.phoneNumber,
                    address: req.body.address,
                    password: req.body.password, 
                    token: hashedPass,
                    description: req.body.description
              
             }
              
            //updates the user object data to the database 
                User.findByIdAndUpdate( id , {$set: user})
                    .then((result) => {
                        res.json({
                            message: 'User account data updated successfully!',
                            result,
                            success: true,
                        })
                        
                    }).catch((error)=>{
                        res.status(400).json({
                            message: 'User account data update failed!',
                            error:error,
                            user,
                            success: false,
                        })
                    
                    })
            }
        })
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ error,
            success: false, })
    }
}


module.exports = { 
    getUserByEmail, getUserList, getUserByID, updateAccount, 
}
