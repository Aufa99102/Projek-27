-- KI-Care backend revision: Data Ibu, Lab, USG, and dashboard fields.
-- Run this migration after backing up the current database.

ALTER TABLE ibu
  ADD COLUMN IF NOT EXISTS status_tt ENUM('1','2','3','4','5') NULL AFTER lila,
  ADD COLUMN IF NOT EXISTS jenis_kunjungan ENUM('K1','K6','K8') NULL AFTER status_tt;

ALTER TABLE ibu
  MODIFY COLUMN golongan_darah ENUM('A','B','AB','O') NULL,
  MODIFY COLUMN status_ibu ENUM('Kunjungan Baru','Kunjungan Lama','baru','lama') NOT NULL DEFAULT 'Kunjungan Baru';

UPDATE ibu
SET status_ibu = CASE
  WHEN status_ibu = 'baru' THEN 'Kunjungan Baru'
  WHEN status_ibu = 'lama' THEN 'Kunjungan Lama'
  ELSE status_ibu
END;

ALTER TABLE lab
  ADD COLUMN IF NOT EXISTS golongan_darah ENUM('A','B','AB','O') NULL AFTER ibu_id,
  ADD COLUMN IF NOT EXISTS gds VARCHAR(50) NULL AFTER golongan_darah,
  ADD COLUMN IF NOT EXISTS sifilis VARCHAR(50) NULL AFTER hiv,
  ADD COLUMN IF NOT EXISTS penyakit VARCHAR(255) NULL AFTER hb,
  ADD COLUMN IF NOT EXISTS protein_urina ENUM('+1','+2','+3') NULL AFTER penyakit;

ALTER TABLE lab
  MODIFY COLUMN albumin ENUM('Negatif','Positif') NULL,
  MODIFY COLUMN hbsag ENUM('Reaktif','Non-Reaktif') NULL,
  MODIFY COLUMN hiv ENUM('Reaktif','Non-Reaktif','Negatif','Positif') NULL;

INSERT INTO lab (
  ibu_id,
  golongan_darah,
  gds,
  hiv,
  sifilis,
  hb,
  penyakit,
  protein_urina,
  albumin,
  hbsag
)
SELECT
  i.id,
  i.golongan_darah,
  CAST(i.gds AS CHAR),
  CASE
    WHEN i.status_hiv IN ('Negatif', 'Non-reaktif') THEN 'Non-Reaktif'
    WHEN i.status_hiv = 'Reaktif' THEN 'Reaktif'
    ELSE NULL
  END,
  i.status_sifilis,
  CAST(i.hb AS CHAR),
  '',
  NULL,
  NULL,
  NULL
FROM ibu i
WHERE NOT EXISTS (
  SELECT 1
  FROM lab l
  WHERE l.ibu_id = i.id
);

UPDATE ibu
SET
  status_tt = COALESCE(status_tt, '1'),
  jenis_kunjungan = COALESCE(jenis_kunjungan, 'K1');

ALTER TABLE usg
  MODIFY COLUMN gs VARCHAR(50) NOT NULL,
  MODIFY COLUMN crl VARCHAR(50) NOT NULL,
  MODIFY COLUMN letak_janin ENUM('Intrauterin','Ekstrauterin') NOT NULL;

-- Optional cleanup after confirming Lab data has migrated correctly:
-- ALTER TABLE ibu
--   DROP COLUMN status_hiv,
--   DROP COLUMN status_sifilis,
--   DROP COLUMN hb,
--   DROP COLUMN gds;
