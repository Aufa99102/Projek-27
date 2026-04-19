const {db} = require("../config/db");
const bcrypt = require("bcrypt");

const regist = async (req, res, next) => {
    try {
        const data = {
            nama: req.body.nama,
            email: req.body.email,
            password: req.body.password
        }

        // validasi input
        if (!data.nama || !data.email || !data.password) {
            return res.status(400).json({
                status: 'error',
                message: 'nama, email, dan password wajib diisi'
            })
        }

        // 🔥 cek jumlah akun nakes
        const [rows] = await db.execute("SELECT COUNT(*) as total FROM nakes");
        const totalUser = rows[0].total;

        if (totalUser >= 3) {
            return res.status(403).json({
                status: 'error',
                message: 'Jumlah akun nakes sudah mencapai batas maksimal (3 akun)'
            })
        }

        // hashing password
        const hashing = await bcrypt.hash(data.password, 10)

        // insert ke database
        const query = `
            INSERT INTO nakes (nama, email, password)
            VALUES (?, ?, ?)
        `

        await db.execute(query, [data.nama, data.email, hashing])

        return res.status(201).json({
            status: 'success',
            message: "Registrasi berhasil"
        })

    } catch (error) {
        next(error)
    }
}

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
  regist,
  login,
};