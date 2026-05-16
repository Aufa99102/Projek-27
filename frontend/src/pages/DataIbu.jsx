import React, { useState } from "react";
import CustomSelect from "../components/CustomSelect";
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

const JENIS_KUNJUNGAN_OPTIONS = ["K1", "K6", "K8"];

const getStatusIbuLabel = (value) => {
  if (value === "baru" || value === "Kunjungan Baru") return "Kunjungan Baru";
  if (value === "lama" || value === "Kunjungan Lama" || value === "Lama Kunjungan") {
    return "Lama Kunjungan";
  }
  return value || "-";
};

const fields = [
  {
    name: "nama",
    label: "Nama Ibu",
    required: true,
    textOnly: true,
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
  {
    name: "nama_suami",
    label: "Nama Suami",
    required: true,
    textOnly: true,
    placeholder: "Masukkan nama suami",
  },
  {
    name: "alamat",
    label: "Alamat",
    type: "textarea",
    required: true,
    placeholder: "Masukkan alamat lengkap",
  },
  {
    name: "no_hp",
    label: "No HP",
    required: true,
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
    required: true,
    inputMode: "numeric",
    maxLength: 13,
    placeholder: "13 digit nomor JKN",
    validate: buildRequiredLengthValidator("No JKN", 13),
  },
  {
    name: "no_rekam_medis",
    label: "No Rekam Medis",
    required: true,
    placeholder: "Masukkan nomor rekam medis",
  },
  {
    name: "golongan_darah",
    label: "Golongan Darah",
    type: "select",
    required: true,
    options: ["A", "B", "AB", "O"],
  },
  { name: "lila", label: "LILA", type: "number", required: true, allowDecimal: true },
  {
    name: "status_tt",
    label: "Status TT",
    type: "select",
    required: true,
    options: ["1", "2", "3", "4", "5"],
  },
  {
    name: "jenis_kunjungan",
    label: "Jenis Kunjungan",
    type: "select",
    required: true,
    options: JENIS_KUNJUNGAN_OPTIONS,
  },
  {
    name: "status_ibu",
    label: "Status Kunjungan",
    type: "select",
    required: true,
    options: [
      { value: "Kunjungan Baru", label: "Kunjungan Baru" },
      { value: "Lama Kunjungan", label: "Lama Kunjungan" },
    ],
  },
];

const columns = [
  { key: "nomor", label: "Nomor" },
  { key: "nama", label: "Nama" },
  {
    key: "status_ibu",
    label: "Status",
    render: (record) =>
      renderBadge(
        getStatusIbuLabel(record.status_ibu),
        record.status_ibu === "Kunjungan Baru" || record.status_ibu === "baru"
          ? "info"
          : "neutral"
      ),
  },
  { key: "jenis_kunjungan", label: "Jenis Kunjungan" },
  { key: "status_tt", label: "TT" },
  { key: "tanggal_lahir", label: "Tanggal Lahir" },
  { key: "nama_suami", label: "Suami" },
  { key: "alamat", label: "Alamat" },
  { key: "no_hp", label: "No HP" },
  { key: "nik", label: "NIK" },
  { key: "no_jkn", label: "No JKN" },
  { key: "no_rekam_medis", label: "No RM" },
  { key: "golongan_darah", label: "Golda" },
  { key: "lila", label: "LILA" },
];
function DataIbu() {
  const [filters, setFilters] = useState({
    search: "",
    statusIbu: "all",
    jenisKunjungan: "all",
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
      jenisKunjungan: "all",
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
              (filters.statusIbu === "all" ||
                getStatusIbuLabel(record.status_ibu) === filters.statusIbu) &&
              (filters.jenisKunjungan === "all" ||
                record.jenis_kunjungan === filters.jenisKunjungan)
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
                <CustomSelect
                  value={filters.statusIbu}
                  onChange={(nextValue) => updateFilter("statusIbu", nextValue)}
                  options={[
                    { value: "all", label: "Semua Status" },
                    { value: "Kunjungan Baru", label: "Kunjungan Baru" },
                    { value: "Kunjungan Lama", label: "Kunjungan Lama" },
                  ]}
                />
              </label>

              <div className="data-ibu-filter-field">
                <span>Jenis Kunjungan</span>
                <div className="data-ibu-visit-filter" role="group" aria-label="Filter jenis kunjungan">
                  {[
                    { value: "all", label: "Semua" },
                    ...JENIS_KUNJUNGAN_OPTIONS.map((item) => ({
                      value: item,
                      label: item,
                    })),
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={
                        filters.jenisKunjungan === option.value
                          ? "data-ibu-visit-button active"
                          : "data-ibu-visit-button"
                      }
                      onClick={() => updateFilter("jenisKunjungan", option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
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
      />
    </div>
  );
}

export default DataIbu;
