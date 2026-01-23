const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

// RUTAS PROTEGIDAS TODAS
router.get("/", verifyToken, verifyAdmin, usersController.getAllUsers);
router.get("/:id", verifyToken, verifyAdmin, usersController.getUserByID);
router.post("/", verifyToken, verifyAdmin, usersController.createUser);
router.delete("/:id", verifyToken, verifyAdmin, usersController.deleteUserByID);
router.put("/:id", verifyToken, verifyAdmin, usersController.updateUser);
module.exports = router;
