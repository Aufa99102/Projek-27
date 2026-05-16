require("dotenv").config();

const express = require("express");
const { testConnection } = require("./config/db");

const ibuRoutes = require("./routes/ibuRoutes");
const kehamilanRoutes = require("./routes/kehamilanRoutes");
const labRoutes = require("./routes/labRoutes");
const persalinanRoutes = require("./routes/persalinanRoutes");
const rencanaRoutes = require("./routes/rencanaRoutes");
const pemeriksaanRoutes = require("./routes/pemeriksaanRoutes");
const usgRoutes = require("./routes/usgRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const formatServerError = (error) => {
  if (error?.code === "ECONNREFUSED") {
    return {
      statusCode: 503,
      message: "Koneksi database gagal. Pastikan service database sedang aktif.",
    };
  }

  if (error?.code === "ER_BAD_DB_ERROR") {
    return {
      statusCode: 500,
      message: "Database tujuan belum tersedia atau nama database tidak sesuai.",
    };
  }

  if (error?.code === "ER_ACCESS_DENIED_ERROR") {
    return {
      statusCode: 500,
      message: "Akses ke database ditolak. Periksa username dan password database.",
    };
  }

  return {
    statusCode: error?.statusCode || error?.status || 500,
    message: error?.message || "Terjadi kesalahan pada server.",
  };
};

const formatLogError = (error) => {
  if (!error) {
    return "Unknown error";
  }

  return [error.code, error.message].filter(Boolean).join(" - ") || String(error);
};

app.use(express.json());

// CORS sederhana (boleh nanti diganti cors package)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

// ROOT
app.get("/", (req, res) => {
  res.json({
    message: "KI-DIGITAL API aktif",
  });
});

// DB CHECK
app.get("/api/health/db", async (req, res) => {
  try {
    await testConnection();

    res.json({
      status: "ok",
      message: "Database terhubung",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});


// ======================
// ROUTES (FINAL FIX)
// ======================

// MASTER DATA
app.use("/api/ibu", ibuRoutes);
app.use("/api/kehamilan", kehamilanRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/persalinan", persalinanRoutes);
app.use("/api/rencana", rencanaRoutes);
app.use("/api/pemeriksaan", pemeriksaanRoutes);
app.use("/api/usg", usgRoutes);

// DASHBOARD
app.use("/api/dashboard", dashboardRoutes);


// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route tidak ditemukan",
    path: req.originalUrl,
  });
});

// ERROR HANDLER
app.use((error, req, res, next) => {
  const { statusCode, message } = formatServerError(error);

  if (statusCode >= 500) {
    console.error("UNHANDLED SERVER ERROR:", error);
  }

  res.status(statusCode).json({
    status: "error",
    message,
    code: error?.code || null,
  });
});


// START SERVER
const startServer = async () => {
  try {
    await testConnection();
    console.log("Database connected");
  } catch (err) {
    console.error("DB error:", formatLogError(err));
  }

  app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
