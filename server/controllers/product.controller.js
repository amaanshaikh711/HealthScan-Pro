const axios = require('axios');

exports.getProductByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params;
        // In reality, this might cache results in MongoDB or modify the response
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);

        if (response.data.status === 1) {
            res.json(response.data.product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
