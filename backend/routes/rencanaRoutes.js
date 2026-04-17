const express = require("express");
const {
  TampilDataRencana,
  CreateDataRencana,
  UpdateDataRencana,
  DeleteDataRencana,
} = require("../controllers/rencanaController");

const router = express.Router();

router.get("/", TampilDataRencana);
router.post("/", CreateDataRencana);
router.put("/:id", UpdateDataRencana);
router.delete("/:id", DeleteDataRencana);

module.exports = router;
