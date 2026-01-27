const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// CORRECCIÓN AQUÍ: Agregue las llaves { }
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", authController.loginUser);

router.get("/me", verifyToken, authController.validateToken);

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "Access to protected profile route granted",
    user: req.user,
  });
});

module.exports = router;
