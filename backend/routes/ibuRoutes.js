const express = require("express");

const {
  TampilDataIbu,
  CreateDataIbu,
  UpdateDataIbu,
  DeleteDataIbu,
} = require("../controllers/ibuController");

const router = express.Router();

router.get("/", TampilDataIbu);
router.post("/", CreateDataIbu);
router.put("/:id", UpdateDataIbu);
router.delete("/:id", DeleteDataIbu);

module.exports = router;