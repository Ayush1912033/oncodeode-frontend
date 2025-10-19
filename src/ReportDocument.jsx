// Filename: ReportDocument.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// --- STYLES FOR THE PDF DOCUMENT ---
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Helvetica-Bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#3b82f6',
    fontFamily: 'Helvetica-Bold',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  patientSummary: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summaryItem: {
    width: '50%',
    marginBottom: 8,
  },
  itemLabel: {
    fontSize: 10,
    color: '#666',
  },
  itemValue: {
    fontSize: 12,
    color: '#000',
  },
  resultsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  resultCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 10,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 3,
  },
  resultValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#3b82f6',
  },
});

// --- THE PDF COMPONENT ---
const ReportDocument = ({ patient, results }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <Text style={styles.header}>OncoDecode Prediction Report</Text>

      {/* Patient Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Summary</Text>
        <View style={styles.patientSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Patient Name</Text>
            <Text style={styles.itemValue}>{patient?.fullName || "N/A"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Patient ID</Text>
            <Text style={styles.itemValue}>{patient?.patientId || "N/A"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Age</Text>
            <Text style={styles.itemValue}>{patient?.age || "N/A"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Gender</Text>
            <Text style={styles.itemValue}>{patient?.gender || "N/A"}</Text>
          </View>
        </View>
      </View>

      {/* Prediction Results Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prediction Results</Text>
        <View style={styles.resultsGrid}>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Predicted Cancer Type</Text>
            <Text style={styles.resultValue}>{results?.CancerType || "N/A"}</Text>
          </View>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Predicted Stage</Text>
            <Text style={styles.resultValue}>{results?.Stage || "N/A"}</Text>
          </View>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Survival Interpretation</Text>
            <Text style={styles.resultValue}>{results?.SurvivalInterpretation || "N/A"}</Text>
          </View>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Survival Risk Score</Text>
            <Text style={styles.resultValue}>
              {results?.SurvivalRiskScore !== undefined
                ? results.SurvivalRiskScore.toFixed(3)
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Visual Analysis Placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visual Analysis</Text>
        <Text style={styles.itemLabel}>[Charts and graphs will be included here in future versions]</Text>
      </View>

    </Page>
  </Document>
);

export default ReportDocument;
