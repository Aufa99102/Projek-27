import React from "react";
import EntityPage from "../components/EntityPage";
import "../styles/Persalinan.css";

const fields = [
  { name: "ibu_id", label: "Pilih Ibu", type: "select-ibu", required: true },
  {
    name: "jenis_persalinan",
    label: "Jenis Persalinan",
    type: "select",
    required: true,
    options: [
      { label: "Normal", value: "Normal" },
      { label: "SC", value: "SC" },
    ],
  },
  { name: "komplikasi", label: "Komplikasi", type: "textarea", required: true },
  { name: "bb_bayi", label: "BB Bayi", required: true, numericOnly: true, allowDecimal: true },
  { name: "kelainan", label: "Kelainan", type: "textarea", required: true },
];

const columns = [
  { key: "nomor", label: "Nomor" },
  { key: "ibu_nama", label: "Nama Ibu" },
  { key: "jenis_persalinan", label: "Jenis" },
  { key: "komplikasi", label: "Komplikasi" },
  { key: "bb_bayi", label: "BB Bayi" },
  { key: "kelainan", label: "Kelainan" },
];

function Persalinan() {
  return (
    <div className="page-theme persalinan-page">
      <EntityPage
        title="Riwayat Persalinan"
        description="Dokumentasikan jenis persalinan sebelumnya dan komplikasi yang pernah terjadi."
        endpoint="/persalinan"
        fields={fields}
        columns={columns}
        separateViews
        defaultView="table"
      />
    </div>
  );
}

export default Persalinan;
