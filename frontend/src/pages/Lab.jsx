import React from "react";
import EntityPage from "../components/EntityPage";
import "../styles/Lab.css";

const fields = [
  {
    name: "ibu_id",
    label: "Pilih Ibu",
    type: "select-ibu",
    required: true,
  },

  {
    name: "golongan_darah",
    label: "Golongan Darah",
    type: "select",
    required: true,
    options: ["A", "B", "AB", "O"],
  },

  {
    name: "gds",
    label: "GDS",
    required: true,
    numericOnly: true,
    allowDecimal: true,
  },

  {
    name: "hiv",
    label: "HIV",
    type: "select",
    required: true,
    options: [
      { value: "Non-Reaktif", label: "Non-Reaktif" },
      { value: "Reaktif", label: "Reaktif" },
    ],
  },

  {
    name: "sifilis",
    label: "Sifilis",
    type: "select",
    required: true,
    options: [
      { value: "Negatif", label: "Negatif" },
      { value: "Positif", label: "Positif" },
    ],
  },

  {
    name: "hb",
    label: "HB",
    required: true,
    numericOnly: true,
    allowDecimal: true,
  },

  {
    name: "penyakit",
    label: "Penyakit",
    required: true,
  },

  {
    name: "protein_urina",
    label: "Protein Urina",
    type: "select",
    required: true,
    options: ["+1", "+2", "+3"],
  },

  {
    name: "albumin",
    label: "Albumin",
    type: "select",
    required: true,
    options: ["Negatif", "Positif"],
  },

  {
    name: "hbsag",
    label: "HBSAG",
    type: "select",
    required: true,
    options: ["Non-Reaktif", "Reaktif"],
  },
];

const columns = [
  { key: "nomor", label: "Nomor" },
  { key: "ibu_nama", label: "Nama Ibu" },
  { key: "golongan_darah", label: "Goldar" },
  { key: "gds", label: "GDS" },
  { key: "hiv", label: "HIV" },
  { key: "sifilis", label: "Sifilis" },
  { key: "hb", label: "HB" },
  { key: "penyakit", label: "Penyakit" },
  { key: "protein_urina", label: "Protein Urina" },
  { key: "albumin", label: "Albumin" },
  { key: "hbsag", label: "HBSAG" },
];

function Lab() {
  return (
    <div className="page-theme lab-page">
      <EntityPage
        title="Hasil Laboratorium"
        description="Simpan hasil pemeriksaan penunjang laboratorium ibu hamil."
        endpoint="/lab"
        fields={fields}
        columns={columns}
      />
    </div>
  );
}

export default Lab;