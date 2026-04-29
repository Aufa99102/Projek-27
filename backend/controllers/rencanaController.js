const { db } = require("../config/db");
const { isBlank, normalizeArrayField, validateIbuRelation } = require("./helpers");

// GET ALL
const GetDataRencana = async (req, res, next) => {
  try {
    const query = "SELECT * FROM rencana_persalinan";
    const [rows] = await db.execute(query);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data rencana persalinan",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE
const CreateDataRencana = async (req, res, next) => {
  try {
    const {
      ibu_id,
      penolong,
      tempat,
      pendamping,
      transportasi,
      calon_donor,
    } = req.body;

    if (
      isBlank(ibu_id) ||
      isBlank(penolong) ||
      isBlank(tempat) ||
      isBlank(pendamping) ||
      isBlank(transportasi) ||
      isBlank(calon_donor)
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

    const donor = normalizeArrayField(calon_donor).join(",");

    const query = `
      INSERT INTO rencana_persalinan
      (ibu_id, penolong, tempat, pendamping, transportasi, calon_donor)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      ibu_id,
      penolong || "",
      tempat || "",
      pendamping || "keluarga",
      transportasi || "",
      donor,
    ]);

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan rencana persalinan",
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const UpdateDataRencana = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      ibu_id,
      penolong,
      tempat,
      pendamping,
      transportasi,
      calon_donor,
    } = req.body;

    if (
      isBlank(ibu_id) ||
      isBlank(penolong) ||
      isBlank(tempat) ||
      isBlank(pendamping) ||
      isBlank(transportasi) ||
      isBlank(calon_donor)
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

    const donor = normalizeArrayField(calon_donor).join(",");

    const query = `
      UPDATE rencana_persalinan
      SET ibu_id=?, penolong=?, tempat=?, pendamping=?, transportasi=?, calon_donor=?
      WHERE id=?
    `;

    const [result] = await db.execute(query, [
      ibu_id,
      penolong || "",
      tempat || "",
      pendamping || "keluarga",
      transportasi || "",
      donor,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data rencana persalinan tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil update rencana persalinan",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const DeleteDataRencana = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM rencana_persalinan WHERE id = ?";
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data rencana persalinan tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil delete rencana persalinan",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  GetDataRencana,
  CreateDataRencana,
  UpdateDataRencana,
  DeleteDataRencana,
};
