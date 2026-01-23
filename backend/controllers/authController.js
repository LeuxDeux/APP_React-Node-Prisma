const pool = require("../config/database");
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

      const [users] = await pool.query(
        "SELECT id, username, password FROM users WHERE username = ?",
        [username],
      );

      // Asumimos fallo por defecto para evitar enumeración
      const user = users[0];
      const validPassword = user
        ? await bcrypt.compare(password, user.password)
        : false;

      if (!user || !validPassword) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Payload mínimo necesario
      const payload = { id: user.id, username: user.username };

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
};

module.exports = authController;
