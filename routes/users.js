const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

const userController = require('../controllers/UserController');
const OrderController = require('../controllers/OrderController');

router.get('/getUserByEmail', (req, res, next) => {

    const user = userController.getUserByEmail(email)
    res.send({ user })

})

router.get('/profile', userController.getUserList)

router.get('/profile/:id', userController.getUserByID)

router.patch('/updateAccount/:id?', userController.updateAccount)

router.get('/:id/getOrders/', OrderController.getOrderList)

router.post('/:id/addprod_orders/', OrderController.addProductOrder)

router.post('/:id/addcomm_orders/', OrderController.addCommissionOrder)
module.exports = router;

