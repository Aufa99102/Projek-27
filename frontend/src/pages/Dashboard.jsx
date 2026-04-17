import React, { useEffect, useState } from "react";
import { fetchJson } from "../utils/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [summary, setSummary] = useState({
    total_ibu: 0,
    total_pemeriksaan: 0,
    total_usg: 0,
    recent_activity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchJson("/dashboard");
        setSummary(data);
      } catch (requestError) {
        setError(requestError.message);
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
  ];

  return (
    <section className="dashboard-page">
      <div className="page-header">
        <div>
          <p className="page-overline">Ringkasan Layanan</p>
          <h2>Dashboard Nakes</h2>
          <p>Pantau data ibu, kunjungan ANC, dan aktivitas terbaru dari satu layar.</p>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span>{stat.label}</span>
            <strong>{loading ? "..." : stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="activity-card">
        <h3>Recent Activity</h3>
        {loading ? (
          <p className="empty-state">Memuat aktivitas...</p>
        ) : summary.recent_activity.length === 0 ? (
          <p className="empty-state">Belum ada aktivitas terbaru.</p>
        ) : (
          <div className="activity-list">
            {summary.recent_activity.map((item) => (
              <div key={item.id} className="activity-item">
                <div>
                  <strong>{item.message}</strong>
                  <span>{new Date(item.timestamp).toLocaleString("id-ID")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
