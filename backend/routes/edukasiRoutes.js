const express = require("express");
const {
  TampilDataEdukasi,
  CreateDataEdukasi,
  UpdateDataEdukasi,
  DeleteDataEdukasi,
} = require("../controllers/edukasiController");

const router = express.Router();

router.get("/", TampilDataEdukasi);
router.post("/", CreateDataEdukasi);
router.put("/:id", UpdateDataEdukasi);
router.delete("/:id", DeleteDataEdukasi);

module.exports = router;
