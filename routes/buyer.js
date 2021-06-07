var express = require('express');
var router = express.Router();

const marketController = require('../controllers/MarketController');

router.get('/market', marketController.getAll)
router.get('/productmarket', marketController.getProductList)
router.get('/commissionmarket', marketController.getCommissionList)
router.get('/getCommission/:_id', marketController.getCommission)
router.get('/getProduct/:_id', marketController.getProduct)


module.exports = router;    