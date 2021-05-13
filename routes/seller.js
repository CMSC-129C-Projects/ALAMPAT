const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

const portfolioController = require('../controllers/PortfolioController');
const productController = require('../controllers/productController');

router.post('/:id/addportfolio', portfolioController.addArtwork)
router.get('/:id/portfolio', portfolioController.getArtworkList)
router.patch('/:id/editportfolio/:artid', portfolioController.updateArtwork)
router.delete('/:id/removeportfolio/:artid', portfolioController.deleteArtwork)

router.post('/:id/addproduct', productController.addProduct)
router.get('/:id/products', productController.getProductList)
router.patch('/:id/editproduct/:productid', productController.updateProduct)
router.delete('/:id/removeproduct/:productid', productController.deleteProduct)

module.exports = router;