const { db } = require("../config/db");
const {
  isBlank,
  normalizeArrayField,
  normalizeDateForDatabase,
  normalizeRowsDateFieldsForClient,
  validateIbuRelation,
} = require("./helpers");

// =========================
// GET ALL KEHAMILAN (FIXED)
// =========================
const GetDataKehamilan = async (req, res, next) => {
  try {
    const query = `
 SELECT
  k.*,

  -- usia minggu (AMAN)
  TIMESTAMPDIFF(
    WEEK,
    NULLIF(k.hpht, '0000-00-00'),
    CURDATE()
  ) AS usia_kehamilan_minggu,

  -- usia bulan (AMAN)
  TIMESTAMPDIFF(
    MONTH,
    NULLIF(k.hpht, '0000-00-00'),
    CURDATE()
  ) AS usia_kehamilan_bulan,

  -- label usia (AMAN TOTAL)
  CASE
    WHEN k.hpht IS NULL OR k.hpht = '0000-00-00' THEN 'Belum diketahui'
    ELSE CONCAT(
      TIMESTAMPDIFF(WEEK, k.hpht, CURDATE()),
      ' minggu (',
      TIMESTAMPDIFF(MONTH, k.hpht, CURDATE()),
      ' bulan)'
    )
  END AS usia_kehamilan_label,

  -- kategori
  CASE
    WHEN k.hpht IS NULL OR k.hpht = '0000-00-00' THEN 'belum_diketahui'
    WHEN TIMESTAMPDIFF(WEEK, k.hpht, CURDATE()) <= 11 THEN 'kurang_dari_3_bulan'
    WHEN TIMESTAMPDIFF(WEEK, k.hpht, CURDATE()) <= 27 THEN 'kurang_dari_7_bulan'
    ELSE 'tujuh_bulan_ke_atas'
  END AS kategori_kehamilan,

  -- label kategori
  CASE
    WHEN k.hpht IS NULL OR k.hpht = '0000-00-00' THEN 'Belum diketahui'
    WHEN TIMESTAMPDIFF(WEEK, k.hpht, CURDATE()) <= 11 THEN '< 3 bulan'
    WHEN TIMESTAMPDIFF(WEEK, k.hpht, CURDATE()) <= 27 THEN '< 7 bulan'
    ELSE '>= 7 bulan'
  END AS kategori_kehamilan_label,

  -- trimester
  CASE
    WHEN k.hpht IS NULL OR k.hpht = '0000-00-00' THEN 'belum_diketahui'
    WHEN TIMESTAMPDIFF(WEEK, k.hpht, CURDATE()) <= 13 THEN 'Trimester I'
    WHEN TIMESTAMPDIFF(WEEK, k.hpht, CURDATE()) <= 27 THEN 'Trimester II'
    ELSE 'Trimester III'
  END AS trimester_label

FROM kehamilan k;
`;

    const [rows] = await db.execute(query);

    const normalizedRows = normalizeRowsDateFieldsForClient(
      rows,
      ["hpht", "hpl"]
    );

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data kehamilan",
      data: normalizedRows,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// CREATE
// =========================
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

    const normalizedHpht = normalizeDateForDatabase(hpht);
    const normalizedHpl = normalizeDateForDatabase(hpl);

    if (
      isBlank(ibu_id) ||
      !normalizedHpht ||
      !normalizedHpl ||
      isBlank(bb_sebelum_hamil) ||
      isBlank(imt)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Field dasar kehamilan (HPHT, HPL, BB, IMT) wajib terisi",
      });
    }

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
      normalizedHpht,
      normalizedHpl,
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

// =========================
// UPDATE
// =========================
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

    const normalizedHpht = normalizeDateForDatabase(hpht);
    const normalizedHpl = normalizeDateForDatabase(hpl);

    if (
      isBlank(ibu_id) ||
      !normalizedHpht ||
      !normalizedHpl ||
      isBlank(bb_sebelum_hamil) ||
      isBlank(imt)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Field dasar kehamilan (HPHT, HPL, BB, IMT) wajib terisi",
      });
    }

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
      normalizedHpht,
      normalizedHpl,
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

// =========================
// DELETE
// =========================
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
  GetDataKehamilan,
  CreateDataKehamilan,
  UpdateDataKehamilan,
  DeleteDataKehamilan,
};