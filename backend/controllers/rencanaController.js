const {
  addActivity,
  createItem,
  deleteItem,
  getItems,
  updateItem,
} = require("../data/store");
const { normalizeArrayField, validateIbuRelation } = require("./helpers");

const getRencana = (req, res) => {
  res.json(getItems("rencana"));
};

const createRencana = (req, res) => {
  const {
    ibu_id,
    penolong,
    tempat,
    pendamping,
    transportasi,
    calon_donor,
  } = req.body;
  const relationError = validateIbuRelation(ibu_id);

  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const newItem = createItem("rencana", {
    ibu_id: Number(ibu_id),
    penolong: penolong || "",
    tempat: tempat || "",
    pendamping: pendamping || "",
    transportasi: transportasi || "",
    calon_donor: normalizeArrayField(calon_donor),
  });

  addActivity(`Rencana persalinan untuk ibu_id ${newItem.ibu_id} ditambahkan.`);
  return res.status(201).json(newItem);
};

const updateRencana = (req, res) => {
  const { id } = req.params;
  const {
    ibu_id,
    penolong,
    tempat,
    pendamping,
    transportasi,
    calon_donor,
  } = req.body;
  const relationError = validateIbuRelation(ibu_id);

  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const updatedItem = updateItem("rencana", id, {
    ibu_id: Number(ibu_id),
    penolong: penolong || "",
    tempat: tempat || "",
    pendamping: pendamping || "",
    transportasi: transportasi || "",
    calon_donor: normalizeArrayField(calon_donor),
  });

  if (!updatedItem) {
    return res.status(404).json({ message: "Rencana persalinan tidak ditemukan." });
  }

  addActivity(`Rencana persalinan untuk ibu_id ${updatedItem.ibu_id} diperbarui.`);
  return res.json(updatedItem);
};

const deleteRencana = (req, res) => {
  const { id } = req.params;
  const deletedItem = deleteItem("rencana", id);

  if (!deletedItem) {
    return res.status(404).json({ message: "Rencana persalinan tidak ditemukan." });
  }

  addActivity(`Rencana persalinan untuk ibu_id ${deletedItem.ibu_id} dihapus.`);
  return res.json({ message: "Rencana persalinan berhasil dihapus." });
};

module.exports = {
  createRencana,
  deleteRencana,
  getRencana,
  updateRencana,
};
