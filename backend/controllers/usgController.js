const {
  addActivity,
  createItem,
  deleteItem,
  getItems,
  updateItem,
} = require("../data/store");
const { validateIbuRelation } = require("./helpers");

const getUsg = (req, res) => {
  res.json(getItems("usg"));
};

const createUsg = (req, res) => {
  const {
    ibu_id,
    trimester,
    gs,
    crl,
    djj,
    letak_janin,
    taksiran_persalinan,
  } = req.body;
  const relationError = validateIbuRelation(ibu_id);

  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const newItem = createItem("usg", {
    ibu_id: Number(ibu_id),
    trimester: trimester || "",
    gs: gs || "",
    crl: crl || "",
    djj: djj || "",
    letak_janin: letak_janin || "",
    taksiran_persalinan: taksiran_persalinan || "",
  });

  addActivity(`Data USG untuk ibu_id ${newItem.ibu_id} ditambahkan.`);
  return res.status(201).json(newItem);
};

const updateUsg = (req, res) => {
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
  const relationError = validateIbuRelation(ibu_id);

  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const updatedItem = updateItem("usg", id, {
    ibu_id: Number(ibu_id),
    trimester: trimester || "",
    gs: gs || "",
    crl: crl || "",
    djj: djj || "",
    letak_janin: letak_janin || "",
    taksiran_persalinan: taksiran_persalinan || "",
  });

  if (!updatedItem) {
    return res.status(404).json({ message: "Data USG tidak ditemukan." });
  }

  addActivity(`Data USG untuk ibu_id ${updatedItem.ibu_id} diperbarui.`);
  return res.json(updatedItem);
};

const deleteUsg = (req, res) => {
  const { id } = req.params;
  const deletedItem = deleteItem("usg", id);

  if (!deletedItem) {
    return res.status(404).json({ message: "Data USG tidak ditemukan." });
  }

  addActivity(`Data USG untuk ibu_id ${deletedItem.ibu_id} dihapus.`);
  return res.json({ message: "Data USG berhasil dihapus." });
};

module.exports = {
  createUsg,
  deleteUsg,
  getUsg,
  updateUsg,
};
