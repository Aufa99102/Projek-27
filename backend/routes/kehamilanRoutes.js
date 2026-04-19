const express = require("express");

const {
  GetDataKehamilan,
  CreateDataKehamilan,
  UpdateDataKehamilan,
  DeleteDataKehamilan,
} = require("../controllers/kehamilanController");

const router = express.Router();

router.get("/", GetDataKehamilan);
router.post("/", CreateDataKehamilan);
router.put("/:id", UpdateDataKehamilan);
router.delete("/:id", DeleteDataKehamilan);

module.exports = router;