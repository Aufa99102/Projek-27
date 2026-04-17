import React from "react";
import EntityPage from "../components/EntityPage";
import "../styles/Edukasi.css";

const fields = [
  { name: "ibu_id", label: "Pilih Ibu", type: "select-ibu", required: true },
  { name: "materi", label: "Materi", type: "textarea", required: true },
  { name: "tanggal", label: "Tanggal", type: "date" },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "ibu_id", label: "Ibu ID" },
  { key: "materi", label: "Materi" },
  { key: "tanggal", label: "Tanggal" },
];

function Edukasi() {
  return (
    <div className="page-theme edukasi-page">
      <EntityPage
        title="Edukasi Pasien"
        description="Simpan materi edukasi yang telah diberikan kepada ibu hamil pada tiap kunjungan."
        endpoint="/edukasi"
        fields={fields}
        columns={columns}
      />
    </div>
  );
}

export default Edukasi;
