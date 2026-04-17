import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchJson, getSession, saveSession } from "../utils/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const session = getSession();
  const [email, setEmail] = useState("nakes@kiacare.id");
  const [password, setPassword] = useState("nakes123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetchJson("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      saveSession(response.user);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="login-overline">Maternal Health Record</p>
        <h1>KIA Care - Nakes System</h1>
        <p className="login-description">
          Sistem pencatatan digital Buku KIA untuk bidan dan dokter.
        </p>

        <div className="credential-box">
          <strong>Akun demo nakes</strong>
          <span>Email: nakes@kiacare.id</span>
          <span>Password: nakes123</span>
        </div>

        {error ? <div className="alert error">{error}</div> : null}

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-group">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="form-group">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Memproses..." : "Masuk sebagai Nakes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
