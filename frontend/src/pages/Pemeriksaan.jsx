import React from "react";
import EntityPage from "../components/EntityPage";
import "../styles/Pemeriksaan.css";

const fields = [
  { name: "ibu_id", label: "Pilih Ibu", type: "select-ibu", required: true },
  { name: "tanggal_kunjungan", label: "Tanggal Kunjungan", type: "date", required: true },
  { name: "usia_kehamilan", label: "Usia Kehamilan" },
  { name: "tekanan_darah", label: "Tekanan Darah" },
  { name: "berat_badan", label: "Berat Badan" },
  { name: "hasil_pemeriksaan", label: "Hasil Pemeriksaan", type: "textarea" },
  { name: "terapi", label: "Terapi", type: "textarea" },
  { name: "keterangan", label: "Keterangan", type: "textarea" },
  { name: "tanggal_kembali", label: "Tanggal Kembali", type: "date" },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "ibu_id", label: "Ibu ID" },
  { key: "tanggal_kunjungan", label: "Tgl Kunjungan" },
  { key: "usia_kehamilan", label: "Usia Kehamilan" },
  { key: "tekanan_darah", label: "TD" },
  { key: "berat_badan", label: "BB" },
  { key: "hasil_pemeriksaan", label: "Hasil" },
  { key: "terapi", label: "Terapi" },
  { key: "keterangan", label: "Keterangan" },
  { key: "tanggal_kembali", label: "Tgl Kembali" },
];

function Pemeriksaan() {
  return (
    <div className="page-theme pemeriksaan-page">
      <EntityPage
        title="Pemeriksaan ANC"
        description="Catat setiap kunjungan ANC. Satu ibu dapat memiliki banyak riwayat pemeriksaan."
        endpoint="/pemeriksaan"
        fields={fields}
        columns={columns}
      />
    </div>
  );
}

export default Pemeriksaan;
