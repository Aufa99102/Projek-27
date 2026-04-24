export const PDF_MODULE_REQUIREMENTS = [
  {
    key: "ibu",
    label: "Data Ibu",
    fields: [
      "nama",
      "tanggal_lahir",
      "nama_suami",
      "alamat",
      "no_hp",
      "nik",
      "no_jkn",
      "no_rekam_medis",
      "golongan_darah",
      "hb",
      "lila",
      "gds",
      "status_hiv",
      "status_sifilis",
      "status_ibu",
    ],
  },
  {
    key: "kehamilan",
    label: "Kehamilan",
    fields: [
      "hpht",
      "hpl",
      "jarak_kehamilan",
      "status_imunisasi",
      "riwayat_penyakit",
      "bb_sebelum_hamil",
      "imt",
    ],
  },
  {
    key: "pemeriksaan",
    label: "Pemeriksaan ANC",
    fields: [
      "tanggal_kunjungan",
      "usia_kehamilan",
      "tekanan_darah",
      "berat_badan",
      "hasil_pemeriksaan",
      "terapi",
      "keterangan",
      "tanggal_kembali",
    ],
  },
  {
    key: "lab",
    label: "Lab",
    fields: ["hb", "albumin", "hbsag", "hiv"],
  },
  {
    key: "persalinan",
    label: "Persalinan",
    fields: ["jenis_persalinan", "komplikasi", "bb_bayi", "kelainan"],
  },
  {
    key: "rencana",
    label: "Rencana",
    fields: ["penolong", "tempat", "pendamping", "transportasi", "calon_donor"],
  },
  {
    key: "usg",
    label: "USG",
    fields: ["trimester", "gs", "crl", "djj", "letak_janin", "taksiran_persalinan"],
  },
];

export const DATA_IBU_REQUIRED_FIELDS = PDF_MODULE_REQUIREMENTS.find(
  (module) => module.key === "ibu"
)?.fields || [];

export const isFilledValue = (value) => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim() !== "";
  }

  return true;
};

export const isRecordComplete = (record, requiredFields = []) => {
  if (!record) {
    return false;
  }

  return requiredFields.every((field) => isFilledValue(record[field]));
};

export const isPdfReady = (record, requiredFields = DATA_IBU_REQUIRED_FIELDS) =>
  isRecordComplete(record, requiredFields);

const getLatestCompleteRecord = (records, requiredFields) =>
  [...records].reverse().find((record) => isRecordComplete(record, requiredFields)) || null;

export const getPdfReadinessSummary = (ibuRecord, datasets = {}) => {
  const missingModules = [];
  const selectedRecords = {
    ibu: ibuRecord || null,
  };

  if (!isRecordComplete(ibuRecord, DATA_IBU_REQUIRED_FIELDS)) {
    missingModules.push("Data Ibu");
  }

  PDF_MODULE_REQUIREMENTS.filter((module) => module.key !== "ibu").forEach((module) => {
    const relatedRecords = (datasets[module.key] || []).filter(
      (record) => String(record.ibu_id) === String(ibuRecord?.id)
    );
    const completeRecord = getLatestCompleteRecord(relatedRecords, module.fields);

    selectedRecords[module.key] = completeRecord;

    if (!completeRecord) {
      missingModules.push(module.label);
    }
  });

  return {
    ready: missingModules.length === 0,
    missingModules,
    selectedRecords,
  };
};

export const formatMissingModulesMessage = (missingModules = []) => {
  if (missingModules.length === 0) {
    return "";
  }

  return `Output PDF belum bisa digunakan. Lengkapi modul berikut terlebih dahulu: ${missingModules.join(
    ", "
  )}.`;
};

