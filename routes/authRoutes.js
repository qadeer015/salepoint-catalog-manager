const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/sign-in", (req, res) => res.render("auth/signin"));
router.get("/sign-up", (req, res) => res.render("auth/signup"));
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;