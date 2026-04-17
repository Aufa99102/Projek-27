const {
  addActivity,
  createItem,
  deleteItem,
  getItems,
  updateItem,
} = require("../data/store");

const getIbu = (req, res) => {
  res.json(getItems("ibu"));
};

const createIbu = (req, res) => {
  const {
    nama,
    tanggal_lahir,
    nama_suami,
    alamat,
    no_hp,
    nik,
    no_jkn,
    no_rekam_medis,
    golongan_darah,
  } = req.body;

  if (!nama || !tanggal_lahir || !nik) {
    return res.status(400).json({
      message: "Field nama, tanggal_lahir, dan nik wajib diisi.",
    });
  }

  const newIbu = createItem("ibu", {
    nama,
    tanggal_lahir,
    nama_suami: nama_suami || "",
    alamat: alamat || "",
    no_hp: no_hp || "",
    nik,
    no_jkn: no_jkn || "",
    no_rekam_medis: no_rekam_medis || "",
    golongan_darah: golongan_darah || "",
  });

  addActivity(`Data ibu ${newIbu.nama} ditambahkan.`);
  return res.status(201).json(newIbu);
};

const updateIbu = (req, res) => {
  const { id } = req.params;
  const {
    nama,
    tanggal_lahir,
    nama_suami,
    alamat,
    no_hp,
    nik,
    no_jkn,
    no_rekam_medis,
    golongan_darah,
  } = req.body;

  if (!nama || !tanggal_lahir || !nik) {
    return res.status(400).json({
      message: "Field nama, tanggal_lahir, dan nik wajib diisi.",
    });
  }

  const updatedIbu = updateItem("ibu", id, {
    nama,
    tanggal_lahir,
    nama_suami: nama_suami || "",
    alamat: alamat || "",
    no_hp: no_hp || "",
    nik,
    no_jkn: no_jkn || "",
    no_rekam_medis: no_rekam_medis || "",
    golongan_darah: golongan_darah || "",
  });

  if (!updatedIbu) {
    return res.status(404).json({ message: "Data ibu tidak ditemukan." });
  }

  addActivity(`Data ibu ${updatedIbu.nama} diperbarui.`);
  return res.json(updatedIbu);
};

const deleteIbu = (req, res) => {
  const { id } = req.params;
  const deletedIbu = deleteItem("ibu", id);

  if (!deletedIbu) {
    return res.status(404).json({ message: "Data ibu tidak ditemukan." });
  }

  addActivity(`Data ibu ${deletedIbu.nama} dihapus.`);
  return res.json({ message: "Data ibu berhasil dihapus." });
};

module.exports = {
  createIbu,
  deleteIbu,
  getIbu,
  updateIbu,
};
