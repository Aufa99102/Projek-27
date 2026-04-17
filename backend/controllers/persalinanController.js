const {
  addActivity,
  createItem,
  deleteItem,
  getItems,
  updateItem,
} = require("../data/store");
const { validateIbuRelation } = require("./helpers");

const getPersalinan = (req, res) => {
  res.json(getItems("persalinan"));
};

const createPersalinan = (req, res) => {
  const { ibu_id, jenis_persalinan, komplikasi, bb_bayi, kelainan } = req.body;
  const relationError = validateIbuRelation(ibu_id);

  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const newItem = createItem("persalinan", {
    ibu_id: Number(ibu_id),
    jenis_persalinan: jenis_persalinan || "",
    komplikasi: komplikasi || "",
    bb_bayi: bb_bayi || "",
    kelainan: kelainan || "",
  });

  addActivity(`Riwayat persalinan untuk ibu_id ${newItem.ibu_id} ditambahkan.`);
  return res.status(201).json(newItem);
};

const updatePersalinan = (req, res) => {
  const { id } = req.params;
  const { ibu_id, jenis_persalinan, komplikasi, bb_bayi, kelainan } = req.body;
  const relationError = validateIbuRelation(ibu_id);

  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const updatedItem = updateItem("persalinan", id, {
    ibu_id: Number(ibu_id),
    jenis_persalinan: jenis_persalinan || "",
    komplikasi: komplikasi || "",
    bb_bayi: bb_bayi || "",
    kelainan: kelainan || "",
  });

  if (!updatedItem) {
    return res
      .status(404)
      .json({ message: "Riwayat persalinan tidak ditemukan." });
  }

  addActivity(`Riwayat persalinan untuk ibu_id ${updatedItem.ibu_id} diperbarui.`);
  return res.json(updatedItem);
};

const deletePersalinan = (req, res) => {
  const { id } = req.params;
  const deletedItem = deleteItem("persalinan", id);

  if (!deletedItem) {
    return res
      .status(404)
      .json({ message: "Riwayat persalinan tidak ditemukan." });
  }

  addActivity(`Riwayat persalinan untuk ibu_id ${deletedItem.ibu_id} dihapus.`);
  return res.json({ message: "Riwayat persalinan berhasil dihapus." });
};

module.exports = {
  createPersalinan,
  deletePersalinan,
  getPersalinan,
  updatePersalinan,
};
