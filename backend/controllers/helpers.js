const {db} = require("../config/db");

// Normalisasi array (tetap dipakai, ini bagus 👍)
const normalizeArrayField = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

// Validasi relasi ibu pakai database
const validateIbuRelation = async (ibuId) => {
  if (!ibuId) {
    return "Field ibu_id wajib diisi.";
  }

  const query = "SELECT id FROM ibu WHERE id = ?";
  const [rows] = await db.execute(query, [ibuId]);

  if (rows.length === 0) {
    return "Data ibu tidak ditemukan untuk ibu_id tersebut.";
  }

  return null;
};

module.exports = {
  normalizeArrayField,
  validateIbuRelation,
};