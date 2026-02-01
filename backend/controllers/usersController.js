const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

const usersController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json({
        success: true,
        users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
  getUserByID: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
  createUser : async (req, res) => {
    const { username, password, address, phonenumber, email} = req.body;
    console.log("Datos recibidos:", { username, password, address, phonenumber, email });
    if (!username || !password || !address || !phonenumber || !email || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Problemas en los campos del formulario",
      });
    }
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          username,
          password: passwordHash,
          address,
          phonenumber,
          email,
        },
      });

      res.status(201).json({
        success: true,
        userId: newUser.id,
        message: "User created successfully",
      });
    } catch (error) {
      console.error("Error creating user:", error.message);
      console.error("Error code:", error.code);
      console.error("Error meta:", error.meta);
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  },
  deleteUserByID: async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      console.error("Error deleting user:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { username, address, phonenumber, email } = req.body;
    try {
      await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          username,
          address,
          phonenumber,
          email,
        },
      });
      res.json({
        success: true,
        message: "User updated successfully",
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      console.error("Error updating user:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
};

module.exports = usersController;