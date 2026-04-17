const express = require("express");
const {
  createPersalinan,
  deletePersalinan,
  getPersalinan,
  updatePersalinan,
} = require("../controllers/persalinanController");

const router = express.Router();

router.get("/", getPersalinan);
router.post("/", createPersalinan);
router.put("/:id", updatePersalinan);
router.delete("/:id", deletePersalinan);

module.exports = router;
