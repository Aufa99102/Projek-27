const express = require("express");
const { login, regist } = require("../controllers/loginController");

const router = express.Router();

// REGISTER
router.post("/register", regist);

// LOGIN
router.post("/login", login);

module.exports = router;