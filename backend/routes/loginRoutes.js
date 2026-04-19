const express = require("express");
const { login, regist } = require("../controllers/loginController");

const router = express.Router();

router.post("/register",regist)
router.post("/", login);

module.exports = router;
