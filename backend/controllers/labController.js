const { db } = require("../config/db");
const { isBlank, validateIbuRelation } = require("./helpers");

const GOLDAR_OPTIONS = ["A", "B", "AB", "O"];
const ALBUMIN_OPTIONS = ["Negatif", "Positif"];
const HBSAG_OPTIONS = ["Reaktif", "Non-Reaktif"];
const PROTEIN_URINA_OPTIONS = ["+1", "+2", "+3"];
const HIV_OPTIONS = ["Reaktif", "Non-Reaktif"];
const SIFILIS_OPTIONS = ["Positif", "Negatif"];

// FIX: tambah .trim() agar spasi tidak menyebabkan validasi gagal
const validateEnum = (value, options, label) => {
  if (isBlank(value)) return null;

  const normalized = String(value).trim();

  return options.includes(normalized)
    ? null
    : `${label} harus salah satu dari: ${options.join(", ")}`;
};

// Helper: normalisasi string field (trim whitespace)
const norm = (value) => (isBlank(value) ? null : String(value).trim());

const validateLabPayload = async (payload) => {
  const {
    ibu_id,
    golongan_darah,
    gds,
    hiv,
    sifilis,
    hb,
    penyakit,
    protein_urina,
    albumin,
    hbsag,
  } = payload;

  if (isBlank(ibu_id) || isBlank(golongan_darah) || isBlank(hb)) {
    return "Field ibu, golongan darah, dan HB wajib terisi";
  }

  const relationError = await validateIbuRelation(ibu_id);
  if (relationError) return relationError;

  return (
    validateEnum(golongan_darah, GOLDAR_OPTIONS, "Golongan darah") ||
    validateEnum(albumin, ALBUMIN_OPTIONS, "Albumin") ||
    validateEnum(hbsag, HBSAG_OPTIONS, "HBSAG") ||
    validateEnum(protein_urina, PROTEIN_URINA_OPTIONS, "Protein Urina") ||
    validateEnum(hiv, HIV_OPTIONS, "HIV") ||
    validateEnum(sifilis, SIFILIS_OPTIONS, "Sifilis")
  );
};

// GET ALL
const GetDataLab = async (req, res, next) => {
  try {
    const query = `
      SELECT
        l.*,
        i.nama AS ibu_nama
      FROM lab l
      LEFT JOIN ibu i ON i.id = l.ibu_id
    `;

    const [rows] = await db.execute(query);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data lab",
      data: rows,
    });
  } catch (error) {
    console.error("GET LAB ERROR:", error);
    next(error);
  }
};

// GET BY ID
const GetDataLabById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        l.*,
        i.nama AS ibu_nama
      FROM lab l
      LEFT JOIN ibu i ON i.id = l.ibu_id
      WHERE l.id = ?
    `;

    const [rows] = await db.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data lab tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil detail data lab",
      data: rows[0],
    });
  } catch (error) {
    console.error("GET LAB BY ID ERROR:", error);
    next(error);
  }
};

// CREATE
const CreateDataLab = async (req, res, next) => {
  try {
    const validationError = await validateLabPayload(req.body);

    if (validationError) {
      return res.status(400).json({
        status: "error",
        message: validationError,
      });
    }

    const {
      ibu_id,
      golongan_darah,
      gds,
      hiv,
      sifilis,
      hb,
      penyakit,
      protein_urina,
      albumin,
      hbsag,
    } = req.body;

    const query = `
      INSERT INTO lab
      (
        ibu_id,
        golongan_darah,
        gds,
        hiv,
        sifilis,
        hb,
        penyakit,
        protein_urina,
        albumin,
        hbsag
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // FIX: gunakan norm() agar value yang disimpan sudah bersih dari whitespace
    await db.execute(query, [
      ibu_id,
      norm(golongan_darah),
      norm(gds),
      norm(hiv),
      norm(sifilis),
      hb,
      norm(penyakit),
      norm(protein_urina),
      norm(albumin),
      norm(hbsag),
    ]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data lab",
    });
  } catch (error) {
    console.error("CREATE LAB ERROR:", error);
    next(error);
  }
};

// UPDATE
const UpdateDataLab = async (req, res, next) => {
  try {
    const { id } = req.params;

    const validationError = await validateLabPayload(req.body);

    if (validationError) {
      return res.status(400).json({
        status: "error",
        message: validationError,
      });
    }

    const {
      ibu_id,
      golongan_darah,
      gds,
      hiv,
      sifilis,
      hb,
      penyakit,
      protein_urina,
      albumin,
      hbsag,
    } = req.body;

    const query = `
      UPDATE lab
      SET
        ibu_id=?,
        golongan_darah=?,
        gds=?,
        hiv=?,
        sifilis=?,
        hb=?,
        penyakit=?,
        protein_urina=?,
        albumin=?,
        hbsag=?
      WHERE id=?
    `;

    // FIX: gunakan norm() agar value yang disimpan sudah bersih dari whitespace
    const [result] = await db.execute(query, [
      ibu_id,
      norm(golongan_darah),
      norm(gds),
      norm(hiv),
      norm(sifilis),
      hb,
      norm(penyakit),
      norm(protein_urina),
      norm(albumin),
      norm(hbsag),
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
    console.error("UPDATE LAB ERROR:", error);
    next(error);
  }
};

// DELETE
const DeleteDataLab = async (req, res, next) => {
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
    console.error("DELETE LAB ERROR:", error);
    next(error);
  }
};

module.exports = {
  GetDataLab,
  GetDataLabById,
  CreateDataLab,
  UpdateDataLab,
  DeleteDataLab,
};