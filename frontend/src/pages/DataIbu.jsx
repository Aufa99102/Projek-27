import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EntityPage from "../components/EntityPage";
import { fetchJson } from "../utils/api";
import {
  formatMissingModulesMessage,
  getPdfReadinessSummary,
} from "../utils/pdfEligibility";
import "../styles/DataIbu.css";

const renderBadge = (label, tone) => (
  <span className={`status-badge ${tone}`}>{label}</span>
);

const getStatusIbuLabel = (value) => {
  if (value === "baru") return "Ibu hamil baru";
  if (value === "lama") return "Ibu hamil lama";
  return value || "-";
};

const normalizeHivStatus = (value) => {
  if (value === "Negatif") return "Non-reaktif";
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
  {
    key: "status_ibu",
    label: "Status",
    render: (record) =>
      renderBadge(
        getStatusIbuLabel(record.status_ibu),
        record.status_ibu === "baru" ? "info" : "neutral"
      ),
  },
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
  { key: "tanggal_lahir", label: "Tanggal Lahir" },
  { key: "nama_suami", label: "Suami" },
  { key: "alamat", label: "Alamat" },
  { key: "no_hp", label: "No HP" },
  { key: "nik", label: "NIK" },
  { key: "no_jkn", label: "No JKN" },
  { key: "no_rekam_medis", label: "No RM" },
  { key: "golongan_darah", label: "Golda" },
  { key: "hb", label: "HB" },
  { key: "lila", label: "LILA" },
  { key: "gds", label: "GDS" },
];
function DataIbu() {
  const navigate = useNavigate();
  const [checkingOutputId, setCheckingOutputId] = useState(null);

  const handleOpenPdf = async (ibuRecord) => {
    setCheckingOutputId(ibuRecord.id);

    try {
      const [
        kehamilanResponse,
        pemeriksaanResponse,
        labResponse,
        persalinanResponse,
        rencanaResponse,
        usgResponse,
      ] = await Promise.all([
        fetchJson("/kehamilan"),
        fetchJson("/pemeriksaan"),
        fetchJson("/lab"),
        fetchJson("/persalinan"),
        fetchJson("/rencana"),
        fetchJson("/usg"),
      ]);

      const summary = getPdfReadinessSummary(ibuRecord, {
        kehamilan: kehamilanResponse.data || [],
        pemeriksaan: pemeriksaanResponse.data || [],
        lab: labResponse.data || [],
        persalinan: persalinanResponse.data || [],
        rencana: rencanaResponse.data || [],
        usg: usgResponse.data || [],
      });

      if (!summary.ready) {
        window.alert(formatMissingModulesMessage(summary.missingModules));
        return;
      }

      navigate("/output", {
        state: {
          ibu: ibuRecord,
        },
      });
    } catch (error) {
      window.alert(error.message || "Gagal memeriksa kelengkapan data output PDF.");
    } finally {
      setCheckingOutputId(null);
    }
  };

  return (
    <div className="page-theme data-ibu-page">
      <EntityPage
        title="Data Ibu Hamil"
        description="Kelola identitas utama pasien sebagai basis seluruh relasi data kehamilan."
        endpoint="/ibu"
        fields={fields}
        columns={columns}
        requireIbuOptions={false}
        renderRowActions={(record) => (
          <button
            type="button"
            className="table-button print"
            onClick={() => handleOpenPdf(record)}
            disabled={checkingOutputId === record.id}
          >
            {checkingOutputId === record.id ? "Memeriksa..." : "Output PDF"}
          </button>
        )}
        transformRecord={(record) => ({
          ...record,
          status_hiv: normalizeHivStatus(record.status_hiv),
        })}
      />
    </div>
  );
}

export default DataIbu;
