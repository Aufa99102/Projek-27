import React, { useEffect, useMemo, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import KartuIbuHamilPDF from "../components/KartuIbuHamilPDF";
import "../styles/Output.css";
import { fetchJson } from "../utils/api";
import {
  formatMissingModulesMessage,
  getPdfReadinessSummary,
} from "../utils/pdfEligibility";

const normalizePdfData = (ibu, datasets = {}, selectedRecords = {}) => {
  const latestLab = selectedRecords.lab || {};

  return {
    ...ibu,
    hb: ibu.hb || latestLab.hb || "-",
    status_hiv: ibu.status_hiv || latestLab.hiv || "-",
    kehamilan: selectedRecords.kehamilan || null,
    lab: selectedRecords.lab || null,
    persalinan: selectedRecords.persalinan || null,
    rencana: selectedRecords.rencana || null,
    usg: selectedRecords.usg || null,
    pemeriksaan: (datasets.pemeriksaan || [])
      .filter((item) => String(item.ibu_id) === String(ibu.id))
      .map((item) => ({
      tanggal_kunjungan: item.tanggal_kunjungan || "-",
      usia_kehamilan: item.usia_kehamilan || "-",
      tekanan_darah: item.tekanan_darah || "-",
      berat_badan: item.berat_badan || "-",
      keterangan: item.keterangan || "-",
      })),
  };
};

const getPregnancySummary = (data) => {
  const hpht = data?.kehamilan?.hpht;

  if (!hpht) {
    return "Belum ada data HPHT";
  }

  const hphtDate = new Date(hpht);

  if (Number.isNaN(hphtDate.getTime())) {
    return "HPHT belum valid";
  }

  const weekDiff = Math.max(
    0,
    Math.floor((Date.now() - hphtDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
  );

  return `${weekDiff} minggu`;
};

function Output() {
  const [ibuOptions, setIbuOptions] = useState([]);
  const [datasets, setDatasets] = useState(null);
  const [selectedIbuId, setSelectedIbuId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [missingModules, setMissingModules] = useState([]);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          ibuResponse,
          kehamilanResponse,
          pemeriksaanResponse,
          labResponse,
          persalinanResponse,
          rencanaResponse,
          usgResponse,
        ] = await Promise.all([
          fetchJson("/ibu"),
          fetchJson("/kehamilan"),
          fetchJson("/pemeriksaan"),
          fetchJson("/lab"),
          fetchJson("/persalinan"),
          fetchJson("/rencana"),
          fetchJson("/usg"),
        ]);

        const nextIbuOptions = ibuResponse.data || [];

        setIbuOptions(nextIbuOptions);
        setDatasets({
          kehamilan: kehamilanResponse.data || [],
          pemeriksaan: pemeriksaanResponse.data || [],
          lab: labResponse.data || [],
          persalinan: persalinanResponse.data || [],
          rencana: rencanaResponse.data || [],
          usg: usgResponse.data || [],
        });

        if (nextIbuOptions.length > 0) {
          setSelectedIbuId((currentValue) =>
            currentValue || String(nextIbuOptions[0].id)
          );
        }
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
        setInitialLoaded(true);
      }
    };

    loadInitialData();
  }, []);

  const selectedIbu = useMemo(
    () =>
      ibuOptions.find((item) => String(item.id) === String(selectedIbuId)) || null,
    [ibuOptions, selectedIbuId]
  );

  const outputStats = useMemo(() => {
    if (!selectedIbu) {
      return [];
    }

    return [
      {
        label: "NIK",
        value: selectedIbu.nik || "-",
      },
      {
        label: "Status Ibu",
        value:
          selectedIbu.status_ibu === "baru"
            ? "Ibu hamil baru"
            : selectedIbu.status_ibu === "lama"
            ? "Ibu hamil lama"
            : "-",
      },
      {
        label: "Gol. Darah",
        value: selectedIbu.golongan_darah || "-",
      },
      {
        label: "Usia Kehamilan",
        value: data ? getPregnancySummary(data) : "Belum siap",
      },
    ];
  }, [data, selectedIbu]);

  useEffect(() => {
    if (!selectedIbu || !datasets) {
      setData(null);
      setMissingModules([]);
      return;
    }

    const loadPdfData = async () => {
      setError("");
      setMissingModules([]);

      try {
        const summary = getPdfReadinessSummary(selectedIbu, datasets);

        if (!summary.ready) {
          setMissingModules(summary.missingModules);
          setData(null);
          return;
        }

        setData(normalizePdfData(selectedIbu, datasets, summary.selectedRecords));
      } catch (requestError) {
        setError(requestError.message);
      }
    };

    loadPdfData();
  }, [datasets, selectedIbu]);

  if (missingModules.length > 0) {
    return (
      <section className="output-page">
        <div className="output-card">
          <div className="output-header">
            <div className="output-hero-copy">
              <p className="page-overline">Print Dokumen</p>
              <h2>Print Kartu Ibu</h2>
              <p>Pilih nama ibu untuk melihat hasil kartu dan menyiapkan cetaknya.</p>
            </div>
            <div className="output-hero-badge">Print Preview</div>
          </div>

          <div className="output-toolbar">
            <label className="output-field">
              <span>Pilih Nama Ibu</span>
              <select
                value={selectedIbuId}
                onChange={(event) => setSelectedIbuId(event.target.value)}
              >
                {ibuOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <h3 className="output-state-title">Kartu belum bisa diproses</h3>
          <p>{formatMissingModulesMessage(missingModules)}</p>
          <ul className="output-list">
            {missingModules.map((module) => (
              <li key={module}>{module}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="output-page">
        <div className="output-card">
          <h2>Gagal Memuat Halaman Print</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (loading && !initialLoaded) {
    return (
      <section className="output-page">
        <div className="output-card">
          <p>Menyiapkan halaman print kartu...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="output-page">
      <div className="output-card">
        <div className="output-header">
          <div className="output-hero-copy">
            <p className="page-overline">Print Dokumen</p>
            <h2>Print Kartu Ibu</h2>
            <p>Pilih nama ibu untuk melihat hasil kartu dan menyiapkan cetaknya.</p>
          </div>
          <div className="output-hero-badge">Siap dicetak</div>
        </div>

        <div className="output-toolbar">
          <label className="output-field">
            <span>Pilih Nama Ibu</span>
            <select
              value={selectedIbuId}
              onChange={(event) => setSelectedIbuId(event.target.value)}
            >
              {ibuOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
                ))}
            </select>
          </label>
        </div>

        {!selectedIbu ? (
          <div className="output-empty-state">
            <h3>Belum ada data ibu</h3>
            <p>Tambahkan data ibu terlebih dahulu agar halaman output bisa digunakan.</p>
          </div>
        ) : !data ? (
          <div className="output-empty-state">
            <h3>Data belum siap dicetak</h3>
            <p>Pilih data ibu yang sudah lengkap untuk melihat hasil kartu.</p>
          </div>
        ) : (
          <div className="output-preview">
            <div className="output-overview">
              <div className="output-meta-card">
                <p className="output-meta-label">Pasien Terpilih</p>
                <strong>{selectedIbu.nama}</strong>
                <span>{selectedIbu.alamat || "Alamat belum tersedia"}</span>
              </div>

              <div className="output-stats-grid">
                {outputStats.map((item) => (
                  <div key={item.label} className="output-stat">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="output-preview-frame">
              <div className="output-preview-topbar">
                <div className="output-preview-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <strong>Print Kartu Ibu</strong>
                <span className="output-preview-status">Siap dicetak</span>
              </div>

              <div className="output-pdf-shell">
                <PDFViewer width="100%" height="700">
                  <KartuIbuHamilPDF data={data} />
                </PDFViewer>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Output;
