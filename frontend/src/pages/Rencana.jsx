import React from "react";
import EntityPage from "../components/EntityPage";
import "../styles/Rencana.css";

const fields = [
  { name: "ibu_id", label: "Pilih Ibu", type: "select-ibu", required: true },
  { name: "penolong", label: "Penolong", required: true, textOnly: true },
  { name: "tempat", label: "Tempat", required: true, textOnly: true },

  {
    name: "pendamping",
    label: "Pendamping",
    type: "select",
    options: [
      { value: "keluarga", label: "Keluarga" },
      { value: "suami", label: "Suami" },
    ],
    required: true,
  },

  { name: "transportasi", label: "Transportasi", required: true, textOnly: true },
  {
    name: "calon_donor",
    label: "Calon Donor",
    required: true,
    placeholder: "Contoh: Donor A, Donor B",
  },
];

const columns = [
  { key: "nomor", label: "Nomor" },
  { key: "ibu_nama", label: "Nama Ibu" },
  { key: "penolong", label: "Penolong" },
  { key: "tempat", label: "Tempat" },
  { key: "pendamping", label: "Pendamping" },
  { key: "transportasi", label: "Transportasi" },
  { key: "calon_donor", label: "Calon Donor" },
];

function Rencana() {
  return (
    <div className="page-theme rencana-page">
      <EntityPage
        title="Rencana Persalinan"
        description="Siapkan kebutuhan persalinan dengan data penolong, tempat, hingga donor cadangan."
        endpoint="/rencana"
        fields={fields}
        columns={columns}
      />
    </div>
  );
}

export default Rencana;
