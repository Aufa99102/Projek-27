const {
  addActivity,
  createItem,
  deleteItem,
  getItems,
  updateItem,
} = require("../data/store");
const { validateIbuRelation } = require("./helpers");

const getEdukasi = (req, res) => {
  res.json(getItems("edukasi"));
};

const createEdukasi = (req, res) => {
  const { ibu_id, materi, tanggal } = req.body;
  const relationError = validateIbuRelation(ibu_id);

  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const newItem = createItem("edukasi", {
    ibu_id: Number(ibu_id),
    materi: materi || "",
    tanggal: tanggal || "",
  });

  addActivity(`Data edukasi untuk ibu_id ${newItem.ibu_id} ditambahkan.`);
  return res.status(201).json(newItem);
};

const updateEdukasi = (req, res) => {
  const { id } = req.params;
  const { ibu_id, materi, tanggal } = req.body;
  const relationError = validateIbuRelation(ibu_id);

  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const updatedItem = updateItem("edukasi", id, {
    ibu_id: Number(ibu_id),
    materi: materi || "",
    tanggal: tanggal || "",
  });

  if (!updatedItem) {
    return res.status(404).json({ message: "Data edukasi tidak ditemukan." });
  }

  addActivity(`Data edukasi untuk ibu_id ${updatedItem.ibu_id} diperbarui.`);
  return res.json(updatedItem);
};

const deleteEdukasi = (req, res) => {
  const { id } = req.params;
  const deletedItem = deleteItem("edukasi", id);

  if (!deletedItem) {
    return res.status(404).json({ message: "Data edukasi tidak ditemukan." });
  }

  addActivity(`Data edukasi untuk ibu_id ${deletedItem.ibu_id} dihapus.`);
  return res.json({ message: "Data edukasi berhasil dihapus." });
};

module.exports = {
  createEdukasi,
  deleteEdukasi,
  getEdukasi,
  updateEdukasi,
};
