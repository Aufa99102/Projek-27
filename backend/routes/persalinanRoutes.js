const express = require("express");
const {
  TampilDataPersalinan,
  CreateDataPersalinan,
  UpdateDataPersalinan,
  DeleteDataPersalinan,
} = require("../controllers/persalinanController");

const router = express.Router();

router.get("/", TampilDataPersalinan);
router.post("/", CreateDataPersalinan);
router.put("/:id", UpdateDataPersalinan);
router.delete("/:id", DeleteDataPersalinan);

module.exports = router;
