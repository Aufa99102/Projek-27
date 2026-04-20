require("dotenv").config();

const express = require("express");
const { testConnection } = require("./config/db");

const loginRoutes = require("./routes/loginRoutes");
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

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  return next();
});

app.get("/", (req, res) => {
  res.json({
    message: "KIA Care - Nakes System API aktif.",
  });
});

app.get("/api/health/db", async (req, res) => {
  try {
    await testConnection();

    return res.json({
      status: "ok",
      message: "Database terhubung.",
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Database belum terhubung.",
      error: error.message,
    });
  }
});

app.use("/api/login", loginRoutes);
app.use("/api/ibu", ibuRoutes);
app.use("/api/kehamilan", kehamilanRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/persalinan", persalinanRoutes);
app.use("/api/rencana", rencanaRoutes);
app.use("/api/pemeriksaan", pemeriksaanRoutes);
app.use("/api/usg", usgRoutes);
app.use("/api/dashboard", dashboardRoutes);

const startServer = async (port = PORT) => {
  try {
    await testConnection();
    console.log(
      `Berhasil terhubung ke database ${process.env.DB_NAME} di ${process.env.DB_HOST}.`
    );
  } catch (error) {
    console.error("Gagal terhubung ke database:", error.message);
  }

  return app.listen(port, () => {
    console.log(`Backend berjalan di http://localhost:${port}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer,
};
