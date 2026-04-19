const express = require("express");
const {
  GetDataEdukasi,
  CreateDataEdukasi,
  UpdateDataEdukasi,
  DeleteDataEdukasi,
} = require("../controllers/edukasiController");

const router = express.Router();

router.get("/", GetDataEdukasi);
router.post("/", CreateDataEdukasi);
router.put("/:id", UpdateDataEdukasi);
router.delete("/:id", DeleteDataEdukasi);

module.exports = router;
