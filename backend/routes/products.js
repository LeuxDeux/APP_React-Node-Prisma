const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductByID);
router.post('/', productsController.createProduct);
router.delete('/:id', productsController.deleteProductByID);
router.put('/:id', productsController.updateProduct);


module.exports = router;