const { db } = require("../config/db");

const getDashboard = async (req, res, next) => {
  try {

    const [ibu] = await db.execute(`
      SELECT COUNT(*) AS total FROM ibu
    `);

    const [kunjungan] = await db.execute(`
      SELECT COUNT(*) AS total FROM pemeriksaan_anc
    `);

    const [usg] = await db.execute(`
      SELECT COUNT(*) AS total FROM usg
    `);

    const [kunjunganBulanIni] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM pemeriksaan_anc
      WHERE MONTH(tanggal_kunjungan) = MONTH(CURRENT_DATE())
      AND YEAR(tanggal_kunjungan) = YEAR(CURRENT_DATE())
    `);

    const [ibuBaru] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM ibu
      WHERE status_ibu = 'baru'
      AND MONTH(created_at) = MONTH(CURRENT_DATE())
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

    const [rekapIbu] = await db.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS bulan,
        COUNT(*) AS total
      FROM ibu
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY bulan
      ORDER BY bulan ASC
    `);

    const [hiv] = await db.execute(`
      SELECT status_hiv, COUNT(*) AS total
      FROM ibu
      GROUP BY status_hiv
    `);

    const [sifilis] = await db.execute(`
      SELECT status_sifilis, COUNT(*) AS total
      FROM ibu
      GROUP BY status_sifilis
    `);

    return res.status(200).json({
      status: "success",
      data: {
        total_ibu: ibu[0]?.total || 0,
        total_pemeriksaan: kunjungan[0]?.total || 0,
        total_usg: usg[0]?.total || 0,
        kunjungan_bulan_ini: kunjunganBulanIni[0]?.total || 0,
        ibu_baru_bulan_ini: ibuBaru[0]?.total || 0,

        rekap_ibu_bulanan: rekapIbu,

        hiv,
        sifilis,
      },
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    next(error);
  }
};

module.exports = { getDashboard };