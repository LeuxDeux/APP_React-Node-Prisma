const prisma = require("../config/prisma");

const productsController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await prisma.product.findMany();
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
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
      });
      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }
      res.json({
        success: true,
        product,
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
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          category,
          stock: parseInt(stock),
        },
      });

      //Integramos Socket.io (avisamos en tiempo real que se creó un producto)
      req.io.emit("server:products_updated");

      res.status(201).json({
        success: true,
        productId: product.id,
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
      await prisma.product.delete({
        where: { id: parseInt(id) },
      });
      //Integramos Socket.io (avisamos en tiempo real que se eliminó un producto)
      req.io.emit("server:products_updated");
      res.json({
        success: true,
        product: "Product deleted successfully",
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }
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
      await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          price: parseFloat(price),
          category,
          stock: parseInt(stock),
        },
      });
      //Integramos Socket.io (avisamos en tiempo real que se creó un producto)
      req.io.emit("server:products_updated");
      res.json({
        success: true,
        message: "Product updated successfully",
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }
      console.error("Error updating product:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
};

module.exports = productsController;
