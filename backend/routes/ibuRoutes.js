const express = require("express");
const {
  createIbu,
  deleteIbu,
  getIbu,
  updateIbu,
} = require("../controllers/ibuController");

const router = express.Router();

router.get("/", getIbu);
router.post("/", createIbu);
router.put("/:id", updateIbu);
router.delete("/:id", deleteIbu);

module.exports = router;
