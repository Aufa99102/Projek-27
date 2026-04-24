import React, { useState } from "react";
import EntityPage from "../components/EntityPage";
import "../styles/DataIbu.css";

const onlyDigits = (value) => String(value || "").replace(/\D/g, "");
const normalizeSearchText = (value) => String(value || "").toLowerCase().trim();
const isValidDateValue = (value) => !value || !Number.isNaN(new Date(value).getTime());

const buildRequiredLengthValidator = (label, length) => (value) => {
  const digits = onlyDigits(value);

  if (digits.length === 0) {
    return null;
  }

  if (digits.length !== length) {
    return `${label} harus berisi ${length} digit.`;
  }

  return null;
};

const buildPhoneValidator = (value) => {
  const digits = onlyDigits(value);

  if (digits.length === 0) {
    return null;
  }

  if (digits.length < 10 || digits.length > 15) {
    return "No HP harus berisi 10 sampai 15 digit.";
  }

  return null;
};

const renderBadge = (label, tone) => (
  <span className={`status-badge ${tone}`}>{label}</span>
);

const getStatusIbuLabel = (value) => {
  if (value === "baru") return "Ibu hamil baru";
  if (value === "lama") return "Ibu hamil lama";
  return value || "-";
};

const normalizeHivStatus = (value) => {
  if (value === "Negatif") return "Non-reaktif";
  return value || "";
};

