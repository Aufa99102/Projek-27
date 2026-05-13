import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 8, fontFamily: "Helvetica" },
  
  // Header
  kopContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  logoBox: { width: 50, height: 50, borderWidth: 1, borderColor: "#000", justifyContent: "center", alignItems: "center" },
  logoText: { fontSize: 8, textAlign: "center" },
  kopTextContainer: { flex: 1, textAlign: "center", paddingHorizontal: 10 },
  kopPemerintah: { fontSize: 12, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  kopDinas: { fontSize: 12, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  kopPuskesmas: { fontSize: 14, fontWeight: "bold", fontFamily: "Helvetica-Bold", marginVertical: 2 },
  kopAlamat: { fontSize: 8 },
  
  kopBorder: { borderBottomWidth: 3, borderBottomColor: "#000", borderBottomStyle: "solid", marginBottom: 5 },
  
  // Judul
  judulContainer: { backgroundColor: "#000", paddingVertical: 4, marginBottom: 10, textAlign: "center" },
  judulText: { color: "#FFF", fontSize: 12, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  
  // Identitas & Riwayat
  twoColumnContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  colHalf: { width: "48%" },
  rowFlex: { flexDirection: "row", marginBottom: 3 },
  labelId: { width: 100 },
  colon: { width: 10 },
  valueId: { flex: 1, borderBottomWidth: 1, borderBottomColor: "#ccc", borderBottomStyle: "dotted" },
  
  separator: { borderBottomWidth: 1, borderBottomColor: "#000", borderBottomStyle: "solid", marginVertical: 5 },
  
  // Tabel Master
  table: { width: "100%", borderWidth: 1, borderColor: "#000", marginBottom: 10, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { flexDirection: "row" },
  tableColHeader: { borderWidth: 1, borderColor: "#000", borderLeftWidth: 0, borderTopWidth: 0, padding: 4, justifyContent: "center", alignItems: "center", backgroundColor: "#e0e0e0" },
  tableCol: { borderWidth: 1, borderColor: "#000", borderLeftWidth: 0, borderTopWidth: 0, padding: 4, justifyContent: "center", alignItems: "center" },
  
  // Custom for ANC table
  ancHeader: { fontSize: 7, fontWeight: "bold", fontFamily: "Helvetica-Bold", textAlign: "center" },
  ancCell: { fontSize: 7, textAlign: "center" },
  ancCellLeft: { fontSize: 7, textAlign: "left" },
  
  checkboxContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 },
  checkboxLabel: { fontSize: 7 },
  checkbox: { width: 8, height: 8, borderWidth: 1, borderColor: "#000" },
});

const KartuIbuHamilPDF = ({ data = {} }) => {
  const pemeriksaan = data.pemeriksaan || [];
  const minRows = 11;
  const emptyRows = Math.max(minRows - pemeriksaan.length, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* KOP SURAT */}
        <View style={styles.kopContainer}>
          <View style={styles.logoBox}><Text style={styles.logoText}>Logo Makassar</Text></View>
          <View style={styles.kopTextContainer}>
            <Text style={styles.kopPemerintah}>PEMERINTAH KOTA MAKASSAR</Text>
            <Text style={styles.kopDinas}>DINAS KESEHATAN</Text>
            <Text style={styles.kopPuskesmas}>UPT PUSKESMAS PATTINGALLOANG</Text>
            <Text style={styles.kopAlamat}>Jl. Barukang VI No.15, Pattingalloang, Kec. Ujung Tanah, Kota Makassar, Telp/Email: ...</Text>
          </View>
          <View style={styles.logoBox}><Text style={styles.logoText}>Logo Puskesmas</Text></View>
        </View>
        <View style={styles.kopBorder} />

        {/* JUDUL FORMULIR */}
        <View style={styles.judulContainer}>
          <Text style={styles.judulText}>KARTU IBU HAMIL</Text>
        </View>

        {/* BAGIAN IDENTITAS */}
        <View style={styles.twoColumnContainer}>
          {/* KIRI */}
          <View style={styles.colHalf}>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Nama</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.nama || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Tanggal Lahir</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.tanggal_lahir || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Nama Suami</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.nama_suami || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Alamat</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.alamat || ""}</Text>
            </View>
          </View>
          {/* KANAN */}
          <View style={styles.colHalf}>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>No. Rekam Medis</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.no_rekam_medis || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Jenis Kepesertaan</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>Jaminan Kesehatan</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>No. JKN</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.no_jkn || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>NIK</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.nik || ""}</Text>
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        {/* BAGIAN RIWAYAT MEDIS & FISIK */}
        <View style={styles.twoColumnContainer}>
          {/* KIRI */}
          <View style={styles.colHalf}>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>G-P-A</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>G....... P....... A.......</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>KB Sebelumnya</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}></Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Riwayat Persalinan</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.persalinan?.jenis_persalinan || "Normal / SC / ........"}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Riwayat Komplikasi</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.kehamilan?.riwayat_penyakit || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Tinggi Badan (TB)</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}></Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>LILA</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.lila || ""}</Text>
            </View>
            <View style={{ marginTop: 5, marginBottom: 2 }}><Text style={{ fontWeight: "bold", fontFamily: "Helvetica-Bold" }}>Hasil Lab:</Text></View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Gol. Darah</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.golongan_darah || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Reduksi</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}></Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>HIV</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.status_hiv || ""}</Text>
            </View>
          </View>
          
          {/* KANAN */}
          <View style={styles.colHalf}>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>HPHT</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.kehamilan?.hpht || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>HTP</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.kehamilan?.hpl || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Jarak Kehamilan</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.kehamilan?.jarak_kehamilan || "...... Thn ...... Bln"}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Status Imunisasi TT</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.kehamilan?.status_imunisasi || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>BB Sebelum Hamil</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.kehamilan?.bb_sebelum_hamil || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>IMT</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.kehamilan?.imt || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>HB</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.hb || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>Albumin</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.lab?.albumin || ""}</Text>
            </View>
            <View style={styles.rowFlex}>
              <Text style={styles.labelId}>HBsAg</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueId}>{data.lab?.hbsag || ""}</Text>
            </View>
          </View>
        </View>

        {/* TABEL RENCANA PERSALINAN */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { flex: 2 }]}><Text style={styles.ancHeader}>PENOLONG</Text></View>
            <View style={[styles.tableColHeader, { flex: 2 }]}><Text style={styles.ancHeader}>TEMPAT</Text></View>
            <View style={[styles.tableColHeader, { flex: 2 }]}><Text style={styles.ancHeader}>PENDAMPING</Text></View>
            <View style={[styles.tableColHeader, { flex: 2 }]}><Text style={styles.ancHeader}>TRANSPORTASI</Text></View>
            <View style={[styles.tableColHeader, { flex: 4 }]}><Text style={styles.ancHeader}>CALON PENDONOR</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { flex: 2, justifyContent: "center" }]}><Text style={styles.ancCell}>{data.rencana?.penolong || ""}</Text></View>
            <View style={[styles.tableCol, { flex: 2, justifyContent: "center" }]}><Text style={styles.ancCell}>{data.rencana?.tempat || ""}</Text></View>
            <View style={[styles.tableCol, { flex: 2, justifyContent: "center" }]}><Text style={styles.ancCell}>{data.rencana?.pendamping || ""}</Text></View>
            <View style={[styles.tableCol, { flex: 2, justifyContent: "center" }]}><Text style={styles.ancCell}>{data.rencana?.transportasi || ""}</Text></View>
            <View style={[styles.tableCol, { flex: 4, padding: 0 }]}>
              <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "#000" }}>
                <View style={{ flex: 1, borderRightWidth: 1, borderColor: "#000", padding: 4 }}><Text style={styles.ancCellLeft}>1.</Text></View>
                <View style={{ flex: 1, padding: 4 }}><Text style={styles.ancCellLeft}>2.</Text></View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1, borderRightWidth: 1, borderColor: "#000", padding: 4 }}><Text style={styles.ancCellLeft}>3.</Text></View>
                <View style={{ flex: 1, padding: 4 }}><Text style={styles.ancCellLeft}>4.</Text></View>
              </View>
            </View>
          </View>
        </View>

        {/* TABEL CATATAN PEMERIKSAAN (ANC) */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "12%" }]}><Text style={styles.ancHeader}>Tgl. Kunj</Text></View>
            <View style={[styles.tableColHeader, { width: "10%" }]}><Text style={styles.ancHeader}>GESTASI</Text></View>
            <View style={[styles.tableColHeader, { width: "10%" }]}><Text style={styles.ancHeader}>TD</Text></View>
            <View style={[styles.tableColHeader, { width: "8%" }]}><Text style={styles.ancHeader}>BB</Text></View>
            <View style={[styles.tableColHeader, { width: "25%" }]}><Text style={styles.ancHeader}>HASIL PEMERIKSAAN TERAPI</Text></View>
            <View style={[styles.tableColHeader, { width: "15%" }]}><Text style={styles.ancHeader}>KET</Text></View>
            <View style={[styles.tableColHeader, { width: "20%" }]}><Text style={styles.ancHeader}>Tgl Kembali &{"\n"}Pemeriksaan</Text></View>
          </View>

          {/* Render Data Rows */}
          {pemeriksaan.map((item, i) => (
            <View key={`data-${i}`} style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "12%" }]}><Text style={styles.ancCell}>{item.tanggal_kunjungan}</Text></View>
              <View style={[styles.tableCol, { width: "10%" }]}><Text style={styles.ancCell}>{item.usia_kehamilan}</Text></View>
              <View style={[styles.tableCol, { width: "10%" }]}><Text style={styles.ancCell}>{item.tekanan_darah}</Text></View>
              <View style={[styles.tableCol, { width: "8%" }]}><Text style={styles.ancCell}>{item.berat_badan}</Text></View>
              <View style={[styles.tableCol, { width: "25%", alignItems: "flex-start" }]}><Text style={styles.ancCellLeft}>{item.hasil_pemeriksaan}{item.terapi ? `\nTerapi: ${item.terapi}` : ""}</Text></View>
              <View style={[styles.tableCol, { width: "15%", alignItems: "stretch", padding: 2 }]}>
                <View style={styles.checkboxContainer}><Text style={styles.checkboxLabel}>R/ dr</Text><View style={styles.checkbox} /></View>
                <View style={styles.checkboxContainer}><Text style={styles.checkboxLabel}>R/ Gizi</Text><View style={styles.checkbox} /></View>
                <View style={styles.checkboxContainer}><Text style={styles.checkboxLabel}>Inj. TD</Text><View style={styles.checkbox} /></View>
              </View>
              <View style={[styles.tableCol, { width: "20%", alignItems: "flex-start" }]}><Text style={styles.ancCellLeft}>{item.tanggal_kembali}</Text></View>
            </View>
          ))}

          {/* Render Empty Rows */}
          {Array.from({ length: emptyRows }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "12%", height: 35 }]}><Text style={styles.ancCell}></Text></View>
              <View style={[styles.tableCol, { width: "10%" }]}><Text style={styles.ancCell}></Text></View>
              <View style={[styles.tableCol, { width: "10%" }]}><Text style={styles.ancCell}></Text></View>
              <View style={[styles.tableCol, { width: "8%" }]}><Text style={styles.ancCell}></Text></View>
              <View style={[styles.tableCol, { width: "25%" }]}><Text style={styles.ancCell}></Text></View>
              <View style={[styles.tableCol, { width: "15%", alignItems: "stretch", padding: 2 }]}>
                <View style={styles.checkboxContainer}><Text style={styles.checkboxLabel}>R/ dr</Text><View style={styles.checkbox} /></View>
                <View style={styles.checkboxContainer}><Text style={styles.checkboxLabel}>R/ Gizi</Text><View style={styles.checkbox} /></View>
                <View style={styles.checkboxContainer}><Text style={styles.checkboxLabel}>Inj. TD</Text><View style={styles.checkbox} /></View>
              </View>
              <View style={[styles.tableCol, { width: "20%" }]}><Text style={styles.ancCell}></Text></View>
            </View>
          ))}
        </View>

      </Page>
    </Document>
  );
};

export default KartuIbuHamilPDF;
