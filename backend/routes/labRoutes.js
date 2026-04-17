const express = require("express");
const {
  createLab,
  deleteLab,
  getLab,
  updateLab,
} = require("../controllers/labController");

const router = express.Router();

router.get("/", getLab);
router.post("/", createLab);
router.put("/:id", updateLab);
router.delete("/:id", deleteLab);

module.exports = router;
