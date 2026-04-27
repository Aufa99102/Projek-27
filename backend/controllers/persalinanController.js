const { db } = require("../config/db");
const { validateIbuRelation } = require("./helpers");

// GET ALL
const GetDataPersalinan = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        id,
        ibu_id,
        jenis_persalinan,
        komplikasi,
        bb_bayi,
        kelainan,
        created_at
      FROM persalinan
    `;

    const [rows] = await db.execute(query);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data persalinan",
      data: rows,
    });
  } catch (error) {
    console.error("GET PERSALINAN ERROR:", error);
    next(error);
  }
};

// CREATE
const CreateDataPersalinan = async (req, res, next) => {
  try {
    const {
      ibu_id,
      jenis_persalinan,
      komplikasi,
      bb_bayi,
      kelainan,
    } = req.body;

    if (!ibu_id) {
      return res.status(400).json({
        status: "error",
        message: "Field ibu_id wajib diisi",
      });
    }

    const relationError = await validateIbuRelation(ibu_id);
    if (relationError) {
      return res.status(400).json({
        status: "error",
        message: relationError,
      });
    }

    const query = `
      INSERT INTO persalinan 
      (
        ibu_id,
        jenis_persalinan,
        komplikasi,
        bb_bayi,
        kelainan
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      ibu_id,
      jenis_persalinan || "Normal",
      komplikasi || "",
      bb_bayi ?? null,
      kelainan || "",
    ]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data persalinan",
    });
  } catch (error) {
    console.error("CREATE PERSALINAN ERROR:", error);
    next(error);
  }
};

// UPDATE
const UpdateDataPersalinan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      ibu_id,
      jenis_persalinan,
      komplikasi,
      bb_bayi,
      kelainan,
    } = req.body;

    if (!ibu_id) {
      return res.status(400).json({
        status: "error",
        message: "Field ibu_id wajib diisi",
      });
    }

    const relationError = await validateIbuRelation(ibu_id);
    if (relationError) {
      return res.status(400).json({
        status: "error",
        message: relationError,
      });
    }

    const query = `
      UPDATE persalinan 
      SET 
        ibu_id=?,
        jenis_persalinan=?,
        komplikasi=?,
        bb_bayi=?,
        kelainan=?
      WHERE id=?
    `;

    const [result] = await db.execute(query, [
      ibu_id,
      jenis_persalinan || "Normal",
      komplikasi || "",
      bb_bayi ?? null,
      kelainan || "",
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data persalinan tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil update data persalinan",
    });
  } catch (error) {
    console.error("UPDATE PERSALINAN ERROR:", error);
    next(error);
  }
};

// DELETE
const DeleteDataPersalinan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM persalinan WHERE id = ?";
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data persalinan tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil delete data persalinan",
    });
  } catch (error) {
    console.error("DELETE PERSALINAN ERROR:", error);
    next(error);
  }
};

module.exports = {
  GetDataPersalinan,
  CreateDataPersalinan,
  UpdateDataPersalinan,
  DeleteDataPersalinan,
};