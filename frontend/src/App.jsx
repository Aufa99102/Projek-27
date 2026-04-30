import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import DataIbu from "./pages/DataIbu";
import Kehamilan from "./pages/Kehamilan";
import Pemeriksaan from "./pages/Pemeriksaan";
import Lab from "./pages/Lab";
import Persalinan from "./pages/Persalinan";
import Rencana from "./pages/Rencana";
import USG from "./pages/USG";


import Output from "./pages/Output";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      <Route path="/" element={<SidebarLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ibu" element={<DataIbu />} />
        <Route path="kehamilan" element={<Kehamilan />} />
        <Route path="pemeriksaan" element={<Pemeriksaan />} />
        <Route path="lab" element={<Lab />} />
        <Route path="persalinan" element={<Persalinan />} />
        <Route path="rencana" element={<Rencana />} />
        <Route path="usg" element={<USG />} />
        <Route path="output" element={<Output />} />

      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
