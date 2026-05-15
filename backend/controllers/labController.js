const { db } = require("../config/db");
const { isBlank, validateIbuRelation } = require("./helpers");

const GOLDAR_OPTIONS = ["A", "B", "AB", "O"];
const ALBUMIN_OPTIONS = ["Negatif", "Positif"];
const HBSAG_OPTIONS = ["Reaktif", "Non-Reaktif"];
const PROTEIN_URINA_OPTIONS = ["+1", "+2", "+3"];

const validateEnum = (value, options, label) => {
  if (isBlank(value)) return null;

  return options.includes(String(value))
    ? null
    : `${label} harus salah satu dari: ${options.join(", ")}`;
};

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

  if (
    isBlank(ibu_id) ||
    isBlank(golongan_darah) ||
    isBlank(gds) ||
    isBlank(hiv) ||
    isBlank(sifilis) ||
    isBlank(hb) ||
    isBlank(penyakit) ||
    isBlank(protein_urina) ||
    isBlank(albumin) ||
    isBlank(hbsag)
  ) {
    return "Semua Field wajib terisi";
  }

  const relationError = await validateIbuRelation(ibu_id);
  if (relationError) return relationError;

  return (
    validateEnum(golongan_darah, GOLDAR_OPTIONS, "Golongan darah") ||
    validateEnum(albumin, ALBUMIN_OPTIONS, "Albumin") ||
    validateEnum(hbsag, HBSAG_OPTIONS, "HBSAG") ||
    validateEnum(protein_urina, PROTEIN_URINA_OPTIONS, "Protein Urina")
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
      (ibu_id, golongan_darah, gds, hiv, sifilis, hb, penyakit, protein_urina, albumin, hbsag)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
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
    ]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data lab",
    });
  } catch (error) {
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
      SET ibu_id=?, golongan_darah=?, gds=?, hiv=?, sifilis=?, hb=?, penyakit=?, protein_urina=?, albumin=?, hbsag=?
      WHERE id=?
    `;

    const [result] = await db.execute(query, [
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
    next(error);
  }
};

module.exports = {
  GetDataLab,
  CreateDataLab,
  UpdateDataLab,
  DeleteDataLab,
};
