const db = require("../config/db");
const { validateIbuRelation } = require("./helpers");

// GET ALL
const TampilDataUsg = async (req, res, next) => {
  try {
    const query = "SELECT * FROM usg";
    const [rows] = await db.execute(query);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data USG",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE
const CreateDataUsg = async (req, res, next) => {
  try {
    const {
      ibu_id,
      trimester,
      gs,
      crl,
      djj,
      letak_janin,
      taksiran_persalinan,
    } = req.body;

    const relationError = await validateIbuRelation(ibu_id);
    if (relationError) {
      return res.status(400).json({
        status: "error",
        message: relationError,
      });
    }

    const query = `
      INSERT INTO usg
      (ibu_id, trimester, gs, crl, djj, letak_janin, taksiran_persalinan)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      ibu_id,
      trimester || "",
      gs || "",
      crl || "",
      djj || "",
      letak_janin || "",
      taksiran_persalinan || "",
    ]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data USG",
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const UpdateDataUsg = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      ibu_id,
      trimester,
      gs,
      crl,
      djj,
      letak_janin,
      taksiran_persalinan,
    } = req.body;

    const relationError = await validateIbuRelation(ibu_id);
    if (relationError) {
      return res.status(400).json({
        status: "error",
        message: relationError,
      });
    }

    const query = `
      UPDATE usg
      SET ibu_id=?, trimester=?, gs=?, crl=?, djj=?, letak_janin=?, taksiran_persalinan=?
      WHERE id=?
    `;

    const [result] = await db.execute(query, [
      ibu_id,
      trimester || "",
      gs || "",
      crl || "",
      djj || "",
      letak_janin || "",
      taksiran_persalinan || "",
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data USG tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil update data USG",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const DeleteDataUsg = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM usg WHERE id = ?";
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data USG tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil delete data USG",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  TampilDataUsg,
  CreateDataUsg,
  UpdateDataUsg,
  DeleteDataUsg,
};