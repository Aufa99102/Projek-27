const express = require("express");
const {
  GetDataUsg,  
  CreateDataUsg,
  UpdateDataUsg,
  DeleteDataUsg,
} = require("../controllers/usgController");

const router = express.Router();

router.get("/", GetDataUsg);
router.post("/", CreateDataUsg);
router.put("/:id", UpdateDataUsg);
router.delete("/:id", DeleteDataUsg);

module.exports = router;
