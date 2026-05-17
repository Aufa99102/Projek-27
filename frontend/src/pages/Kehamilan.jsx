import React, { useState } from "react";
import CustomSelect from "../components/CustomSelect";
import EntityPage from "../components/EntityPage";
import "../styles/Kehamilan.css";

const fields = [
  { name: "ibu_id", label: "Pilih Ibu", type: "select-ibu", required: true },
  { name: "hpht", label: "Tanggal HPHT", type: "date", required: true },
  { name: "hpl", label: "Tanggal HPL", type: "date", required: true },
  {
    name: "jarak_kehamilan",
    label: "Jarak Kehamilan (tahun)",
    required: true,
    numericOnly: true,
    allowDecimal: true,
  },
  {
    name: "status_imunisasi",
    label: "Status Imunisasi",
    required: true,
    placeholder: "Contoh: TT1, TT2",
  },
  {
    name: "riwayat_penyakit",
    label: "Riwayat Penyakit",
    type: "textarea",
    required: true,
  },
  {
    name: "bb_sebelum_hamil",
    label: "BB Sebelum Hamil",
    required: true,
    numericOnly: true,
    allowDecimal: true,
  },
  {
    name: "imt",
    label: "IMT",
    required: true,
    numericOnly: true,
    allowDecimal: true,
  },
];

const KATEGORI_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "kurang_dari_3_bulan", label: "< 3 Bulan" },
  { value: "kurang_dari_7_bulan", label: "< 7 Bulan" },
  { value: "tujuh_bulan_ke_atas", label: ">= 7 Bulan" },
];

const STATUS_IBU_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "Kunjungan Baru", label: "Kunjungan Baru" },
  { value: "Kunjungan Lama", label: "Kunjungan Lama" },
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getStartOfLocalDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const parseDate = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    const cleanValue = value.split("T")[0];

    if (cleanValue === "0000-00-00") return null;

    const parsed = new Date(cleanValue);

    if (!Number.isNaN(parsed.getTime())) {
      return getStartOfLocalDay(parsed);
    }
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return getStartOfLocalDay(parsedDate);
};

const hitungUsiaKehamilan = (hpht) => {
  const now = getStartOfLocalDay(new Date());
  const hphtDate = parseDate(hpht);

  if (!hphtDate) {
    return {
      minggu: null,
      bulan: null,
      usia_kehamilan_label: "Belum diketahui",
    };
  }

  const hari = Math.floor((now - hphtDate) / DAY_IN_MS);
  const minggu = Math.floor(hari / 7);
  const bulan = Math.floor(hari / 30);

  if (hari < 0) {
    return {
      hari: null,
      minggu: null,
      bulan: null,
      usia_kehamilan_label: "HPHT belum valid",
    };
  }

  return {
    hari,
    minggu,
    bulan,
    usia_kehamilan_label: `${minggu} minggu (${bulan} bulan)`,
  };
};

const tentukanKategoriKehamilan = (usiaKehamilanBulan) => {
  if (usiaKehamilanBulan === null || usiaKehamilanBulan < 0) {
    return {
      kategori_kehamilan: "unknown",
      kategori_kehamilan_label: "Belum diketahui",
    };
  }

  if (usiaKehamilanBulan < 3) {
    return {
      kategori_kehamilan: "kurang_dari_3_bulan",
      kategori_kehamilan_label: "Kurang dari 3 bulan",
    };
  }

  if (usiaKehamilanBulan < 7) {
    return {
      kategori_kehamilan: "kurang_dari_7_bulan",
      kategori_kehamilan_label: "Kurang dari 7 bulan",
    };
  }

  return {
    kategori_kehamilan: "tujuh_bulan_ke_atas",
    kategori_kehamilan_label: "7 bulan ke atas",
  };
};

const tentukanTrimester = (usiaKehamilanMinggu) => {
  if (usiaKehamilanMinggu === null || usiaKehamilanMinggu < 0) {
    return {
      trimester: "unknown",
      trimester_label: "Belum diketahui",
    };
  }

  if (usiaKehamilanMinggu < 12) {
    return {
      trimester: "1",
      trimester_label: "Trimester 1",
    };
  }

  if (usiaKehamilanMinggu <= 27) {
    return {
      trimester: "2",
      trimester_label: "Trimester 2",
    };
  }

  return {
    trimester: "3",
    trimester_label: "Trimester 3",
  };
};

const renderBadge = (label, tone) => (
  <span className={`status-badge ${tone}`}>{label}</span>
);

const getStatusIbuLabel = (value) => {
  if (value === "baru" || value === "Kunjungan Baru") {
    return "Kunjungan Baru";
  }

  if (
    value === "lama" ||
    value === "Kunjungan Lama" ||
    value === "Lama Kunjungan"
  ) {
    return "Kunjungan Lama";
  }

  return value || "Belum diketahui";
};

const getKategoriTone = (value) => {
  if (value === "kurang_dari_3_bulan") return "info";
  if (value === "kurang_dari_7_bulan") return "warning";
  if (value === "tujuh_bulan_ke_atas") return "success";
  return "neutral";
};

function Kehamilan() {
  const [filters, setFilters] = useState({
    kategori: "all",
    statusIbu: "all",
  });

  const columns = [
    { key: "nomor", label: "Nomor" },
    { key: "ibu_nama", label: "Nama Ibu" },
    { key: "usia_kehamilan_label", label: "Usia Kehamilan" },
    {
      key: "kategori_kehamilan_label",
      label: "Kategori",
      render: (record) =>
        renderBadge(
          record.kategori_kehamilan_label,
          getKategoriTone(record.kategori_kehamilan)
        ),
    },
    { key: "trimester_label", label: "Trimester" },
    {
      key: "status_ibu",
      label: "Status Ibu",
      render: (record) =>
        renderBadge(
          getStatusIbuLabel(record.status_ibu),
          getStatusIbuLabel(record.status_ibu) === "Kunjungan Baru"
            ? "info"
            : "neutral"
        ),
    },
    { key: "hpht", label: "Tanggal HPHT" },
    { key: "hpl", label: "Tanggal HPL" },
    { key: "jarak_kehamilan", label: "Jarak (tahun)" },
    { key: "status_imunisasi", label: "Imunisasi" },
    { key: "riwayat_penyakit", label: "Riwayat Penyakit" },
    { key: "bb_sebelum_hamil", label: "BB Awal" },
    { key: "imt", label: "IMT" },
  ];

  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ kategori: "all", statusIbu: "all" });
  };

  return (
    <div className="page-theme kehamilan-page">
      <EntityPage
        title="Riwayat Kehamilan"
        description="Simpan informasi kehamilan aktif dan faktor risiko dasar ibu."
        endpoint="/kehamilan"
        fields={fields}
        columns={columns}

        transformRecord={(record, { ibuOptions }) => {
  const ibu = ibuOptions.find(
    (item) => String(item.id) === String(record.ibu_id)
  );

  return {
    ...record,
    ibu_nama: ibu ? ibu.nama : `Ibu ID ${record.ibu_id}`,

    // langsung pakai dari backend
    usia_kehamilan_minggu: record.usia_kehamilan_minggu,
    usia_kehamilan_bulan: record.usia_kehamilan_bulan,
    usia_kehamilan_label: record.usia_kehamilan_label,

    kategori_kehamilan: record.kategori_kehamilan,
    trimester: record.trimester,

    status_ibu: ibu?.status_ibu || "",
    };
  }
}
      />
    </div>
  );
}

export default Kehamilan;