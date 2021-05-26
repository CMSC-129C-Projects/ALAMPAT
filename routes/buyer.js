var express = require('express');
var router = express.Router();

const marketController = require('../controllers/MarketController');

router.get('/products', marketController.getCommissionList, marketController.getProductList)


module.exports = router;