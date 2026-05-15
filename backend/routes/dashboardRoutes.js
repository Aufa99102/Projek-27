const express = require("express");
const { getDashboard, getTotalIbu } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", getDashboard);
router.get("/total-ibu", getTotalIbu);

module.exports = router;
