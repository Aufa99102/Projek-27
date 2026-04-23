import React from "react";
import EntityPage from "../components/EntityPage";
import "../styles/DataIbu.css";

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

  return value || "-";
};

const normalizeHivStatus = (value) => {
  if (value === "Negatif") {
    return "Non-reaktif";
  }

  return value || "";
};

const fields = [
  { name: "nama", label: "Nama Ibu", required: true },
  { name: "tanggal_lahir", label: "Tanggal Lahir", type: "date", required: true },
  { name: "nama_suami", label: "Nama Suami" },
  { name: "alamat", label: "Alamat", type: "textarea" },
  { name: "no_hp", label: "No HP" },
  { name: "nik", label: "NIK", required: true },
  { name: "no_jkn", label: "No JKN" },
  { name: "no_rekam_medis", label: "No Rekam Medis" },

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
  { key: "tanggal_lahir", label: "Tanggal Lahir" },
  { key: "nama_suami", label: "Suami" },
  { key: "alamat", label: "Alamat" },
  { key: "no_hp", label: "No HP" },
  { key: "nik", label: "NIK" },
  { key: "no_jkn", label: "No JKN" },
  { key: "no_rekam_medis", label: "No RM" },
  { key: "golongan_darah", label: "Golda" },

  // 🔥 FIELD BARU
  { key: "hb", label: "HB" },
  { key: "lila", label: "LILA" },
  { key: "gds", label: "GDS" },
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
  {
    key: "status_ibu",
    label: "Status",
    render: (record) =>
      renderBadge(
        getStatusIbuLabel(record.status_ibu),
        record.status_ibu === "baru" ? "info" : "neutral"
      ),
  },
];

function DataIbu() {
  return (
    <div className="page-theme data-ibu-page">
      <EntityPage
        title="Data Ibu Hamil"
        description="Kelola identitas utama pasien sebagai basis seluruh relasi data kehamilan."
        endpoint="/ibu"
        fields={fields}
        columns={columns}
        requireIbuOptions={false}
        transformRecord={(record) => ({
          ...record,
          status_hiv: normalizeHivStatus(record.status_hiv),
        })}
      />
    </div>
  );
}

export default DataIbu;
