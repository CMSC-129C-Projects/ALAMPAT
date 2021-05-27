const express = require('express');
const router = express.Router();

const buyerController = require('../controllers/BuyerController');
const marketController = require('../controllers/MarketController');

router.post('/:id/addtoCart/', buyerController.addtoCart)
router.get('/:id/getCart/', buyerController.getCartItems)
router.delete('/:id/removeCartitem/', buyerController.deleteCartitem)


//router.get('/products', marketController.getCommissionList, marketController.getProductList)

router.get('/market', marketController.getAll)
router.get('/productmarket', marketController.getProductList)
router.get('/commissionmarket', marketController.getCommissionList)
router.get('/getCommission/:_id', marketController.getCommission)
router.get('/getProduct/:_id', marketController.getProduct)

module.exports = router;    
