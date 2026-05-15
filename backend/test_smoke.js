// Menggunakan native fetch Node.js

const BASE_URL = "http://localhost:3000/api";

async function smokeTest() {
  console.log("=== MEMULAI SMOKE TEST ===");

  try {
    // 1. Uji Create Ibu dengan data minimal (opsional dikosongkan)
    console.log("1. Menguji POST /api/ibu (Minimal Data)...");
    const ibuRes = await fetch(`${BASE_URL}/ibu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: "Ibu Test Smoke",
        tanggal_lahir: "1995-05-15",
        nik: "1234567890123456",
        golongan_darah: "O",
        status_tt: "1",
        jenis_kunjungan: "K1",
        status_ibu: "Kunjungan Baru",
        // sisanya dikosongkan untuk tes opsional
      }),
    });
    const ibuData = await ibuRes.json();
    console.log("Response Ibu:", ibuData);
    if (ibuData.status !== "success") throw new Error("Gagal membuat data ibu");

    // Ambil ID ibu yang baru dibuat
    const getIbuRes = await fetch(`${BASE_URL}/ibu`);
    const allIbu = await getIbuRes.json();
    const createdIbu = allIbu.data.find((i) => i.nik === "1234567890123456");
    if (!createdIbu) throw new Error("Data Ibu tidak ditemukan setelah insert");
    console.log("-> Berhasil membuat data Ibu dengan ID:", createdIbu.id);

    // 2. Uji Create Kehamilan dengan data minimal
    console.log("\n2. Menguji POST /api/kehamilan (Minimal Data)...");
    const hamilRes = await fetch(`${BASE_URL}/kehamilan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ibu_id: createdIbu.id,
        hpht: "2023-10-01",
        hpl: "2024-07-08",
        bb_sebelum_hamil: 55,
        imt: 22.5,
        // jarak_kehamilan & riwayat_penyakit dikosongkan
      }),
    });
    const hamilData = await hamilRes.json();
    console.log("Response Kehamilan:", hamilData);
    if (hamilData.status !== "success") throw new Error("Gagal membuat data kehamilan");

    // 3. Uji Create Pemeriksaan dengan data minimal
    console.log("\n3. Menguji POST /api/pemeriksaan (Minimal Data)...");
    const periksaRes = await fetch(`${BASE_URL}/pemeriksaan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ibu_id: createdIbu.id,
        tanggal_kunjungan: "2023-11-01",
        usia_kehamilan: "4 minggu",
        tekanan_darah: "120/80",
        berat_badan: 56,
        hasil_pemeriksaan: "Normal",
        // keterangan, terapi dikosongkan
      }),
    });
    const periksaData = await periksaRes.json();
    console.log("Response Pemeriksaan:", periksaData);
    if (periksaData.status !== "success") throw new Error("Gagal membuat data pemeriksaan");

    // 4. Uji Create Lab dengan struktur terbaru
    console.log("\n4. Menguji POST /api/lab (Struktur Baru)...");
    const labRes = await fetch(`${BASE_URL}/lab`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ibu_id: createdIbu.id,
        golongan_darah: "O",
        gds: "98",
        hiv: "Non-Reaktif",
        sifilis: "Negatif",
        hb: "12.1",
        penyakit: "Tidak ada",
        protein_urina: "+1",
        albumin: "Negatif",
        hbsag: "Non-Reaktif",
      }),
    });
    const labData = await labRes.json();
    console.log("Response Lab:", labData);
    if (labData.status !== "success") throw new Error("Gagal membuat data lab");

    console.log("\n=== SMOKE TEST BERHASIL ===");
    console.log("Semua validasi API yang dilonggarkan berjalan dengan baik tanpa error 400.");
  } catch (err) {
    console.error("\n[ERROR] Smoke Test Gagal:", err.message);
  }
}

smokeTest();
