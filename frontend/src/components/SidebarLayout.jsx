import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../utils/api";
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
  const navigate = useNavigate();
  const session = getSession();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

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
          <div className="user-card">
            <span className="user-role">{session?.role}</span>
            <strong>{session?.nama}</strong>
            <span>{session?.email}</span>
          </div>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default SidebarLayout;
