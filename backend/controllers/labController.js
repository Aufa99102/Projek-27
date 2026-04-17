const {
  addActivity,
  createItem,
  deleteItem,
  getItems,
  updateItem,
} = require("../data/store");
const { validateIbuRelation } = require("./helpers");

const getLab = (req, res) => {
  res.json(getItems("lab"));
};

const createLab = (req, res) => {
  const { ibu_id, hb, albumin, hbsag, hiv } = req.body;
  const relationError = validateIbuRelation(ibu_id);

  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const newItem = createItem("lab", {
    ibu_id: Number(ibu_id),
    hb: hb || "",
    albumin: albumin || "",
    hbsag: hbsag || "",
    hiv: hiv || "",
  });

  addActivity(`Data lab untuk ibu_id ${newItem.ibu_id} ditambahkan.`);
  return res.status(201).json(newItem);
};

const updateLab = (req, res) => {
  const { id } = req.params;
  const { ibu_id, hb, albumin, hbsag, hiv } = req.body;
  const relationError = validateIbuRelation(ibu_id);

  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const updatedItem = updateItem("lab", id, {
    ibu_id: Number(ibu_id),
    hb: hb || "",
    albumin: albumin || "",
    hbsag: hbsag || "",
    hiv: hiv || "",
  });

  if (!updatedItem) {
    return res.status(404).json({ message: "Data lab tidak ditemukan." });
  }

  addActivity(`Data lab untuk ibu_id ${updatedItem.ibu_id} diperbarui.`);
  return res.json(updatedItem);
};

const deleteLab = (req, res) => {
  const { id } = req.params;
  const deletedItem = deleteItem("lab", id);

  if (!deletedItem) {
    return res.status(404).json({ message: "Data lab tidak ditemukan." });
  }

  addActivity(`Data lab untuk ibu_id ${deletedItem.ibu_id} dihapus.`);
  return res.json({ message: "Data lab berhasil dihapus." });
};

module.exports = {
  createLab,
  deleteLab,
  getLab,
  updateLab,
};
