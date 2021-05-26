var express = require('express');
var router = express.Router();

const marketController = require('../controllers/MarketController');

router.get('/products', marketController.getCommissionList, marketController.getProductList)

router.get('/market', marketController.getAll)
module.exports = router;