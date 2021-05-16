const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');

const portfolioController = require('../controllers/PortfolioController');

router.post('/:id/addportfolio', portfolioController.addArtwork)
router.get('/:id/portfolio', portfolioController.getArtworkList)
router.patch('/:id/editportfolio/:artid', portfolioController.updateArtwork)
router.delete('/:id/removeportfolio/', portfolioController.deleteArtwork)
router.get('/portfolio/:id', portfolioController.getArtByID)

module.exports = router;