import React from "react";
import EntityPage from "../components/EntityPage";
import "../styles/DataIbu.css";

const fields = [
  { name: "nama", label: "Nama Ibu", required: true },
  { name: "tanggal_lahir", label: "Tanggal Lahir", type: "date", required: true },
  { name: "nama_suami", label: "Nama Suami" },
  { name: "alamat", label: "Alamat", type: "textarea" },
  { name: "no_hp", label: "No HP" },
  { name: "nik", label: "NIK", required: true },
  { name: "no_jkn", label: "No JKN" },
  { name: "no_rekam_medis", label: "No Rekam Medis" },

  // 🔥 Golongan Darah (dropdown)
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
    options: ["Non-reaktif", "Reaktif"],
  },

  {
    name: "status_sifilis",
    label: "Status Sifilis",
    type: "select",
    options: ["Negatif", "Positif"],
  },

  {
    name: "status_ibu",
    label: "Status Ibu",
    type: "select",
    options: ["baru", "lama"],
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
  { key: "status_hiv", label: "HIV" },
  { key: "status_sifilis", label: "Sifilis" },
  { key: "status_ibu", label: "Status" },
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
      />
    </div>
  );
}

export default DataIbu;