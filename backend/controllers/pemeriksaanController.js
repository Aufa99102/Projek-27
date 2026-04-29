const {db} = require("../config/db");
const {
  isBlank,
  normalizeDateForDatabase,
  normalizeRowsDateFieldsForClient,
  validateIbuRelation,
} = require("./helpers");

// GET ALL
const GetDataPemeriksaan = async (req, res, next) => {
  try {
    const query = "SELECT * FROM pemeriksaan_anc";
    const [rows] = await db.execute(query);
    const normalizedRows = normalizeRowsDateFieldsForClient(rows, [
      "tanggal_kunjungan",
      "tanggal_kembali",
    ]);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data pemeriksaan",
      data: normalizedRows,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE
const CreateDataPemeriksaan = async (req, res, next) => {
  try {
    const {
      ibu_id,
      tanggal_kunjungan,
      usia_kehamilan,
      tekanan_darah,
      berat_badan,
      hasil_pemeriksaan,
      terapi,
      keterangan,
      tanggal_kembali,
    } = req.body;

    const normalizedTanggalKunjungan = normalizeDateForDatabase(tanggal_kunjungan);
    const normalizedTanggalKembali = normalizeDateForDatabase(tanggal_kembali);

    if (
      isBlank(ibu_id) ||
      !normalizedTanggalKunjungan ||
      isBlank(usia_kehamilan) ||
      isBlank(tekanan_darah) ||
      isBlank(berat_badan) ||
      isBlank(hasil_pemeriksaan) ||
      isBlank(terapi) ||
      isBlank(keterangan) ||
      !normalizedTanggalKembali
    ) {
      return res.status(400).json({
        status: "error",
        message: "Semua Field wajib terisi",
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
      INSERT INTO pemeriksaan_anc
      (ibu_id, tanggal_kunjungan, usia_kehamilan, tekanan_darah, berat_badan, hasil_pemeriksaan, terapi, keterangan, tanggal_kembali)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      ibu_id,
      normalizedTanggalKunjungan,
      usia_kehamilan || "",
      tekanan_darah || "",
      berat_badan || "",
      hasil_pemeriksaan || "",
      terapi || "",
      keterangan || "",
      normalizedTanggalKembali,
    ]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data pemeriksaan",
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const UpdateDataPemeriksaan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      ibu_id,
      tanggal_kunjungan,
      usia_kehamilan,
      tekanan_darah,
      berat_badan,
      hasil_pemeriksaan,
      terapi,
      keterangan,
      tanggal_kembali,
    } = req.body;

    const normalizedTanggalKunjungan = normalizeDateForDatabase(tanggal_kunjungan);
    const normalizedTanggalKembali = normalizeDateForDatabase(tanggal_kembali);

    if (
      isBlank(ibu_id) ||
      !normalizedTanggalKunjungan ||
      isBlank(usia_kehamilan) ||
      isBlank(tekanan_darah) ||
      isBlank(berat_badan) ||
      isBlank(hasil_pemeriksaan) ||
      isBlank(terapi) ||
      isBlank(keterangan) ||
      !normalizedTanggalKembali
    ) {
      return res.status(400).json({
        status: "error",
        message: "Semua Field wajib terisi",
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
      UPDATE pemeriksaan_anc
      SET ibu_id=?, tanggal_kunjungan=?, usia_kehamilan=?, tekanan_darah=?, berat_badan=?, hasil_pemeriksaan=?, terapi=?, keterangan=?, tanggal_kembali=?
      WHERE id=?
    `;

    const [result] = await db.execute(query, [
      ibu_id,
      normalizedTanggalKunjungan,
      usia_kehamilan || "",
      tekanan_darah || "",
      berat_badan || "",
      hasil_pemeriksaan || "",
      terapi || "",
      keterangan || "",
      normalizedTanggalKembali,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data pemeriksaan tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil update data pemeriksaan",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const DeleteDataPemeriksaan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM pemeriksaan_anc WHERE id = ?";
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data pemeriksaan tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil delete data pemeriksaan",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  GetDataPemeriksaan,
  CreateDataPemeriksaan,
  UpdateDataPemeriksaan,
  DeleteDataPemeriksaan,
};
