const express = require("express");

const {
  TampilData,
  CreateData,
  UpdateData,
  DeleteData,
} = require("../controllers/labController");

const router = express.Router();

router.get("/", TampilData);
router.post("/", CreateData);
router.put("/:id", UpdateData);
router.delete("/:id", DeleteData);

module.exports = router;