const express = require("express");
const {
  createUsg,
  deleteUsg,
  getUsg,
  updateUsg,
} = require("../controllers/usgController");

const router = express.Router();

router.get("/", getUsg);
router.post("/", createUsg);
router.put("/:id", updateUsg);
router.delete("/:id", deleteUsg);

module.exports = router;
