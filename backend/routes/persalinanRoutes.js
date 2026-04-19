const express = require("express");
const {
  GetDataPersalinan,
  CreateDataPersalinan,
  UpdateDataPersalinan,
  DeleteDataPersalinan,
} = require("../controllers/persalinanController");

const router = express.Router();

router.get("/", GetDataPersalinan);
router.post("/", CreateDataPersalinan);
router.put("/:id", UpdateDataPersalinan);
router.delete("/:id", DeleteDataPersalinan);

module.exports = router;
