const { db } = require("../config/db");

const getDashboard = async (req, res, next) => {
  try {
    const [ibu] = await db.execute("SELECT COUNT(*) as total FROM ibu");
    const [pemeriksaan] = await db.execute("SELECT COUNT(*) as total FROM pemeriksaan_anc");
    const [usg] = await db.execute("SELECT COUNT(*) as total FROM usg");

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil dashboard",
      data: {
        total_ibu: ibu[0].total,
        total_pemeriksaan: pemeriksaan[0].total,
        total_usg: usg[0].total,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };