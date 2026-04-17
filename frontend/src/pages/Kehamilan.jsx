import React, { useState } from "react";
import EntityPage from "../components/EntityPage";
import "../styles/Kehamilan.css";

const fields = [
  { name: "ibu_id", label: "Pilih Ibu", type: "select-ibu", required: true },
  { name: "hpht", label: "HPHT", type: "date" },
  { name: "hpl", label: "HPL", type: "date" },
  { name: "jarak_kehamilan", label: "Jarak Kehamilan" },
  {
    name: "status_imunisasi",
    label: "Status Imunisasi",
    placeholder: "Contoh: TT1, TT2",
  },
  { name: "riwayat_penyakit", label: "Riwayat Penyakit", type: "textarea" },
  { name: "bb_sebelum_hamil", label: "BB Sebelum Hamil" },
  { name: "imt", label: "IMT" },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "ibu_nama", label: "Klien" },
  { key: "usia_kehamilan_label", label: "Usia Kehamilan" },
  { key: "kategori_kehamilan_label", label: "Kategori" },
  { key: "trimester_label", label: "Trimester" },
  { key: "hpht", label: "HPHT" },
  { key: "hpl", label: "HPL" },
  { key: "jarak_kehamilan", label: "Jarak" },
  { key: "status_imunisasi", label: "Imunisasi" },
  { key: "riwayat_penyakit", label: "Riwayat Penyakit" },
  { key: "bb_sebelum_hamil", label: "BB Awal" },
  { key: "imt", label: "IMT" },
];

const FILTER_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "kurang_dari_3_bulan", label: "< 3 Bulan" },
  { value: "kurang_dari_7_bulan", label: "< 7 Bulan" },
  { value: "tujuh_bulan_ke_atas", label: "7+ Bulan" },
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const WEEK_IN_MONTH = 4;

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const hitungUsiaKehamilan = (hpht) => {
  const now = new Date();
  const hphtDate = parseDate(hpht);

  if (!hphtDate) {
    return {
      minggu: null,
      bulan: null,
      usia_kehamilan_label: "Belum diketahui",
    };
  }

  const usiaKehamilanMinggu = Math.floor((now - hphtDate) / DAY_IN_MS / 7);

  if (usiaKehamilanMinggu < 0) {
    return {
      minggu: null,
      bulan: null,
      usia_kehamilan_label: "HPHT belum valid",
    };
  }

  const usiaKehamilanBulan = Math.floor(usiaKehamilanMinggu / WEEK_IN_MONTH);

  return {
    minggu: usiaKehamilanMinggu,
    bulan: usiaKehamilanBulan,
    usia_kehamilan_label: `${usiaKehamilanMinggu} minggu (${usiaKehamilanBulan} bulan)`,
  };
};

const tentukanKategoriKehamilan = (usiaKehamilanMinggu) => {
  if (usiaKehamilanMinggu === null || usiaKehamilanMinggu < 0) {
    return {
      kategori_kehamilan: "unknown",
      kategori_kehamilan_label: "Belum diketahui",
    };
  } else if (usiaKehamilanMinggu <= 11) {
    return {
      kategori_kehamilan: "kurang_dari_3_bulan",
      kategori_kehamilan_label: "Kurang dari 3 bulan",
    };
  } else if (usiaKehamilanMinggu <= 27) {
    return {
      kategori_kehamilan: "kurang_dari_7_bulan",
      kategori_kehamilan_label: "Kurang dari 7 bulan",
    };
  }

  return {
    kategori_kehamilan: "tujuh_bulan_ke_atas",
    kategori_kehamilan_label: "7 bulan ke atas",
  };
};

const tentukanTrimester = (usiaKehamilanMinggu) => {
  if (usiaKehamilanMinggu === null || usiaKehamilanMinggu < 0) {
    return {
      trimester: "unknown",
      trimester_label: "Belum diketahui",
    };
  } else if (usiaKehamilanMinggu < 12) {
    return {
      trimester: "1",
      trimester_label: "Trimester 1",
    };
  } else if (usiaKehamilanMinggu <= 27) {
    return {
      trimester: "2",
      trimester_label: "Trimester 2",
    };
  }

  return {
    trimester: "3",
    trimester_label: "Trimester 3",
  };
};

function Kehamilan() {
  const [kategoriFilter, setKategoriFilter] = useState("all");

  return (
    <div className="page-theme kehamilan-page">
      <EntityPage
        title="Riwayat Kehamilan"
        description="Simpan informasi kehamilan aktif dan faktor risiko dasar ibu."
        endpoint="/kehamilan"
        fields={fields}
        columns={columns}
        transformRecord={(record, { ibuOptions }) => {
          const ibu = ibuOptions.find(
            (item) => String(item.id) === String(record.ibu_id)
          );
          const usiaKehamilan = hitungUsiaKehamilan(record.hpht);
          const kategoriKehamilan = tentukanKategoriKehamilan(usiaKehamilan.minggu);
          const trimesterInfo = tentukanTrimester(usiaKehamilan.minggu);

          return {
            ...record,
            ibu_nama: ibu ? ibu.nama : `Ibu ID ${record.ibu_id}`,
            ...usiaKehamilan,
            ...kategoriKehamilan,
            ...trimesterInfo,
          };
        }}
        filterRecords={(records) =>
          records.filter((record) =>
            kategoriFilter === "all"
              ? true
              : record.kategori_kehamilan === kategoriFilter
          )
        }
        renderTableControls={({ records, displayedRecords }) => (
          <div className="trimester-filter-card">
            <div>
              <p className="filter-label">Filter kehamilan berdasarkan lama kehamilan</p>
              <strong>
                {displayedRecords.length} dari {records.length} klien tampil
              </strong>
            </div>
            <div className="trimester-filter-group">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={
                    kategoriFilter === option.value
                      ? "trimester-filter-button active"
                      : "trimester-filter-button"
                  }
                  onClick={() => setKategoriFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default Kehamilan;
