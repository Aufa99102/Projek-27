const {
  addActivity,
  createItem,
  deleteItem,
  getItems,
  updateItem,
} = require("../data/store");
const { normalizeArrayField, validateIbuRelation } = require("./helpers");

const getKehamilan = (req, res) => {
  res.json(getItems("kehamilan"));
};

const createKehamilan = (req, res) => {
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

  const relationError = validateIbuRelation(ibu_id);
  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const newItem = createItem("kehamilan", {
    ibu_id: Number(ibu_id),
    hpht: hpht || "",
    hpl: hpl || "",
    jarak_kehamilan: jarak_kehamilan || "",
    status_imunisasi: normalizeArrayField(status_imunisasi),
    riwayat_penyakit: riwayat_penyakit || "",
    bb_sebelum_hamil: bb_sebelum_hamil || "",
    imt: imt || "",
  });

  addActivity(`Data kehamilan untuk ibu_id ${newItem.ibu_id} ditambahkan.`);
  return res.status(201).json(newItem);
};

const updateKehamilan = (req, res) => {
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

  const relationError = validateIbuRelation(ibu_id);
  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const updatedItem = updateItem("kehamilan", id, {
    ibu_id: Number(ibu_id),
    hpht: hpht || "",
    hpl: hpl || "",
    jarak_kehamilan: jarak_kehamilan || "",
    status_imunisasi: normalizeArrayField(status_imunisasi),
    riwayat_penyakit: riwayat_penyakit || "",
    bb_sebelum_hamil: bb_sebelum_hamil || "",
    imt: imt || "",
  });

  if (!updatedItem) {
    return res.status(404).json({ message: "Data kehamilan tidak ditemukan." });
  }

  addActivity(`Data kehamilan untuk ibu_id ${updatedItem.ibu_id} diperbarui.`);
  return res.json(updatedItem);
};

const deleteKehamilan = (req, res) => {
  const { id } = req.params;
  const deletedItem = deleteItem("kehamilan", id);

  if (!deletedItem) {
    return res.status(404).json({ message: "Data kehamilan tidak ditemukan." });
  }

  addActivity(`Data kehamilan untuk ibu_id ${deletedItem.ibu_id} dihapus.`);
  return res.json({ message: "Data kehamilan berhasil dihapus." });
};

module.exports = {
  createKehamilan,
  deleteKehamilan,
  getKehamilan,
  updateKehamilan,
};
