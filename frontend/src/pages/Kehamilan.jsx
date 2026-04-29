import React, { useState } from "react";
import EntityPage from "../components/EntityPage";
import "../styles/Kehamilan.css";

const fields = [
  { name: "ibu_id", label: "Pilih Ibu", type: "select-ibu", required: true },
  { name: "hpht", label: "Tanggal HPHT", type: "date", required: true },
  { name: "hpl", label: "Tanggal HPL", type: "date", required: true },
  { name: "jarak_kehamilan", label: "Jarak Kehamilan", required: true, numericOnly: true },
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
  { name: "bb_sebelum_hamil", label: "BB Sebelum Hamil", required: true, numericOnly: true, allowDecimal: true },
  { name: "imt", label: "IMT", required: true, numericOnly: true, allowDecimal: true },
];

const KATEGORI_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "kurang_dari_3_bulan", label: "< 3 Bulan" },
  { value: "kurang_dari_7_bulan", label: "< 7 Bulan" },
  { value: "tujuh_bulan_ke_atas", label: ">= 7 Bulan" },
];

const STATUS_IBU_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "baru", label: "Ibu hamil baru" },
  { value: "lama", label: "Ibu hamil lama" },
];

const STATUS_HIV_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "Reaktif", label: "Reaktif" },
  { value: "Non-reaktif", label: "Non-reaktif" },
];

const STATUS_SIFILIS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "Positif", label: "Positif" },
  { value: "Negatif", label: "Negatif" },
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getStartOfLocalDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    const dayFirstMatch = trimmedValue.match(/^(\d{2})-(\d{2})-(\d{4})$/);

    if (dayFirstMatch) {
      const [, day, month, year] = dayFirstMatch;
      const parsedDayFirstDate = new Date(Number(year), Number(month) - 1, Number(day));
      return Number.isNaN(parsedDayFirstDate.getTime()) ? null : parsedDayFirstDate;
    }
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : getStartOfLocalDay(parsedDate);
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

  const usiaKehamilanMinggu = Math.floor((now - hphtDate) / DAY_IN_MS / 7);
  const usiaKehamilanHari = Math.floor((now - hphtDate) / DAY_IN_MS);

  if (usiaKehamilanHari < 0 || usiaKehamilanMinggu < 0) {
    return {
      hari: null,
      minggu: null,
      bulan: null,
      usia_kehamilan_label: "HPHT belum valid",
    };
  }

  const usiaKehamilanBulan = Math.floor(usiaKehamilanHari / 30);

  return {
    hari: usiaKehamilanHari,
    minggu: usiaKehamilanMinggu,
    bulan: usiaKehamilanBulan,
    usia_kehamilan_label: `${usiaKehamilanMinggu} minggu (${usiaKehamilanBulan} bulan)`,
  };
};

