var express = require('express');
var router = express.Router();

const marketController = require('../controllers/MarketController');

router.get('/products', marketController.getCommissionList, marketController.getProductList)

router.get('/market', marketController.getAll)
router.get('/productmarket', marketController.getProductList)
router.get('/commissionmarket', marketController.getCommissionList)
module.exports = router;    