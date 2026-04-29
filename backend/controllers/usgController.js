const {db} = require("../config/db");
const {
  isBlank,
  normalizeDateForDatabase,
  normalizeRowsDateFieldsForClient,
  validateIbuRelation,
} = require("./helpers");

// GET ALL
const GetDataUsg = async (req, res, next) => {
  try {
    const query = "SELECT * FROM usg";
    const [rows] = await db.execute(query);
    const normalizedRows = normalizeRowsDateFieldsForClient(rows, [
      "taksiran_persalinan",
    ]);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data USG",
      data: normalizedRows,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE
const CreateDataUsg = async (req, res, next) => {
  try {
    const {
      ibu_id,
      trimester,
      gs,
      crl,
      djj,
      letak_janin,
      taksiran_persalinan,
    } = req.body;

    const normalizedTaksiranPersalinan = normalizeDateForDatabase(taksiran_persalinan);

    if (
      isBlank(ibu_id) ||
      isBlank(trimester) ||
      isBlank(gs) ||
      isBlank(crl) ||
      isBlank(djj) ||
      isBlank(letak_janin) ||
      !normalizedTaksiranPersalinan
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
      INSERT INTO usg
      (ibu_id, trimester, gs, crl, djj, letak_janin, taksiran_persalinan)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      ibu_id,
      trimester || "",
      gs || "",
      crl || "",
      djj || "",
      letak_janin || "",
      normalizedTaksiranPersalinan,
    ]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data USG",
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const UpdateDataUsg = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      ibu_id,
      trimester,
      gs,
      crl,
      djj,
      letak_janin,
      taksiran_persalinan,
    } = req.body;

    const normalizedTaksiranPersalinan = normalizeDateForDatabase(taksiran_persalinan);

    if (
      isBlank(ibu_id) ||
      isBlank(trimester) ||
      isBlank(gs) ||
      isBlank(crl) ||
      isBlank(djj) ||
      isBlank(letak_janin) ||
      !normalizedTaksiranPersalinan
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
      UPDATE usg
      SET ibu_id=?, trimester=?, gs=?, crl=?, djj=?, letak_janin=?, taksiran_persalinan=?
      WHERE id=?
    `;

    const [result] = await db.execute(query, [
      ibu_id,
      trimester || "",
      gs || "",
      crl || "",
      djj || "",
      letak_janin || "",
      normalizedTaksiranPersalinan,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data USG tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil update data USG",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const DeleteDataUsg = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM usg WHERE id = ?";
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data USG tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil delete data USG",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  GetDataUsg,
  CreateDataUsg,
  UpdateDataUsg,
  DeleteDataUsg,
};
