const pool = require("../config/database");
const bcrypt = require("bcryptjs");

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

      const [user] = await pool.query(
        "SELECT * FROM users AS u WHERE u.username = ?;",
        [username],
      );

      if (user.length === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user[0].password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "Invalid password",
        });
      }
      res.status(201).json({
        success: true,
        message: "Login successful",
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
};

module.exports = authController;