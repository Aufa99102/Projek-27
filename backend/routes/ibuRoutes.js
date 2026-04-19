const express = require("express");

const {
  GetDataIbu,
  CreateDataIbu,
  UpdateDataIbu,
  DeleteDataIbu,
} = require("../controllers/ibuController");

const router = express.Router();

router.get("/", GetDataIbu);
router.post("/", CreateDataIbu);
router.put("/:id", UpdateDataIbu);
router.delete("/:id", DeleteDataIbu);

module.exports = router;