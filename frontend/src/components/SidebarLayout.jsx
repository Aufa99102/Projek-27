import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../styles/Layout.css";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Data Ibu", path: "/ibu" },
  { label: "Kehamilan", path: "/kehamilan" },
  { label: "Pemeriksaan ANC", path: "/pemeriksaan" },
  { label: "Lab", path: "/lab" },
  { label: "Persalinan", path: "/persalinan" },
  { label: "Rencana", path: "/rencana" },
  { label: "USG", path: "/usg" },
];

function SidebarLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-card">
            <p className="brand-eyebrow">KIA Care</p>
            <h1>KIA Care - Nakes System</h1>
            <p className="brand-subtitle">
              Pencatatan digital kesehatan ibu hamil untuk tenaga kesehatan.
            </p>
          </div>

          <nav className="sidebar-nav">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="system-card">
            <span className="system-label">Mode Akses</span>
            <strong>Aplikasi Langsung Aktif</strong>
            <span>Login dan register telah dihapus dari sistem.</span>
          </div>
        </div>
      </aside>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default SidebarLayout;