const tentukanKategoriKehamilan = (usiaKehamilanBulan) => {
  if (usiaKehamilanBulan === null || usiaKehamilanBulan < 0) {
    return {
      kategori_kehamilan: "unknown",
      kategori_kehamilan_label: "Belum diketahui",
    };
  } else if (usiaKehamilanBulan < 3) {
    return {
      kategori_kehamilan: "kurang_dari_3_bulan",
      kategori_kehamilan_label: "Kurang dari 3 bulan",
    };
  } else if (usiaKehamilanBulan < 7) {
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
  } else if (usiaKehamilanMinggu < 12) {
    return {
      trimester: "1",
      trimester_label: "Trimester 1",
    };
  } else if (usiaKehamilanMinggu <= 27) {
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
  if (value === "baru") {
    return "Ibu hamil baru";
  }

  if (value === "lama") {
    return "Ibu hamil lama";
  }

  return value || "Belum diketahui";
};

const normalizeHivStatus = (value) => {
  if (value === "Negatif") {
    return "Non-reaktif";
  }

  return value || "";
};

const getKategoriTone = (value) => {
  if (value === "kurang_dari_3_bulan") {
    return "info";
  }

  if (value === "kurang_dari_7_bulan") {
    return "warning";
  }

  if (value === "tujuh_bulan_ke_atas") {
    return "success";
  }

  return "neutral";
};

function Kehamilan() {
  const [filters, setFilters] = useState({
    kategori: "all",
    statusIbu: "all",
    statusHiv: "all",
    statusSifilis: "all",
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
          record.status_ibu === "baru" ? "info" : "neutral"
        ),
    },
    {
      key: "status_hiv",
      label: "HIV",
      render: (record) =>
        renderBadge(
          record.status_hiv || "Belum diisi",
          record.status_hiv
            ? record.status_hiv === "Reaktif"
              ? "danger"
              : "success"
            : "neutral"
        ),
    },
    {
      key: "status_sifilis",
      label: "Sifilis",
      render: (record) =>
        renderBadge(
          record.status_sifilis || "Belum diisi",
          record.status_sifilis
            ? record.status_sifilis === "Positif"
              ? "danger"
              : "success"
            : "neutral"
        ),
    },
    { key: "hpht", label: "Tanggal HPHT" },
    { key: "hpl", label: "Tanggal HPL" },
    { key: "jarak_kehamilan", label: "Jarak" },
    { key: "status_imunisasi", label: "Imunisasi" },
    { key: "riwayat_penyakit", label: "Riwayat Penyakit" },
    { key: "bb_sebelum_hamil", label: "BB Awal" },
    { key: "imt", label: "IMT" },
  ];

  const updateFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      kategori: "all",
      statusIbu: "all",
      statusHiv: "all",
      statusSifilis: "all",
    });
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
          const usiaKehamilan = hitungUsiaKehamilan(record.hpht);
          const kategoriKehamilan = tentukanKategoriKehamilan(usiaKehamilan.bulan);
          const trimesterInfo = tentukanTrimester(usiaKehamilan.minggu);

          return {
            ...record,
            ibu_nama: ibu ? ibu.nama : `Ibu ID ${record.ibu_id}`,
            status_ibu: ibu?.status_ibu || "",
            status_hiv: normalizeHivStatus(ibu?.status_hiv),
            status_sifilis: ibu?.status_sifilis || "",
            ...usiaKehamilan,
            ...kategoriKehamilan,
            ...trimesterInfo,
          };
        }}
        filterRecords={(records) =>
          records.filter((record) =>
            (filters.kategori === "all" ||
              record.kategori_kehamilan === filters.kategori) &&
            (filters.statusIbu === "all" ||
              record.status_ibu === filters.statusIbu) &&
            (filters.statusHiv === "all" ||
              record.status_hiv === filters.statusHiv) &&
            (filters.statusSifilis === "all" ||
              record.status_sifilis === filters.statusSifilis)
          )
        }
        renderTableControls={({ records, displayedRecords }) => (
          <div className="trimester-filter-card">
            <div className="trimester-filter-summary">
              <p className="filter-label">Multi-filter data kehamilan</p>
              <strong>
                {displayedRecords.length} dari {records.length} data tampil
              </strong>
            </div>
            <div className="trimester-filter-grid">
              <label className="trimester-filter-field">
                <span>Lama Kehamilan</span>
                <select
                  value={filters.kategori}
                  onChange={(event) => updateFilter("kategori", event.target.value)}
                >
                  {KATEGORI_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="trimester-filter-field">
                <span>Status Ibu</span>
                <select
                  value={filters.statusIbu}
                  onChange={(event) => updateFilter("statusIbu", event.target.value)}
                >
                  {STATUS_IBU_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="trimester-filter-field">
                <span>Status HIV</span>
                <select
                  value={filters.statusHiv}
                  onChange={(event) => updateFilter("statusHiv", event.target.value)}
                >
                  {STATUS_HIV_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="trimester-filter-field">
                <span>Status Sifilis</span>
                <select
                  value={filters.statusSifilis}
                  onChange={(event) =>
                    updateFilter("statusSifilis", event.target.value)
                  }
                >
                  {STATUS_SIFILIS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="trimester-filter-group">
              {KATEGORI_OPTIONS.slice(1).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={
                    filters.kategori === option.value
                      ? "trimester-filter-button active"
                      : "trimester-filter-button"
                  }
                  onClick={() => updateFilter("kategori", option.value)}
                >
                  {option.label}
                </button>
              ))}
              <button
                type="button"
                className="trimester-filter-button reset"
                onClick={resetFilters}
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default Kehamilan;
