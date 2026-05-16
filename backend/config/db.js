const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

const testConnection = async () => {
  try {
    const conn = await db.getConnection();

    await conn.ping();

    console.log("Database connected");

    conn.release();
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};

module.exports = { db, testConnection };