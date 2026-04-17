const express = require("express");
const {
  TampilDataUsg,  
  CreateDataUsg,
  UpdateDataUsg,
  DeleteDataUsg,
} = require("../controllers/usgController");

const router = express.Router();

router.get("/", TampilDataUsg);
router.post("/", CreateDataUsg);
router.put("/:id", UpdateDataUsg);
router.delete("/:id", DeleteDataUsg);

module.exports = router;
