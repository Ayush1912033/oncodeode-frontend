import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "./assets/logoReport.png"; // ✅ Ensure this is a PNG or JPG, not WEBP

// ===================== STYLES =====================
const styles = StyleSheet.create({
  page: {
    paddingTop: 100,
    paddingHorizontal: 50,
    paddingBottom: 60,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },

  // --- Header (Professional Letterhead) ---
  header: {
    position: "absolute",
    top: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#d4d4d4",
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 2,
    alignItems: "center",
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1E3A8A",
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#6B7280",
  },
  headerDate: {
    fontSize: 10,
    color: "#6B7280",
  },

  // --- Section Titles ---
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1E3A8A",
    marginBottom: 6,
    borderBottomWidth: 0.8,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 3,
  },

  // --- Patient Details ---
  patientDetails: {
    marginTop: 10,
    marginBottom: 25,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    width: "40%",
    fontSize: 11,
    color: "#4B5563",
  },
  detailValue: {
    width: "60%",
    fontSize: 11,
    color: "#111827",
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
  },

  // --- Results Section ---
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 11,
    color: "#4B5563",
  },
  resultValue: {
    fontSize: 12,
    color: "#1D4ED8",
    fontFamily: "Helvetica-Bold",
  },

  // --- Doctor Signature ---
  signatureSection: {
    marginTop: 40,
    textAlign: "right",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: 150,
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  signatureText: {
    fontSize: 10,
    color: "#374151",
  },

  // --- Footer ---
  footer: {
    position: "absolute",
    bottom: 25,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#D1D5DB",
    paddingTop: 6,
    textAlign: "center",
    fontSize: 9,
    color: "#6B7280",
  },
  pageNumber: {
    position: "absolute",
    bottom: 25,
    right: 50,
    fontSize: 9,
    color: "#9CA3AF",
  },
});

// ===================== COMPONENT =====================
const ReportDocument = ({ patient, results }) => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image style={styles.logo} src={logo} />
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>OncoDecode Prediction Report</Text>
            <Text style={styles.headerSubtitle}>
              AI-based Cancer Type, Stage & Survival Prediction System
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Generated on: {currentDate}</Text>
          </View>
        </View>

        {/* ---------- PATIENT DETAILS ---------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Summary</Text>
          <View style={styles.patientDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Patient Name</Text>
              <Text style={styles.detailValue}>
                {patient?.fullName || "N/A"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Patient ID</Text>
              <Text style={styles.detailValue}>
                {patient?.patientId || "N/A"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Age</Text>
              <Text style={styles.detailValue}>{patient?.age || "N/A"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>{patient?.gender || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* ---------- PREDICTION RESULTS ---------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prediction Results</Text>
          <View style={{ marginTop: 10 }}>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Predicted Cancer Type</Text>
              <Text style={styles.resultValue}>
                {results?.CancerType || "N/A"}
              </Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Predicted Stage</Text>
              <Text style={styles.resultValue}>
                {results?.Stage || "N/A"}
              </Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Survival Interpretation</Text>
              <Text style={styles.resultValue}>
                {results?.SurvivalInterpretation || "N/A"}
              </Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Survival Risk Score</Text>
              <Text style={styles.resultValue}>
                {results?.SurvivalRiskScore !== undefined
                  ? results.SurvivalRiskScore.toFixed(3)
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* ---------- DOCTOR SIGNATURE ---------- */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Doctor’s Signature</Text>
        </View>

        {/* ---------- FOOTER ---------- */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
        <View style={styles.footer}>
          <Text>
            ⚠️ Confidential Medical Report. For authorized personnel only.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReportDocument;
