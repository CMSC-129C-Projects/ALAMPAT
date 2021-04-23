const { deleteOne } = require('../models/user');
const User = require('../models/user')

const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user
    }
    catch (error) {
        console.log(error)
        return { error }
    }
}

const getUserList = (req, res, next) => {
    User.find()
        .then((users)=>{
            console.log(users);
            res.status(200).json({
                userArray: users
            })
        })
}

const getUserByID = (req, res, next) =>{
    User.findById(req.params.id)
        .then((user)=>{
            if (!user) {
                return res.status(404).end();
            }
            return res.status(200).json(user);
        })
        .catch(error => next(error));
}


module.exports = { getUserByEmail, getUserList, getUserByID }





