const express = require("express");
const {
  createKehamilan,
  deleteKehamilan,
  getKehamilan,
  updateKehamilan,
} = require("../controllers/kehamilanController");

const router = express.Router();

router.get("/", getKehamilan);
router.post("/", createKehamilan);
router.put("/:id", updateKehamilan);
router.delete("/:id", deleteKehamilan);

module.exports = router;
