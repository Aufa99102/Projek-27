import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchJson, getSession, saveSession } from "../utils/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const session = getSession();

  const [mode, setMode] = useState("login"); // login | register

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("nakes@kiacare.id");
  const [password, setPassword] = useState("nakes123");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ======================
      // LOGIN
      // ======================
      if (mode === "login") {
        const res = await fetchJson("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        saveSession(res.user);
        navigate("/dashboard");
      }

      // ======================
      // REGISTER
      // ======================
      else {
        await fetchJson("/auth/register", {
          method: "POST",
          body: JSON.stringify({ nama, email, password }),
        });

        setMode("login");
        setError("Registrasi berhasil, silakan login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{mode === "login" ? "Login" : "Register"}</h1>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              placeholder="Nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading} className="primary-button">
            {loading
              ? "Loading..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <p
          style={{ cursor: "pointer", marginTop: "10px", color: "#2f7d72" }}
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "Belum punya akun? Register"
            : "Sudah punya akun? Login"}
        </p>
      </div>
    </div>
  );
}

export default Login;