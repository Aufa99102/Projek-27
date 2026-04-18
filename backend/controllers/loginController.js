const {db} = require("../config/db");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email dan password wajib diisi",
      });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.execute(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Email atau password tidak valid",
      });
    }

    const user = rows[0];

    // ⚠️ sementara masih plain text (nanti bisa kita upgrade ke bcrypt)
    if (password !== user.password) {
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
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};