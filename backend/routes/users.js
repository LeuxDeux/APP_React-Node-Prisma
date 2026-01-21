const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserByID);
router.post("/", usersController.createUser);
router.delete("/:id", usersController.deleteUserByID);
router.put("/:id", usersController.updateUser);

module.exports = router;
