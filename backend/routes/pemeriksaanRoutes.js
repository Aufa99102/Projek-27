const express = require("express");
const {
  createPemeriksaan,
  deletePemeriksaan,
  getPemeriksaan,
  updatePemeriksaan,
} = require("../controllers/pemeriksaanController");

const router = express.Router();

router.get("/", getPemeriksaan);
router.post("/", createPemeriksaan);
router.put("/:id", updatePemeriksaan);
router.delete("/:id", deletePemeriksaan);

module.exports = router;
