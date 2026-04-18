const {db} = require("../config/db");

// GET ALL
const TampilDataIbu = async (req, res, next) => {
  try {
    const query = "SELECT * FROM ibu";
    const [rows] = await db.execute(query);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data ibu",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE
const CreateDataIbu = async (req, res, next) => {
  try {
    const {
      nama,
      tanggal_lahir,
      nama_suami,
      alamat,
      no_hp,
      nik,
      no_jkn,
      no_rekam_medis,
      golongan_darah,
    } = req.body;

    if (!nama || !tanggal_lahir || !nik) {
      return res.status(400).json({
        status: "error",
        message: "Field nama, tanggal_lahir, dan nik wajib diisi",
      });
    }

    const query = `
      INSERT INTO ibu 
      (nama, tanggal_lahir, nama_suami, alamat, no_hp, nik, no_jkn, no_rekam_medis, golongan_darah)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      nama,
      tanggal_lahir,
      nama_suami || "",
      alamat || "",
      no_hp || "",
      nik,
      no_jkn || "",
      no_rekam_medis || "",
      golongan_darah || "",
    ]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data ibu",
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const UpdateDataIbu = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      nama,
      tanggal_lahir,
      nama_suami,
      alamat,
      no_hp,
      nik,
      no_jkn,
      no_rekam_medis,
      golongan_darah,
    } = req.body;

    if (!nama || !tanggal_lahir || !nik) {
      return res.status(400).json({
        status: "error",
        message: "Field nama, tanggal_lahir, dan nik wajib diisi",
      });
    }

    const query = `
      UPDATE ibu 
      SET nama=?, tanggal_lahir=?, nama_suami=?, alamat=?, no_hp=?, nik=?, no_jkn=?, no_rekam_medis=?, golongan_darah=?
      WHERE id=?
    `;

    const [result] = await db.execute(query, [
      nama,
      tanggal_lahir,
      nama_suami || "",
      alamat || "",
      no_hp || "",
      nik,
      no_jkn || "",
      no_rekam_medis || "",
      golongan_darah || "",
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data ibu tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil update data ibu",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const DeleteDataIbu = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM ibu WHERE id = ?";
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data ibu tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil delete data ibu",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  TampilDataIbu,
  CreateDataIbu,
  UpdateDataIbu,
  DeleteDataIbu,
};