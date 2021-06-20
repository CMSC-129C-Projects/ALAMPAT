const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

const userController = require('../controllers/UserController');
const OrderController = require('../controllers/OrderController');
const ReservationController = require('../controllers/ReservationController');

router.get('/getUserByEmail', (req, res, next) => {

    const user = userController.getUserByEmail(email)
    res.send({ user })

})

router.get('/profile', userController.getUserList)

router.get('/profile/:id', userController.getUserByID)

router.patch('/updateAccount/:id?', userController.updateAccount)

router.get('/:id/getOrders/', OrderController.getOrderList)
router.get('/:id/getOrderswithFilter/', OrderController.getOrderList_Filter)
router.get('/:id/getOrder/:order_id', OrderController.getOrder)

router.post('/:id/addprod_orders/', OrderController.addProductOrder)

router.post('/:id/addcomm_orders/', OrderController.addCommissionOrder)

router.delete('/:id/removeReservation', ReservationController.deleteReservation)
module.exports = router;

