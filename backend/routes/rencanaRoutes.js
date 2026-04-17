const express = require("express");
const {
  createRencana,
  deleteRencana,
  getRencana,
  updateRencana,
} = require("../controllers/rencanaController");

const router = express.Router();

router.get("/", getRencana);
router.post("/", createRencana);
router.put("/:id", updateRencana);
router.delete("/:id", deleteRencana);

module.exports = router;
