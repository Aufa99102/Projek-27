const DEFAULT_USER = {
  id: 1,
  nama: "Nakes Demo",
  email: "nakes@kiacare.id",
  password: "nakes123",
  role: "nakes",
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (email !== DEFAULT_USER.email || password !== DEFAULT_USER.password) {
    return res.status(401).json({
      message: "Email atau password tidak valid.",
    });
  }

  return res.json({
    message: "Login berhasil.",
    user: {
      id: DEFAULT_USER.id,
      nama: DEFAULT_USER.nama,
      email: DEFAULT_USER.email,
      role: DEFAULT_USER.role,
    },
  });
};

module.exports = {
  login,
};
