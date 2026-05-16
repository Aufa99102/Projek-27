const { db } = require("../config/db");

const {
  isBlank,
  normalizeDateForDatabase,
  normalizeRowsDateFieldsForClient,
  validateIbuRelation,
} = require("./helpers");

// GET ALL
const GetDataPemeriksaan = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        p.*,
        i.nama AS ibu_nama,
        i.status_ibu
      FROM pemeriksaan_anc p
      LEFT JOIN ibu i ON i.id = p.ibu_id
      ORDER BY p.id ASC
    `;

    const [rows] = await db.execute(query);

    const normalizedRows =
      normalizeRowsDateFieldsForClient(rows, [
        "tanggal_kunjungan",
        "tanggal_kembali",
      ]);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data pemeriksaan",
      data: normalizedRows,
    });
  } catch (error) {
    console.error("GET PEMERIKSAAN ERROR:", error);
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

    const normalizedTanggalKunjungan =
      normalizeDateForDatabase(tanggal_kunjungan);

    const normalizedTanggalKembali =
      normalizeDateForDatabase(tanggal_kembali);

    // VALIDASI
    if (
      isBlank(ibu_id) ||
      isBlank(tanggal_kunjungan) ||
      isBlank(usia_kehamilan) ||
      isBlank(tekanan_darah) ||
      isBlank(hasil_pemeriksaan) ||
      berat_badan === undefined ||
      berat_badan === null ||
      berat_badan === ""
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Field dasar pemeriksaan (Tanggal, Usia Kehamilan, TD, BB, Hasil) wajib terisi",
      });
    }

    // VALIDASI RELASI IBU
    const relationError = await validateIbuRelation(ibu_id);

    if (relationError) {
      return res.status(400).json({
        status: "error",
        message: relationError,
      });
    }

    const query = `
      INSERT INTO pemeriksaan_anc
      (
        ibu_id,
        tanggal_kunjungan,
        usia_kehamilan,
        tekanan_darah,
        berat_badan,
        hasil_pemeriksaan,
        terapi,
        keterangan,
        tanggal_kembali
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      ibu_id,
      normalizedTanggalKunjungan,
      usia_kehamilan,
      tekanan_darah,
      Number(berat_badan),
      hasil_pemeriksaan,
      terapi || "",
      keterangan || "",
      normalizedTanggalKembali,
    ]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data pemeriksaan",
    });
  } catch (error) {
    console.error("CREATE PEMERIKSAAN ERROR:", error);
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

    const normalizedTanggalKunjungan =
      normalizeDateForDatabase(tanggal_kunjungan);

    const normalizedTanggalKembali =
      normalizeDateForDatabase(tanggal_kembali);

    // VALIDASI
    if (
      isBlank(ibu_id) ||
      isBlank(tanggal_kunjungan) ||
      isBlank(usia_kehamilan) ||
      isBlank(tekanan_darah) ||
      isBlank(hasil_pemeriksaan) ||
      berat_badan === undefined ||
      berat_badan === null ||
      berat_badan === ""
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Field dasar pemeriksaan (Tanggal, Usia Kehamilan, TD, BB, Hasil) wajib terisi",
      });
    }

    // VALIDASI RELASI IBU
    const relationError = await validateIbuRelation(ibu_id);

    if (relationError) {
      return res.status(400).json({
        status: "error",
        message: relationError,
      });
    }

    const query = `
      UPDATE pemeriksaan_anc
      SET
        ibu_id=?,
        tanggal_kunjungan=?,
        usia_kehamilan=?,
        tekanan_darah=?,
        berat_badan=?,
        hasil_pemeriksaan=?,
        terapi=?,
        keterangan=?,
        tanggal_kembali=?
      WHERE id=?
    `;

    const [result] = await db.execute(query, [
      ibu_id,
      normalizedTanggalKunjungan,
      usia_kehamilan,
      tekanan_darah,
      Number(berat_badan),
      hasil_pemeriksaan,
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
    console.error("UPDATE PEMERIKSAAN ERROR:", error);
    next(error);
  }
};

// DELETE
const DeleteDataPemeriksaan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query =
      "DELETE FROM pemeriksaan_anc WHERE id = ?";

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
    console.error("DELETE PEMERIKSAAN ERROR:", error);
    next(error);
  }
};

module.exports = {
  GetDataPemeriksaan,
  CreateDataPemeriksaan,
  UpdateDataPemeriksaan,
  DeleteDataPemeriksaan,
};