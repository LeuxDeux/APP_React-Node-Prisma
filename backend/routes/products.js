const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// RUTA PÚBLICA
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductByID);

// RUTAS PROTEGIDAS
router.post('/', verifyToken, verifyAdmin, productsController.createProduct);
router.delete('/:id', verifyToken, verifyAdmin, productsController.deleteProductByID);
router.put('/:id', verifyToken, verifyAdmin, productsController.updateProduct);


module.exports = router;