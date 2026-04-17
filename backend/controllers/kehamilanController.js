const db = require("../config/db");
const { normalizeArrayField, validateIbuRelation } = require("./helpers");

// GET ALL
const TampilDataKehamilan = async (req, res, next) => {
  try {
    const query = "SELECT * FROM kehamilan";
    const [rows] = await db.execute(query);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data kehamilan",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE
const CreateDataKehamilan = async (req, res, next) => {
  try {
    const {
      ibu_id,
      hpht,
      hpl,
      jarak_kehamilan,
      status_imunisasi,
      riwayat_penyakit,
      bb_sebelum_hamil,
      imt,
    } = req.body;

    const relationError = await validateIbuRelation(ibu_id);
    if (relationError) {
      return res.status(400).json({
        status: "error",
        message: relationError,
      });
    }

    const imunisasi = normalizeArrayField(status_imunisasi).join(",");

    const query = `
      INSERT INTO kehamilan
      (ibu_id, hpht, hpl, jarak_kehamilan, status_imunisasi, riwayat_penyakit, bb_sebelum_hamil, imt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      ibu_id,
      hpht || "",
      hpl || "",
      jarak_kehamilan || "",
      imunisasi,
      riwayat_penyakit || "",
      bb_sebelum_hamil || "",
      imt || "",
    ]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data kehamilan",
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const UpdateDataKehamilan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      ibu_id,
      hpht,
      hpl,
      jarak_kehamilan,
      status_imunisasi,
      riwayat_penyakit,
      bb_sebelum_hamil,
      imt,
    } = req.body;

    const relationError = await validateIbuRelation(ibu_id);
    if (relationError) {
      return res.status(400).json({
        status: "error",
        message: relationError,
      });
    }

    const imunisasi = normalizeArrayField(status_imunisasi).join(",");

    const query = `
      UPDATE kehamilan
      SET ibu_id=?, hpht=?, hpl=?, jarak_kehamilan=?, status_imunisasi=?, riwayat_penyakit=?, bb_sebelum_hamil=?, imt=?
      WHERE id=?
    `;

    const [result] = await db.execute(query, [
      ibu_id,
      hpht || "",
      hpl || "",
      jarak_kehamilan || "",
      imunisasi,
      riwayat_penyakit || "",
      bb_sebelum_hamil || "",
      imt || "",
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data kehamilan tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil update data kehamilan",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const DeleteDataKehamilan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM kehamilan WHERE id = ?";
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data kehamilan tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil delete data kehamilan",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  TampilDataKehamilan,
  CreateDataKehamilan,
  UpdateDataKehamilan,
  DeleteDataKehamilan,
};