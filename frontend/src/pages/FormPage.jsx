import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    alamat: "",
    suami: "",
    hpht: "",
    hpl: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/output", { state: formData });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Form Ibu Hamil</h2>

      <input name="nama" placeholder="Nama" onChange={handleChange} />
      <input name="nik" placeholder="NIK" onChange={handleChange} />
      <input name="suami" placeholder="Nama Suami" onChange={handleChange} />
      <input name="alamat" placeholder="Alamat" onChange={handleChange} />
      <input name="hpht" placeholder="HPHT" onChange={handleChange} />
      <input name="hpl" placeholder="HPL" onChange={handleChange} />

      <button type="submit">Simpan</button>
    </form>
  );
}

export default FormPage;