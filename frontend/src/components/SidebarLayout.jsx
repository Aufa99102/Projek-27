import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useOutlet } from "react-router-dom";
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
  { label: "Print Kartu Ibu", path: "/output" },
];

function SidebarLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const [renderedOutlet, setRenderedOutlet] = useState(outlet);
  const [transitionState, setTransitionState] = useState("idle");
  const timeoutRef = useRef(null);
  const displayedPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === displayedPathRef.current) {
      return undefined;
    }

    window.clearTimeout(timeoutRef.current);
    setTransitionState("page-exit");

    timeoutRef.current = window.setTimeout(() => {
      setRenderedOutlet(outlet);
      displayedPathRef.current = location.pathname;
      setTransitionState("page-enter");

      timeoutRef.current = window.setTimeout(() => {
        setTransitionState("idle");
      }, 460);
    }, 240);

    return () => window.clearTimeout(timeoutRef.current);
  }, [location.pathname, outlet]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-inner">
          <div className="brand-card">
            <p className="brand-eyebrow">KI-DIGITAL</p>
            <h1>KI-DIGITAL - Sistem NAKES</h1>
            <p className="brand-subtitle">
              Pencatatan digital kesehatan ibu hamil untuk tenaga kesehatan.
            </p>
            <div className="brand-glow" aria-hidden="true" />
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
        <div className="sidebar-orb sidebar-orb-top" aria-hidden="true" />
        <div className="sidebar-orb sidebar-orb-bottom" aria-hidden="true" />
      </aside>

      <main className="content-area">
        <div className="content-backdrop content-backdrop-one" aria-hidden="true" />
        <div className="content-backdrop content-backdrop-two" aria-hidden="true" />
        <div className={`page-transition-shell ${transitionState}`}>
          <div className="page-transition-tape page-transition-tape-left" aria-hidden="true" />
          <div className="page-transition-tape page-transition-tape-right" aria-hidden="true" />
          <div className="page-transition-shadow" aria-hidden="true" />
          <div className="page-transition-paper">
            {renderedOutlet}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SidebarLayout;
