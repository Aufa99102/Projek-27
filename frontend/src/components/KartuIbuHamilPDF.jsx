import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontSize: 9
  },

  header: {
    textAlign: "center",
    marginBottom: 8
  },

  bold: {
    fontWeight: "bold"
  },

  line: {
    borderBottom: "1 solid black",
    marginVertical: 5
  },

  table: {
    display: "table",
    width: "100%",
    border: "1 solid black"
  },

  tableRow: {
    flexDirection: "row"
  },

  tableCell: {
    borderRight: "1 solid black",
    borderBottom: "1 solid black",
    padding: 3,
    flex: 1
  },

  label: {
    width: 120
  },

  row: {
    flexDirection: "row",
    marginBottom: 3
  }
});

const KartuIbuHamilPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text>PEMERINTAH KOTA MAKASSAR</Text>
        <Text>DINAS KESEHATAN</Text>
        <Text style={styles.bold}>UPT PUSKESMAS</Text>
        <Text style={styles.bold}>KARTU IBU HAMIL</Text>
      </View>

      <View style={styles.line} />

      {/* IDENTITAS */}
      <View>
        <View style={styles.row}>
          <Text style={styles.label}>Nama</Text>
          <Text>: {data.nama || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>NIK</Text>
          <Text>: {data.nik || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nama Suami</Text>
          <Text>: {data.nama_suami || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Alamat</Text>
          <Text>: {data.alamat || "-"}</Text>
        </View>
      </View>

      <View style={styles.line} />

      {/* DATA MEDIS */}
      <View>
        <View style={styles.row}>
          <Text style={styles.label}>Golongan Darah</Text>
          <Text>: {data.golongan_darah || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>HB</Text>
          <Text>: {data.hb || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>HIV</Text>
          <Text>: {data.status_hiv || "-"}</Text>
        </View>
      </View>

      <View style={styles.line} />

      {/* TABEL PEMERIKSAAN */}
      <Text style={{ marginBottom: 5 }}>RIWAYAT PEMERIKSAAN</Text>

      <View style={styles.table}>
        {/* HEADER */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Tanggal</Text>
          <Text style={styles.tableCell}>Usia Kehamilan</Text>
          <Text style={styles.tableCell}>TD</Text>
          <Text style={styles.tableCell}>BB</Text>
          <Text style={styles.tableCell}>Keterangan</Text>
        </View>

        {(data.pemeriksaan || []).map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.tanggal_kunjungan}</Text>
            <Text style={styles.tableCell}>{item.usia_kehamilan}</Text>
            <Text style={styles.tableCell}>{item.tekanan_darah}</Text>
            <Text style={styles.tableCell}>{item.berat_badan}</Text>
            <Text style={styles.tableCell}>{item.keterangan}</Text>
          </View>
        ))}

        {(!data.pemeriksaan || data.pemeriksaan.length === 0) && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>-</Text>
          </View>
        )}
      </View>

    </Page>
  </Document>
);

export default KartuIbuHamilPDF;
