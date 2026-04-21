const { db } = require("../config/db");
const bcrypt = require("bcrypt");

// ======================
// REGISTER
// ======================
const regist = async (req, res, next) => {
  try {
    const { nama, email, password } = req.body;

    // validasi input
    if (!nama || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "nama, email, dan password wajib diisi",
      });
    }

    // cek jumlah user (opsional limit 3 akun)
    const [rows] = await db.execute("SELECT COUNT(*) as total FROM users");
    const totalUser = rows[0].total;

    if (totalUser >= 3) {
      return res.status(403).json({
        status: "error",
        message: "Jumlah akun sudah mencapai batas maksimal (3 akun)",
      });
    }

    // cek email sudah dipakai atau belum
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        status: "error",
        message: "Email sudah terdaftar",
      });
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const query = `
      INSERT INTO users (nama, email, password)
      VALUES (?, ?, ?)
    `;

    await db.execute(query, [nama, email, hashedPassword]);

    return res.status(201).json({
      status: "success",
      message: "Registrasi berhasil",
    });
  } catch (error) {
    next(error);
  }
};

// ======================
// LOGIN
// ======================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validasi input
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email dan password wajib diisi",
      });
    }

    // cari user
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.execute(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Email atau password tidak valid",
      });
    }

    const user = rows[0];

    // verifikasi password bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Email atau password tidak valid",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Login berhasil",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  regist,
  login,
};