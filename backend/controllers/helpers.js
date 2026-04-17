const { findIbuById } = require("../data/store");

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

const validateIbuRelation = (ibuId) => {
  if (!ibuId) {
    return "Field ibu_id wajib diisi.";
  }

  if (!findIbuById(ibuId)) {
    return "Data ibu tidak ditemukan untuk ibu_id tersebut.";
  }

  return null;
};

const createListHandler = (key) => (req, res) => {
  const { getItems } = require("../data/store");
  res.json(getItems(key));
};

module.exports = {
  createListHandler,
  normalizeArrayField,
  validateIbuRelation,
};
