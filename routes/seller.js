const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

const portfolioController = require('../controllers/PortfolioController');
const OrderController = require('../controllers/OrderController');
const productController = require('../controllers/productController');
const commissionController = require('../controllers/CommissionController');
const reservationController = require('../controllers/ReservationController');

router.post('/:id/addportfolio', portfolioController.addArtwork)
router.get('/:id/portfolio', portfolioController.getArtworkList)
router.patch('/:id/editportfolio/:artid', portfolioController.updateArtwork)
router.delete('/:id/removeportfolio/', portfolioController.deleteArtwork)
router.get('/:id/artwork/:_id', portfolioController.getArtwork)

router.post('/:id/addproduct', productController.addProduct)
router.get('/:id/product', productController.getProductList)
router.patch('/:id/editproduct/:productid', productController.updateProduct)
router.delete('/:id/removeproduct/', productController.deleteProduct)


router.post('/:id/addcommission', commissionController.addCommission)
router.get('/:id/commission', commissionController.getCommissionList)
router.patch('/:id/editcommission/:commissionid', commissionController.updateCommission)
router.delete('/:id/removecommission/', commissionController.deleteCommission)


router.post('/:id/addreservation', reservationController.addReservation)
router.get('/:id/reservations', reservationController.getReservationList)
router.patch('/:id/editreservation/:reservationid', reservationController.updateReservation)
router.delete('/:id/removereservation/', reservationController.deleteReservation)

router.patch('/updateOrder/:order_id', OrderController.updateOrder)


module.exports = router;