const fields = [
  {
    name: "nama",
    label: "Nama Ibu",
    required: true,
    placeholder: "Masukkan nama lengkap ibu",
  },
  {
    name: "tanggal_lahir",
    label: "Tanggal Lahir",
    type: "date",
    required: true,
    validate: (value) =>
      isValidDateValue(value) ? null : "Tanggal lahir tidak valid.",
  },
  { name: "nama_suami", label: "Nama Suami", placeholder: "Masukkan nama suami" },
  {
    name: "alamat",
    label: "Alamat",
    type: "textarea",
    placeholder: "Masukkan alamat lengkap",
  },
  {
    name: "no_hp",
    label: "No HP",
    inputMode: "numeric",
    placeholder: "Contoh: 081234567890",
    validate: buildPhoneValidator,
  },
  {
    name: "nik",
    label: "NIK",
    required: true,
    inputMode: "numeric",
    maxLength: 16,
    placeholder: "16 digit NIK",
    validate: buildRequiredLengthValidator("NIK", 16),
  },
  {
    name: "no_jkn",
    label: "No JKN",
    inputMode: "numeric",
    maxLength: 13,
    placeholder: "13 digit nomor JKN",
    validate: buildRequiredLengthValidator("No JKN", 13),
  },
  {
    name: "no_rekam_medis",
    label: "No Rekam Medis",
    placeholder: "Masukkan nomor rekam medis",
  },
  {
    name: "golongan_darah",
    label: "Golongan Darah",
    type: "select",
    options: ["A", "B", "AB", "O"],
  },
  { name: "hb", label: "HB", type: "number" },
  { name: "lila", label: "LILA", type: "number" },
  { name: "gds", label: "GDS", type: "number" },
  {
    name: "status_hiv",
    label: "Status HIV",
    type: "select",
    options: [
      { value: "Non-reaktif", label: "Non-reaktif" },
      { value: "Reaktif", label: "Reaktif" },
    ],
  },
  {
    name: "status_sifilis",
    label: "Status Sifilis",
    type: "select",
    options: [
      { value: "Negatif", label: "Negatif" },
      { value: "Positif", label: "Positif" },
    ],
  },
  {
    name: "status_ibu",
    label: "Status Ibu",
    type: "select",
    options: [
      { value: "baru", label: "Ibu hamil baru" },
      { value: "lama", label: "Ibu hamil lama" },
    ],
  },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "nama", label: "Nama" },
  {
    key: "status_ibu",
    label: "Status",
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
  { key: "tanggal_lahir", label: "Tanggal Lahir" },
  { key: "nama_suami", label: "Suami" },
  { key: "alamat", label: "Alamat" },
  { key: "no_hp", label: "No HP" },
  { key: "nik", label: "NIK" },
  { key: "no_jkn", label: "No JKN" },
  { key: "no_rekam_medis", label: "No RM" },
  { key: "golongan_darah", label: "Golda" },
  { key: "hb", label: "HB" },
  { key: "lila", label: "LILA" },
  { key: "gds", label: "GDS" },
];
function DataIbu() {
  const [filters, setFilters] = useState({
    search: "",
    statusIbu: "all",
    statusHiv: "all",
    statusSifilis: "all",
  });

  const updateFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      statusIbu: "all",
      statusHiv: "all",
      statusSifilis: "all",
    });
  };

  return (
    <div className="page-theme data-ibu-page">
      <EntityPage
        title="Data Ibu Hamil"
        description="Kelola identitas utama pasien sebagai basis seluruh relasi data kehamilan."
        endpoint="/ibu"
        fields={fields}
        columns={columns}
        requireIbuOptions={false}
        separateViews
        defaultView="table"
        filterRecords={(records) => {
          const keyword = normalizeSearchText(filters.search);

          return records.filter((record) => {
            const matchesKeyword =
              keyword === "" ||
              [
                record.nama,
                record.nama_suami,
                record.alamat,
                record.nik,
                record.no_hp,
                record.no_jkn,
                record.no_rekam_medis,
              ].some((value) => normalizeSearchText(value).includes(keyword));

            return (
              matchesKeyword &&
              (filters.statusIbu === "all" || record.status_ibu === filters.statusIbu) &&
              (filters.statusHiv === "all" || record.status_hiv === filters.statusHiv) &&
              (filters.statusSifilis === "all" ||
                record.status_sifilis === filters.statusSifilis)
            );
          });
        }}
        renderTableControls={({ records, displayedRecords }) => (
          <div className="data-ibu-filter-card">
            <div className="data-ibu-filter-summary">
              <p className="filter-label">Cari dan filter data ibu</p>
              <strong>
                {displayedRecords.length} dari {records.length} data tampil
              </strong>
            </div>

            <div className="data-ibu-filter-grid">
              <label className="data-ibu-filter-field data-ibu-filter-field-search">
                <span>Pencarian</span>
                <input
                  type="search"
                  value={filters.search}
                  onChange={(event) => updateFilter("search", event.target.value)}
                  placeholder="Cari nama, NIK, No HP, alamat..."
                />
              </label>

              <label className="data-ibu-filter-field">
                <span>Status Ibu</span>
                <select
                  value={filters.statusIbu}
                  onChange={(event) => updateFilter("statusIbu", event.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="baru">Ibu hamil baru</option>
                  <option value="lama">Ibu hamil lama</option>
                </select>
              </label>

              <label className="data-ibu-filter-field">
                <span>Status HIV</span>
                <select
                  value={filters.statusHiv}
                  onChange={(event) => updateFilter("statusHiv", event.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="Non-reaktif">Non-reaktif</option>
                  <option value="Reaktif">Reaktif</option>
                </select>
              </label>

              <label className="data-ibu-filter-field">
                <span>Status Sifilis</span>
                <select
                  value={filters.statusSifilis}
                  onChange={(event) =>
                    updateFilter("statusSifilis", event.target.value)
                  }
                >
                  <option value="all">Semua Status</option>
                  <option value="Negatif">Negatif</option>
                  <option value="Positif">Positif</option>
                </select>
              </label>
            </div>

            <div className="data-ibu-filter-actions">
              <button
                type="button"
                className="data-ibu-filter-button reset"
                onClick={resetFilters}
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}
        transformRecord={(record) => ({
          ...record,
          status_hiv: normalizeHivStatus(record.status_hiv),
        })}
      />
    </div>
  );
}

export default DataIbu;
