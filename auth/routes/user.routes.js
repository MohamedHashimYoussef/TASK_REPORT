const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/auth.controllers");

router.post("/", userControllers.createUser);
router.get("/verify/:email", userControllers.verifyEmail);
router.post("/login", userControllers.loginUser);
router.get("/mail/:id", userControllers.getMail);

module.exports = router;
