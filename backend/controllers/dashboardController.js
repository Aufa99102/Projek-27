const { db } = require("../config/db");

const getDashboard = async (req, res, next) => {
  try {

    const [ibu] = await db.execute(`
      SELECT COUNT(*) AS total FROM ibu
    `);

    const [ibuBulanIni] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM ibu i
      LEFT JOIN (
        SELECT k1.*
        FROM kehamilan k1
        INNER JOIN (
          SELECT ibu_id, MAX(id) AS latest_id
          FROM kehamilan
          GROUP BY ibu_id
        ) latest_kehamilan ON latest_kehamilan.latest_id = k1.id
      ) kehamilan_terakhir ON kehamilan_terakhir.ibu_id = i.id
      WHERE MONTH(
        COALESCE(
          NULLIF(kehamilan_terakhir.hpht, '0000-00-00'),
          DATE(i.created_at)
        )
      ) = MONTH(CURRENT_DATE())
      AND YEAR(
        COALESCE(
          NULLIF(kehamilan_terakhir.hpht, '0000-00-00'),
          DATE(i.created_at)
        )
      ) = YEAR(CURRENT_DATE())
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
      FROM ibu i
      LEFT JOIN (
        SELECT k1.*
        FROM kehamilan k1
        INNER JOIN (
          SELECT ibu_id, MAX(id) AS latest_id
          FROM kehamilan
          GROUP BY ibu_id
        ) latest_kehamilan ON latest_kehamilan.latest_id = k1.id
      ) kehamilan_terakhir ON kehamilan_terakhir.ibu_id = i.id
      WHERE i.status_ibu = 'baru'
      AND MONTH(
        COALESCE(
          NULLIF(kehamilan_terakhir.hpht, '0000-00-00'),
          DATE(i.created_at)
        )
      ) = MONTH(CURRENT_DATE())
      AND YEAR(
        COALESCE(
          NULLIF(kehamilan_terakhir.hpht, '0000-00-00'),
          DATE(i.created_at)
        )
      ) = YEAR(CURRENT_DATE())
    `);

    const [rekapIbu] = await db.execute(`
      SELECT 
        DATE_FORMAT(source_date, '%Y-%m') AS bulan,
        COUNT(*) AS total_ibu,
        SUM(CASE WHEN status_ibu = 'baru' THEN 1 ELSE 0 END) AS ibu_baru
      FROM (
        SELECT
          i.id,
          i.status_ibu,
          COALESCE(
            NULLIF(kehamilan_terakhir.hpht, '0000-00-00'),
            DATE(i.created_at)
          ) AS source_date
        FROM ibu i
        LEFT JOIN (
          SELECT k1.*
          FROM kehamilan k1
          INNER JOIN (
            SELECT ibu_id, MAX(id) AS latest_id
            FROM kehamilan
            GROUP BY ibu_id
          ) latest_kehamilan ON latest_kehamilan.latest_id = k1.id
        ) kehamilan_terakhir ON kehamilan_terakhir.ibu_id = i.id
      ) rekap_bulanan
      WHERE source_date IS NOT NULL
      GROUP BY bulan
      ORDER BY bulan ASC
    `);

    const [hiv] = await db.execute(`
      SELECT
        CASE
          WHEN status_hiv = 'Negatif' THEN 'Non-reaktif'
          ELSE status_hiv
        END AS status_hiv,
        COUNT(*) AS total
      FROM ibu
      GROUP BY status_hiv
    `);

    const [sifilis] = await db.execute(`
      SELECT status_sifilis, COUNT(*) AS total
      FROM ibu
      GROUP BY status_sifilis
    `);

    const [kategoriKehamilan] = await db.execute(`
      SELECT kategori_kehamilan, COUNT(*) AS total
      FROM (
        SELECT
          i.id,
          CASE
            WHEN kehamilan_terakhir.hpht IS NULL
              OR kehamilan_terakhir.hpht = '0000-00-00'
              OR TIMESTAMPDIFF(WEEK, kehamilan_terakhir.hpht, CURRENT_DATE()) < 0
            THEN 'belum_diketahui'
            WHEN TIMESTAMPDIFF(WEEK, kehamilan_terakhir.hpht, CURRENT_DATE()) <= 11
            THEN 'kurang_dari_3_bulan'
            WHEN TIMESTAMPDIFF(WEEK, kehamilan_terakhir.hpht, CURRENT_DATE()) <= 27
            THEN 'kurang_dari_7_bulan'
            ELSE 'tujuh_bulan_ke_atas'
          END AS kategori_kehamilan
        FROM ibu i
        LEFT JOIN (
          SELECT k1.*
          FROM kehamilan k1
          INNER JOIN (
            SELECT ibu_id, MAX(id) AS latest_id
            FROM kehamilan
            GROUP BY ibu_id
          ) latest_kehamilan ON latest_kehamilan.latest_id = k1.id
        ) kehamilan_terakhir ON kehamilan_terakhir.ibu_id = i.id
      ) rekap_kategori
      GROUP BY kategori_kehamilan
    `);

    return res.status(200).json({
      status: "success",
      data: {
        total_ibu: ibu[0]?.total || 0,
        total_ibu_bulan_ini: ibuBulanIni[0]?.total || 0,
        total_pemeriksaan: kunjungan[0]?.total || 0,
        total_usg: usg[0]?.total || 0,
        kunjungan_bulan_ini: kunjunganBulanIni[0]?.total || 0,
        ibu_baru_bulan_ini: ibuBaru[0]?.total || 0,

        rekap_ibu_bulanan: rekapIbu,

        hiv,
        sifilis,
        kategori_kehamilan: kategoriKehamilan,
      },
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    next(error);
  }
};

module.exports = { getDashboard };
