const db = require("../config/db");

const TampilDataEdukasi = async (req, res, next) => {
  try {
    const query = "SELECT * FROM edukasi";
    const [rows] = await db.execute(query);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data edukasi",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const CreateDataEdukasi = async (req, res, next) => {
  try {
    const { ibu_id, materi, tanggal } = req.body;

    if (!ibu_id || !materi || !tanggal) {
      return res.status(400).json({
        status: "error",
        message: "ibu_id, materi, dan tanggal wajib diisi",
      });
    }

    const cekIbu = "SELECT * FROM ibu WHERE id = ?";
    const [ibu] = await db.execute(cekIbu, [ibu_id]);

    if (ibu.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data ibu tidak ditemukan",
      });
    }

    const query = `
      INSERT INTO edukasi (ibu_id, materi, tanggal)
      VALUES (?, ?, ?)
    `;

    await db.execute(query, [ibu_id, materi, tanggal]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data edukasi",
    });
  } catch (error) {
    next(error);
  }
};

const UpdateDataEdukasi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ibu_id, materi, tanggal } = req.body;

    if (!ibu_id || !materi || !tanggal) {
      return res.status(400).json({
        status: "error",
        message: "ibu_id, materi, dan tanggal wajib diisi",
      });
    }

    const query = `
      UPDATE edukasi
      SET ibu_id = ?, materi = ?, tanggal = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [ibu_id, materi, tanggal, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data edukasi tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil update data edukasi",
    });
  } catch (error) {
    next(error);
  }
};

const DeleteDataEdukasi = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM edukasi WHERE id = ?";
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data edukasi tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil delete data edukasi",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  TampilDataEdukasi,
  CreateDataEdukasi,
  UpdateDataEdukasi,
  DeleteDataEdukasi,
};