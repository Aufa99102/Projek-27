const { db } = require("../config/db");
const {
  isBlank,
  normalizeDateForDatabase,
  normalizeRowsDateFieldsForClient,
} = require("./helpers");

const GOLDAR_OPTIONS = ["A", "B", "AB", "O"];
const STATUS_TT_OPTIONS = ["1", "2", "3", "4", "5"];
const JENIS_KUNJUNGAN_OPTIONS = ["K1", "K6", "K8"];
const STATUS_IBU_OPTIONS = [
  "Kunjungan Baru",
  "Lama Kunjungan",
  "Kunjungan Lama",
  "baru",
  "lama",
];

const normalizeStatusIbu = (value) => {
  if (value === "baru") return "Kunjungan Baru";
  if (value === "lama" || value === "Kunjungan Lama") return "Lama Kunjungan";
  return value || "Kunjungan Baru";
};

const validateEnum = (value, options, label) => {
  if (isBlank(value)) return null;
  return options.includes(String(value))
    ? null
    : `${label} harus salah satu dari: ${options.join(", ")}`;
};

// GET ALL
const GetDataIbu = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        id, nama, tanggal_lahir, nama_suami, alamat,
        no_hp, nik, no_jkn, no_rekam_medis, golongan_darah,
        lila, status_tt, jenis_kunjungan, status_ibu,
        created_at
      FROM ibu
    `;

    const [rows] = await db.execute(query);
    const normalizedRows = normalizeRowsDateFieldsForClient(rows, ["tanggal_lahir"]).map(
      (row) => ({
        ...row,
        status_ibu: normalizeStatusIbu(row.status_ibu),
      })
    );

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data ibu",
      data: normalizedRows,
    });
  } catch (error) {
    console.error("GET IBU ERROR:", error);
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
      lila,
      status_tt,
      jenis_kunjungan,
      status_ibu,
    } = req.body;

    const normalizedTanggalLahir = normalizeDateForDatabase(tanggal_lahir);
    const normalizedStatusIbu = normalizeStatusIbu(status_ibu);

    if (
      isBlank(nama) ||
      !normalizedTanggalLahir ||
      isBlank(nik)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Field Nama, Tanggal Lahir, dan NIK wajib terisi",
      });
    }

    const enumError =
      validateEnum(golongan_darah, GOLDAR_OPTIONS, "Golongan darah") ||
      validateEnum(status_tt, STATUS_TT_OPTIONS, "Status TT") ||
      validateEnum(jenis_kunjungan, JENIS_KUNJUNGAN_OPTIONS, "Jenis kunjungan") ||
      validateEnum(normalizedStatusIbu, STATUS_IBU_OPTIONS, "Status kunjungan");

    if (enumError) {
      return res.status(400).json({
        status: "error",
        message: enumError,
      });
    }

    const query = `
      INSERT INTO ibu 
      (
        nama, tanggal_lahir, nama_suami, alamat, no_hp, nik,
        no_jkn, no_rekam_medis, golongan_darah,
        lila, status_tt, jenis_kunjungan, status_ibu
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      nama,
      normalizedTanggalLahir,
      nama_suami || "",
      alamat || "",
      no_hp || "",
      nik,
      no_jkn || "",
      no_rekam_medis || "",
      golongan_darah || null,
      lila ?? null,
      status_tt || null,
      jenis_kunjungan || null,
      normalizedStatusIbu,
    ]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data ibu",
    });
  } catch (error) {
    console.error("CREATE IBU ERROR:", error);
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
      lila,
      status_tt,
      jenis_kunjungan,
      status_ibu,
    } = req.body;

    const normalizedTanggalLahir = normalizeDateForDatabase(tanggal_lahir);
    const normalizedStatusIbu = normalizeStatusIbu(status_ibu);

    if (
      isBlank(nama) ||
      !normalizedTanggalLahir ||
      isBlank(nik)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Field Nama, Tanggal Lahir, dan NIK wajib terisi",
      });
    }

    const enumError =
      validateEnum(golongan_darah, GOLDAR_OPTIONS, "Golongan darah") ||
      validateEnum(status_tt, STATUS_TT_OPTIONS, "Status TT") ||
      validateEnum(jenis_kunjungan, JENIS_KUNJUNGAN_OPTIONS, "Jenis kunjungan") ||
      validateEnum(normalizedStatusIbu, STATUS_IBU_OPTIONS, "Status kunjungan");

    if (enumError) {
      return res.status(400).json({
        status: "error",
        message: enumError,
      });
    }

    const query = `
      UPDATE ibu 
      SET 
        nama=?,
        tanggal_lahir=?,
        nama_suami=?,
        alamat=?,
        no_hp=?,
        nik=?,
        no_jkn=?,
        no_rekam_medis=?,
        golongan_darah=?,
        lila=?,
        status_tt=?,
        jenis_kunjungan=?,
        status_ibu=?
      WHERE id=?
    `;

    const [result] = await db.execute(query, [
      nama,
      normalizedTanggalLahir,
      nama_suami || "",
      alamat || "",
      no_hp || "",
      nik,
      no_jkn || "",
      no_rekam_medis || "",
      golongan_darah || null,
      lila ?? null,
      status_tt || null,
      jenis_kunjungan || null,
      normalizedStatusIbu,

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
    console.error("UPDATE IBU ERROR:", error);
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
    console.error("DELETE IBU ERROR:", error);
    next(error);
  }
};

module.exports = {
  GetDataIbu,
  CreateDataIbu,
  UpdateDataIbu,
  DeleteDataIbu,
};
