import React, { useEffect, useState } from "react";
import { fetchJson } from "../utils/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [summary, setSummary] = useState({
    total_ibu: 0,
    total_pemeriksaan: 0,
    total_usg: 0,
    kunjungan_bulan_ini: 0,
    ibu_baru_bulan_ini: 0,
    hiv: [],
    sifilis: [],
    rekap_ibu_bulanan: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await fetchJson("/dashboard");

        setSummary({
          total_ibu: result.data.total_ibu ?? 0,
          total_pemeriksaan: result.data.total_pemeriksaan ?? 0,
          total_usg: result.data.total_usg ?? 0,

          kunjungan_bulan_ini: result.data.kunjungan_bulan_ini ?? 0,
          ibu_baru_bulan_ini: result.data.ibu_baru_bulan_ini ?? 0,

          hiv: result.data.hiv ?? [],
          sifilis: result.data.sifilis ?? [],
          rekap_ibu_bulanan: result.data.rekap_ibu_bulanan ?? [],
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    { label: "Total Ibu", value: summary.total_ibu },
    { label: "Total Pemeriksaan ANC", value: summary.total_pemeriksaan },
    { label: "Total USG", value: summary.total_usg },
    { label: "Kunjungan Bulan Ini", value: summary.kunjungan_bulan_ini },
    { label: "Ibu Baru Bulan Ini", value: summary.ibu_baru_bulan_ini },
  ];

  return (
    <section className="dashboard-page">

      <div className="page-header">
        <div>
          <p className="page-overline">Ringkasan Layanan</p>
          <h2>Dashboard Nakes</h2>
          <p>Pantau data ibu hamil secara real-time.</p>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      {/* CARD STATISTIK */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span>{stat.label}</span>
            <strong>{loading ? "..." : stat.value}</strong>
          </div>
        ))}
      </div>

      {/* HIV & SIFILIS */}
      <div className="stats-grid">

        <div className="stat-card">
          <span>HIV</span>
          <strong>
            {summary.hiv.map((h) => (
              <div key={h.status_hiv}>
                {h.status_hiv}: {h.total}
              </div>
            ))}
          </strong>
        </div>

        <div className="stat-card">
          <span>Sifilis</span>
          <strong>
            {summary.sifilis.map((s) => (
              <div key={s.status_sifilis}>
                {s.status_sifilis}: {s.total}
              </div>
            ))}
          </strong>
        </div>

      </div>

      {/* REKAP BULAN */}
      <div className="activity-card">
        <h3>Rekap Ibu 6 Bulan Terakhir</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          summary.rekap_ibu_bulanan.map((item) => (
            <div key={item.bulan} className="activity-item">
              <strong>{item.bulan}</strong>
              <span>Total: {item.total}</span>
            </div>
          ))
        )}

      </div>

    </section>
  );
}

export default Dashboard;