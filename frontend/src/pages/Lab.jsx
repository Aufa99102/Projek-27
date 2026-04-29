import React from "react";
import EntityPage from "../components/EntityPage";
import "../styles/Lab.css";

const fields = [
  { name: "ibu_id", label: "Pilih Ibu", type: "select-ibu", required: true },
  { name: "hb", label: "HB", numericOnly: true, allowDecimal: true },
  { name: "albumin", label: "Albumin" },
  { name: "hbsag", label: "HBSAG" },

  {
    name: "hiv",
    label: "HIV",
    type: "select",
    options: [
      { value: "Negatif", label: "Negatif" },
      { value: "Positif", label: "Positif" },
    ],
  },
];

const columns = [
  { key: "nomor", label: "Nomor" },
  { key: "ibu_nama", label: "Nama Ibu" },
  { key: "hb", label: "HB" },
  { key: "albumin", label: "Albumin" },
  { key: "hbsag", label: "HBSAG" },
  { key: "hiv", label: "HIV" },
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
