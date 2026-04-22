import React, { useEffect, useMemo, useState } from "react";
import { fetchJson } from "../utils/api";
import "../styles/Dashboard.css";

const MONTH_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
});

const STATUS_HIV_ITEMS = [
  { key: "Non-reaktif", label: "Non-reaktif", tone: "success" },
  { key: "Reaktif", label: "Reaktif", tone: "danger" },
];

const STATUS_SIFILIS_ITEMS = [
  { key: "Negatif", label: "Negatif", tone: "success" },
  { key: "Positif", label: "Positif", tone: "danger" },
];

const KATEGORI_ITEMS = [
  {
    key: "kurang_dari_3_bulan",
    label: "< 3 bulan",
    tone: "info",
  },
  {
    key: "kurang_dari_7_bulan",
    label: "< 7 bulan",
    tone: "warning",
  },
  {
    key: "tujuh_bulan_ke_atas",
    label: ">= 7 bulan",
    tone: "success",
  },
];

const toCountMap = (items, keyField) =>
  items.reduce((accumulator, item) => {
    accumulator[item[keyField]] = Number(item.total || 0);
    return accumulator;
  }, {});

const formatMonthLabel = (value) => {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(`${value}-01T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return MONTH_FORMATTER.format(parsedDate);
};

const renderBadge = (label, tone) => (
  <span className={`dashboard-badge ${tone}`}>{label}</span>
);

function Dashboard() {
  const [summary, setSummary] = useState({
    total_ibu: 0,
    total_ibu_bulan_ini: 0,
    total_pemeriksaan: 0,
    total_usg: 0,
    kunjungan_bulan_ini: 0,
    ibu_baru_bulan_ini: 0,
    hiv: [],
    sifilis: [],
    kategori_kehamilan: [],
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
          total_ibu_bulan_ini: result.data.total_ibu_bulan_ini ?? 0,
          total_pemeriksaan: result.data.total_pemeriksaan ?? 0,
          total_usg: result.data.total_usg ?? 0,
          kunjungan_bulan_ini: result.data.kunjungan_bulan_ini ?? 0,
          ibu_baru_bulan_ini: result.data.ibu_baru_bulan_ini ?? 0,
          hiv: result.data.hiv ?? [],
          sifilis: result.data.sifilis ?? [],
          kategori_kehamilan: result.data.kategori_kehamilan ?? [],
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

  const hivMap = useMemo(() => toCountMap(summary.hiv, "status_hiv"), [summary.hiv]);
  const sifilisMap = useMemo(
    () => toCountMap(summary.sifilis, "status_sifilis"),
    [summary.sifilis]
  );
  const kategoriMap = useMemo(
    () => toCountMap(summary.kategori_kehamilan, "kategori_kehamilan"),
    [summary.kategori_kehamilan]
  );

  const primaryStats = [
    {
      label: "Total Seluruh Ibu Hamil",
      value: summary.total_ibu,
      accent: "neutral",
    },
    {
      label: "Total Ibu Hamil Bulan Ini",
      value: summary.total_ibu_bulan_ini,
      accent: "info",
    },
    {
      label: "Ibu Hamil Baru Bulan Ini",
      value: summary.ibu_baru_bulan_ini,
      accent: "success",
    },
  ];

  const secondaryStats = [
    { label: "Total Pemeriksaan ANC", value: summary.total_pemeriksaan },
    { label: "Total USG", value: summary.total_usg },
    { label: "Kunjungan Bulan Ini", value: summary.kunjungan_bulan_ini },
  ];

  return (
    <section className="dashboard-page">
      <div className="page-header">
        <div>
          <p className="page-overline">Ringkasan Layanan</p>
          <h2>Dashboard Nakes</h2>
          <p>Pantau data ibu hamil, status infeksi, dan kategori kehamilan.</p>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <div className="stats-grid stats-grid-primary">
        {primaryStats.map((stat) => (
          <article key={stat.label} className={`stat-card ${stat.accent}`}>
            <span>{stat.label}</span>
            <strong>{loading ? "..." : stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="stats-grid">
        {secondaryStats.map((stat) => (
          <article key={stat.label} className="stat-card soft">
            <span>{stat.label}</span>
            <strong>{loading ? "..." : stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="activity-card">
          <div className="section-heading">
            <div>
              <p className="section-overline">Status Skrining</p>
              <h3>Rekap HIV & Sifilis</h3>
            </div>
          </div>

          <div className="summary-split">
            <div className="summary-panel">
              <p className="summary-title">Status HIV</p>
              <div className="summary-list">
                {STATUS_HIV_ITEMS.map((item) => (
                  <div key={item.key} className="summary-row">
                    {renderBadge(item.label, item.tone)}
                    <strong>{loading ? "..." : hivMap[item.key] ?? 0}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-panel">
              <p className="summary-title">Status Sifilis</p>
              <div className="summary-list">
                {STATUS_SIFILIS_ITEMS.map((item) => (
                  <div key={item.key} className="summary-row">
                    {renderBadge(item.label, item.tone)}
                    <strong>{loading ? "..." : sifilisMap[item.key] ?? 0}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="activity-card">
          <div className="section-heading">
            <div>
              <p className="section-overline">Kategori Kehamilan</p>
              <h3>Distribusi Berdasarkan Lama Kehamilan</h3>
            </div>
          </div>

          <div className="category-grid">
            {KATEGORI_ITEMS.map((item) => (
              <article key={item.key} className="category-card">
                {renderBadge(item.label, item.tone)}
                <strong>{loading ? "..." : kategoriMap[item.key] ?? 0}</strong>
                <span>Data ibu pada kategori ini</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="activity-card">
        <div className="section-heading">
          <div>
            <p className="section-overline">Rekap Bulanan</p>
            <h3>Total Ibu Hamil Per Bulan</h3>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : summary.rekap_ibu_bulanan.length === 0 ? (
          <p>Belum ada rekap bulanan yang dapat ditampilkan.</p>
        ) : (
          <div className="activity-list">
            {summary.rekap_ibu_bulanan.map((item) => (
              <div key={item.bulan} className="activity-item">
                <strong>{formatMonthLabel(item.bulan)}</strong>
                <div className="activity-metrics">
                  <span>Total ibu hamil: {item.total_ibu}</span>
                  <span>Ibu hamil baru: {item.ibu_baru}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default Dashboard;
