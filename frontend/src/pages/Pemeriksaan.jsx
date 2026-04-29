import React from "react";
import EntityPage from "../components/EntityPage";
import "../styles/Pemeriksaan.css";

const fields = [
  { name: "ibu_id", label: "Pilih Ibu", type: "select-ibu", required: true },
  { name: "tanggal_kunjungan", label: "Tanggal Kunjungan", type: "date", required: true },
  { name: "usia_kehamilan", label: "Usia Kehamilan", required: true, numericOnly: true },
  {
    name: "tekanan_darah",
    label: "Tekanan Darah",
    required: true,
    validate: (value) =>
      !value || /^\d+\/\d+$/.test(String(value).trim())
        ? null
        : "Tekanan darah hanya boleh berisi angka dengan format seperti 120/80.",
  },
  { name: "berat_badan", label: "Berat Badan", required: true, numericOnly: true, allowDecimal: true },
  { name: "hasil_pemeriksaan", label: "Hasil Pemeriksaan", type: "textarea", required: true },
  { name: "terapi", label: "Terapi", type: "textarea", required: true },
  { name: "keterangan", label: "Keterangan", type: "textarea", required: true },
  { name: "tanggal_kembali", label: "Tanggal Kembali", type: "date", required: true },
];

const columns = [
  { key: "nomor", label: "Nomor" },
  { key: "ibu_nama", label: "Nama Ibu" },
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
