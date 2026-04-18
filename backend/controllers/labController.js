const {db} = require("../config/db");
const { validateIbuRelation } = require("./helpers");

// GET ALL
const TampilData = async (req, res, next) => {
  try {
    const query = "SELECT * FROM lab";
    const [rows] = await db.execute(query);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data lab",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE
const CreateData = async (req, res, next) => {
  try {
    const { ibu_id, hb, albumin, hbsag, hiv } = req.body;

    const relationError = await validateIbuRelation(ibu_id);
    if (relationError) {
      return res.status(400).json({
        status: "error",
        message: relationError,
      });
    }

    const query = `
      INSERT INTO lab (ibu_id, hb, albumin, hbsag, hiv)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      ibu_id,
      hb || "",
      albumin || "",
      hbsag || "",
      hiv || "",
    ]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data lab",
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const UpdateData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ibu_id, hb, albumin, hbsag, hiv } = req.body;

    const relationError = await validateIbuRelation(ibu_id);
    if (relationError) {
      return res.status(400).json({
        status: "error",
        message: relationError,
      });
    }

    const query = `
      UPDATE lab
      SET ibu_id=?, hb=?, albumin=?, hbsag=?, hiv=?
      WHERE id=?
    `;

    const [result] = await db.execute(query, [
      ibu_id,
      hb || "",
      albumin || "",
      hbsag || "",
      hiv || "",
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data lab tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil update data lab",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const DeleteData = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM lab WHERE id = ?";
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data lab tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil delete data lab",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  TampilData,
  CreateData,
  UpdateData,
  DeleteData,
};