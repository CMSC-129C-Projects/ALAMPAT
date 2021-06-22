const express = require('express');
const router = express.Router();
const Product = require('../models/products')
const Commission = require('../models/commissions')
const User = require('../models/user')

const buyerController = require('../controllers/BuyerController');
const marketController = require('../controllers/MarketController');
const marketController2 = require('../controllers/MarketController2');
const ReservationController = require('../controllers/ReservationController');
const CommissionController = require('../controllers/CommissionController');
const OrderController = require('../controllers/OrderController');

router.post('/:id/addtoCart/:_id', buyerController.addtoCart)
router.get('/:id/getCart/', buyerController.getCartItems)
router.delete('/:id/removeCartitem/', buyerController.deleteCartitem)

router.post('/:id/addReservation/', ReservationController.addReservation)
router.get('/:id/getReservationList/', ReservationController.getReservationList)
router.get('/:id/getReservation/', ReservationController.getReservation)
router.patch('/:id/cancelReservation/', buyerController.updateReservation)
router.delete('/:id/removeReservation/', ReservationController.removeReservation_inUser)

router.get('/:id/getCheckout/', buyerController.getCheckout)
//router.get('/products', marketController.getCommissionList, marketController.getProductList)

router.post('/:id/addCommOrder/', OrderController.addCommissionOrder)
router.patch('/:id/deductSlot/',CommissionController.deductSlot)
// router.get('/:id/getOrderList/', ReservationController.getReservationList)

router.get('/market', marketController.getAll)
router.get('/productmarket', marketController.getProductList)
router.get('/commissionmarket', marketController.getCommissionList)
router.get('/getCommission/:_id', marketController.getCommission)
router.get('/getProduct/:_id', marketController.getProduct)

router.get('/market2', marketController2.getAll)
router.get('/productmarket2', marketController2.paginatedResults(Product) ,marketController2.getProductList)
router.get('/commissionmarket2', marketController2.paginatedResults(Commission) ,marketController2.getCommissionList)
router.get('/getCommission2/:_id', marketController2.getCommission)
router.get('/getProduct2/:_id', marketController2.getProduct)

module.exports = router;   

   

