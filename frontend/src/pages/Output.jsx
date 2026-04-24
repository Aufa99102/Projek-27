import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

function Output() {
  const location = useLocation();
  const initialIbuData = useMemo(() => {
    if (location.state?.ibu) {
      return location.state.ibu;
    }

    if (location.state && typeof location.state === "object") {
      return location.state;
    }

    return null;
  }, [location.state]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [missingModules, setMissingModules] = useState([]);

  const canCheckOutput = Boolean(initialIbuData?.id);

  useEffect(() => {
    if (!canCheckOutput || !initialIbuData) {
      return;
    }

    const loadPdfData = async () => {
      setLoading(true);
      setError("");
      setMissingModules([]);

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

        const datasets = {
          kehamilan: kehamilanResponse.data || [],
          pemeriksaan: pemeriksaanResponse.data || [],
          lab: labResponse.data || [],
          persalinan: persalinanResponse.data || [],
          rencana: rencanaResponse.data || [],
          usg: usgResponse.data || [],
        };

        const summary = getPdfReadinessSummary(initialIbuData, datasets);

        if (!summary.ready) {
          setMissingModules(summary.missingModules);
          setData(null);
          return;
        }

        setData(normalizePdfData(initialIbuData, datasets, summary.selectedRecords));
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadPdfData();
  }, [canCheckOutput, initialIbuData]);

  if (!canCheckOutput) {
    return (
      <section className="output-page">
        <div className="output-card">
          <h2>PDF Belum Bisa Digunakan</h2>
          <p>
            Pilih data ibu terlebih dahulu dari halaman Data Ibu sebelum membuka
            output react-pdf.
          </p>
          <Link to="/ibu" className="btn">
            Kembali ke Form
          </Link>
        </div>
      </section>
    );
  }

  if (missingModules.length > 0) {
    return (
      <section className="output-page">
        <div className="output-card">
          <h2>PDF Belum Bisa Digunakan</h2>
          <p>{formatMissingModulesMessage(missingModules)}</p>
          <ul className="output-list">
            {missingModules.map((module) => (
              <li key={module}>{module}</li>
            ))}
          </ul>
          <Link to="/ibu" className="btn">
            Kembali ke Data Ibu
          </Link>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="output-page">
        <div className="output-card">
          <h2>Gagal Memuat PDF</h2>
          <p>{error}</p>
          <Link to="/ibu" className="btn">
            Kembali ke Form
          </Link>
        </div>
      </section>
    );
  }

  if (loading || !data) {
    return (
      <section className="output-page">
        <div className="output-card">
          <p>Menyiapkan dokumen PDF...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="output-page">
      <div className="output-card">
        <h2>Preview Kartu Ibu Hamil</h2>
        <PDFViewer width="100%" height="700">
          <KartuIbuHamilPDF data={data} />
        </PDFViewer>
      </div>
    </section>
  );
}

export default Output;
