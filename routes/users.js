const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');

router.get('/getUserByEmail', (req, res, next) => {

    const user = userController.getUserByEmail(email)
    res.send({ user })
})

router.get('/profile', userController.getUserList)
router.get('/profile/:id', userController.getUserByID)


module.exports = router;

