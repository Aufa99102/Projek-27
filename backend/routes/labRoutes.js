const express = require("express");

const {
  GetDataLab,
  CreateDataLab,
  UpdateDataLab,
  DeleteDataLab,
} = require("../controllers/labController");

const router = express.Router();

router.get("/", GetDataLab);
router.post("/", CreateDataLab);
router.put("/:id", UpdateDataLab);
router.delete("/:id", DeleteDataLab);

module.exports = router;