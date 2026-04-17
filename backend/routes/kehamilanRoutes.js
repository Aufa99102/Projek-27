const express = require("express");

const {
  TampilDataKehamilan,
  CreateDataKehamilan,
  UpdateDataKehamilan,
  DeleteDataKehamilan,
} = require("../controllers/kehamilanController");

const router = express.Router();

router.get("/", TampilDataKehamilan);
router.post("/", CreateDataKehamilan);
router.put("/:id", UpdateDataKehamilan);
router.delete("/:id", DeleteDataKehamilan);

module.exports = router;