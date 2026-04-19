const express = require("express");
const {
  GetDataPemeriksaan,
  CreateDataPemeriksaan,
  UpdateDataPemeriksaan,
  DeleteDataPemeriksaan,
} = require("../controllers/pemeriksaanController");

const router = express.Router();

router.get("/", GetDataPemeriksaan);
router.post("/", CreateDataPemeriksaan);
router.put("/:id", UpdateDataPemeriksaan);
router.delete("/:id", DeleteDataPemeriksaan);

module.exports = router;
