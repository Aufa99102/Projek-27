const express = require("express");

const {
  GetDataLab,
  GetDataLabById,
  CreateDataLab,
  UpdateDataLab,
  DeleteDataLab,
} = require("../controllers/labController");

const router = express.Router();

// GET ALL
router.get("/", GetDataLab);

// GET BY ID
router.get("/:id", GetDataLabById);

// CREATE
router.post("/", CreateDataLab);

// UPDATE
router.put("/:id", UpdateDataLab);

// DELETE
router.delete("/:id", DeleteDataLab);

module.exports = router;