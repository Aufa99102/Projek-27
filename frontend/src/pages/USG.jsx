import React from "react";
import EntityPage from "../components/EntityPage";
import "../styles/USG.css";

const fields = [
  { name: "ibu_id", label: "Pilih Ibu", type: "select-ibu", required: true },
  {
    name: "trimester",
    label: "Trimester",
    type: "select",
    options: [
      { label: "Trimester 1", value: "1" },
      { label: "Trimester 2", value: "2" },
      { label: "Trimester 3", value: "3" },
    ],
  },
  { name: "gs", label: "GS" },
  { name: "crl", label: "CRL" },
  { name: "djj", label: "DJJ" },
  { name: "letak_janin", label: "Letak Janin" },
  { name: "taksiran_persalinan", label: "Taksiran Persalinan", type: "date" },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "ibu_id", label: "Ibu ID" },
  { key: "trimester", label: "Trimester" },
  { key: "gs", label: "GS" },
  { key: "crl", label: "CRL" },
  { key: "djj", label: "DJJ" },
  { key: "letak_janin", label: "Letak Janin" },
  { key: "taksiran_persalinan", label: "Taksiran" },
];

function USG() {
  return (
    <div className="page-theme usg-page">
      <EntityPage
        title="Pemeriksaan USG"
        description="Catat hasil USG berdasarkan trimester untuk pemantauan perkembangan janin."
        endpoint="/usg"
        fields={fields}
        columns={columns}
      />
    </div>
  );
}

export default USG;
