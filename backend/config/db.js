const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME"];

const getMissingEnvVars = () =>
  requiredEnvVars.filter((key) => !process.env[key]);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const testConnection = async () => {
  const missingEnvVars = getMissingEnvVars();

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Konfigurasi database belum lengkap: ${missingEnvVars.join(", ")}`
    );
  }

  const connection = await pool.getConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  testConnection,
};
