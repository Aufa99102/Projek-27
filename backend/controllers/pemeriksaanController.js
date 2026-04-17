const {
  addActivity,
  createItem,
  deleteItem,
  getItems,
  updateItem,
} = require("../data/store");
const { validateIbuRelation } = require("./helpers");

const getPemeriksaan = (req, res) => {
  res.json(getItems("pemeriksaan"));
};

const createPemeriksaan = (req, res) => {
  const {
    ibu_id,
    tanggal_kunjungan,
    usia_kehamilan,
    tekanan_darah,
    berat_badan,
    hasil_pemeriksaan,
    terapi,
    keterangan,
    tanggal_kembali,
  } = req.body;
  const relationError = validateIbuRelation(ibu_id);

  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const newItem = createItem("pemeriksaan", {
    ibu_id: Number(ibu_id),
    tanggal_kunjungan: tanggal_kunjungan || "",
    usia_kehamilan: usia_kehamilan || "",
    tekanan_darah: tekanan_darah || "",
    berat_badan: berat_badan || "",
    hasil_pemeriksaan: hasil_pemeriksaan || "",
    terapi: terapi || "",
    keterangan: keterangan || "",
    tanggal_kembali: tanggal_kembali || "",
  });

  addActivity(`Pemeriksaan ANC untuk ibu_id ${newItem.ibu_id} ditambahkan.`);
  return res.status(201).json(newItem);
};

const updatePemeriksaan = (req, res) => {
  const { id } = req.params;
  const {
    ibu_id,
    tanggal_kunjungan,
    usia_kehamilan,
    tekanan_darah,
    berat_badan,
    hasil_pemeriksaan,
    terapi,
    keterangan,
    tanggal_kembali,
  } = req.body;
  const relationError = validateIbuRelation(ibu_id);

  if (relationError) {
    return res.status(400).json({ message: relationError });
  }

  const updatedItem = updateItem("pemeriksaan", id, {
    ibu_id: Number(ibu_id),
    tanggal_kunjungan: tanggal_kunjungan || "",
    usia_kehamilan: usia_kehamilan || "",
    tekanan_darah: tekanan_darah || "",
    berat_badan: berat_badan || "",
    hasil_pemeriksaan: hasil_pemeriksaan || "",
    terapi: terapi || "",
    keterangan: keterangan || "",
    tanggal_kembali: tanggal_kembali || "",
  });

  if (!updatedItem) {
    return res.status(404).json({ message: "Data pemeriksaan tidak ditemukan." });
  }

  addActivity(`Pemeriksaan ANC untuk ibu_id ${updatedItem.ibu_id} diperbarui.`);
  return res.json(updatedItem);
};

const deletePemeriksaan = (req, res) => {
  const { id } = req.params;
  const deletedItem = deleteItem("pemeriksaan", id);

  if (!deletedItem) {
    return res.status(404).json({ message: "Data pemeriksaan tidak ditemukan." });
  }

  addActivity(`Pemeriksaan ANC untuk ibu_id ${deletedItem.ibu_id} dihapus.`);
  return res.json({ message: "Data pemeriksaan berhasil dihapus." });
};

module.exports = {
  createPemeriksaan,
  deletePemeriksaan,
  getPemeriksaan,
  updatePemeriksaan,
};
