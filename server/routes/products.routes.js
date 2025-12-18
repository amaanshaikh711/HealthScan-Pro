const express = require('express');
const router = express.Router();
const { getProductByBarcode } = require('../controllers/product.controller');

router.get('/:barcode', getProductByBarcode);

module.exports = router;
