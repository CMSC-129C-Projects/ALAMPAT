const User = require('../models/user')
const bcrypt = require('bcryptjs')
const userController = require('./UserController')



const register = async (req, res, next) => {
    const existingUser = await userController.getUserByEmail(req.body.email)
    if (!existingUser) {

        bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
            if (err) {
                res.json({
                    error: err
                })
            }


            let user = new User({
                name: req.body.name,
                DOB: req.body.DOB,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                userType: req.body.userType,
                password: hashedPass
            })
            //try{}
            user.save()
                .then(user => {
                    res.json({
                        message: 'user registered succesfully',
                        success: true
                    })
                })
                .catch(error => {
                    res.json({
                        message: 'an error occurred'
                    })
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



module.exports = {
    register
}