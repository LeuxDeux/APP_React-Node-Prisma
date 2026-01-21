const pool = require("../config/database");

const productsController = {
  getAllProducts: async (req, res) => {
    try {
      const [products] = await pool.query("SELECT * FROM products;");
      res.json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
  getProductByID: async (req, res) => {
    const { id } = req.params;
    try {
      const [product] = await pool.query(
        "SELECT * FROM products WHERE id = ?;",
        [id],
      );
      if (product.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }
      res.json({
        success: true,
        product: product[0],
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
  createProduct: async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        success: false,
        error: "Problemas en los campos del formulario"
      });
    }
    try {
      const query =
        "INSERT INTO products (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?);";
      const [result] = await pool.query(query, [
        name,
        description,
        price,
        category,
        stock,
      ]);

      res.status(201).json({
        success: true,
        productId: result.insertId,
        message: "Product created successfully",
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
  deleteProductByID: async (req, res) => {
    const { id } = req.params;
    try {
      const query = "DELETE FROM products WHERE id = ?;";
      const [result] = await pool.query(query, [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }
      res.json({
        success: true,
        product: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    try {
      if (
        (await pool.query("SELECT * FROM products WHERE id = ?;", [id])[0]
          .length) === 0
      ) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }
      const query =
        "UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ? WHERE id = ?;";
      const [result] = await pool.query(query, [
        name,
        description,
        price,
        category,
        stock,
        id,
      ]);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }
      res.json({
        success: true,
        message: "Product updated successfully",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
};

module.exports = productsController;
