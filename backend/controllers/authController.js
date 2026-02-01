const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Variable de entorno
if (!process.env.JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET no está definido en el entorno.");
}

const authController = {
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: "Username and password are required",
        });
      }

      const user = await prisma.user.findUnique({
        where: { username },
      });

      // Asumimos fallo por defecto para evitar enumeración
      const validPassword = user ? await bcrypt.compare(password, user.password) : false;

      if (!user || !validPassword) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Payload mínimo necesario
      const payload = { id: user.id, username: user.username, role: user.role };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      });
    } catch (error) {
      console.error("[AuthError]:", error); // Log interno detallado
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  // Validar token y devolver datos del usuario
  validateToken: async (req, res) => {
    try {
      // El middleware authMiddleware debe extraer el user del token y guardarlo en req.user
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid token",
        });
      }

      // Obtener datos actualizados del usuario desde la BD
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, username: true, role: true },
      });

      if (!userData) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        user: userData,
      });
    } catch (error) {
      console.error("[AuthValidateError]:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
};

module.exports = authController;
