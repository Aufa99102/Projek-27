const express = require("express");
const {
  createEdukasi,
  deleteEdukasi,
  getEdukasi,
  updateEdukasi,
} = require("../controllers/edukasiController");

const router = express.Router();

router.get("/", getEdukasi);
router.post("/", createEdukasi);
router.put("/:id", updateEdukasi);
router.delete("/:id", deleteEdukasi);

module.exports = router;
