const express = require("express");
const {
  GetDataRencana,
  CreateDataRencana,
  UpdateDataRencana,
  DeleteDataRencana,
} = require("../controllers/rencanaController");

const router = express.Router();

router.get("/", GetDataRencana);
router.post("/", CreateDataRencana);
router.put("/:id", UpdateDataRencana);
router.delete("/:id", DeleteDataRencana);

module.exports = router;
