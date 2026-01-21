const pool = require("../config/database");
const bcrypt = require("bcryptjs");

const usersController = {
  getAllUsers: async (req, res) => {
    try {
      const [users] = await pool.query("SELECT * FROM users;");
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
      const [user] = await pool.query(
        "SELECT * FROM users WHERE id = ?;",
        [id],
      );
      if (user.length === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      res.json({
        success: true,
        user: user[0],
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
    if (!username || !password || !address || !phonenumber || !email || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Problemas en los campos del formulario",
      });
    }
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const query =
        "INSERT INTO users (username, password, address, phonenumber, email) VALUES (?, ?, ?, ?, ?);";
      const [result] = await pool.query(query, [
        username,
        passwordHash,
        address,
        phonenumber,
        email,
      ]);

      const queryGetUser = "SELECT * FROM users WHERE id = ?;";
      const [newUser] = await pool.query(queryGetUser, [result.insertId]);
      if(newUser.length === 0){
        return res.status(404).json({
          success: false,
          error: "User not found after creation",
        });
      }

      res.status(201).json({
        success: true,
        userId: result.insertId,
        message: "User created successfully",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
  deleteUserByID: async (req, res) => {
    const { id } = req.params;
    try {
      const query = "DELETE FROM users WHERE id = ?;";
      const [result] = await pool.query(query, [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
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
      if (
        (await pool.query("SELECT id FROM users WHERE id = ?;", [id])).length === 0
      ) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      const query =
        "UPDATE users SET username = ?, address = ?, phonenumber = ?, email = ? WHERE id = ?;";
      const [result] = await pool.query(query, [
        username,
        address,
        phonenumber,
        email,
        id
      ]);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      res.json({
        success: true,
        message: "User updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
};

module.exports = usersController;