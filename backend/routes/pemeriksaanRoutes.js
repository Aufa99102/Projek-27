const express = require("express");
const {
  TampilDataPemeriksaan,
  CreateDataPemeriksaan,
  UpdateDataPemeriksaan,
  DeleteDataPemeriksaan,
} = require("../controllers/pemeriksaanController");

const router = express.Router();

router.get("/", TampilDataPemeriksaan);
router.post("/", CreateDataPemeriksaan);
router.put("/:id", UpdateDataPemeriksaan);
router.delete("/:id", DeleteDataPemeriksaan);

module.exports = router;
