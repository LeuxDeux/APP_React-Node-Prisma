const pool = require('../config/database');

const productsController = { 
    getAllProducts: async (req, res) => { 
        try {
            const [products] = await pool.query('SELECT * FROM products;');
            res.json({ 
                success: true,
                products
             });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal server error' 
            });
        }
     },
     getProductByID: async (req, res) => { 
        const { id } = req.params;
        try {
            const [product] = await pool.query('SELECT * FROM products WHERE id = ?;', [id]);
            if (product.length === 0) {
                return res.status(404).json({ 
                    success: false,
                    error: 'Product not found' 
                });
            }
            res.json({ 
                success: true,
                product: product[0]
             });
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal server error' 
            });
        }
    }
};

module.exports = productsController;