// PatientAnalysis.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportDocument from "./ReportDocument";

const OncoCodeLogo = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M45 5C22.9086 5 5 22.9086 5 45V45H45V5Z"
      stroke="#333"
      strokeWidth="6"
    />
    <path
      d="M55 5H95V45H55V5Z"
      stroke="#333"
      strokeWidth="6"
    />
    <path
      d="M5 55H45V95H5V55Z"
      stroke="#333"
      strokeWidth="6"
    />
    <path
      d="M55 95C77.0914 95 95 77.0914 95 55V55H55V95Z"
      stroke="#333"
      strokeWidth="6"
    />
  </svg>
);

const styles = `
  body, html, #root { margin: 0; padding: 0; width: 100%; height: 100%; font-family: 'Segoe UI', sans-serif; }
  #patient-analysis-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f7fa; padding: 20px; box-sizing: border-box; }
  .analysis-container { width: 100%; max-width: 1100px; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); padding: 30px 40px; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
  .logo-area { display: flex; align-items: center; gap: 15px; }
  .company-name { font-size: 1.2rem; font-weight: 600; color: #333; }
  .tagline { font-size: 0.8rem; color: #888; margin-top: 2px; }
  .main-nav a { text-decoration: none; color: #555; margin-left: 30px; font-weight: 500; }
  .page-title h1 { font-size: 2.2rem; color: #222; margin: 0; }
  .page-title p { font-size: 1rem; color: #777; margin: 5px 0 30px 0; }
  .section-heading { font-size: 1.2rem; color: #666; margin-bottom: 20px; font-weight: 600; }
  .patient-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
  .summary-card { padding: 15px; border: 1px solid #eee; border-radius: 10px; background: #fafbff; }
  .summary-label { font-size: 0.9rem; color: #777; }
  .summary-value { font-size: 1.1rem; font-weight: 600; color: #333; }
  .predictions-grid { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 40px; }
  .prediction-card { flex: 1; background-color: #fff; border: 1px solid #eee; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  .prediction-card .title { font-size: 0.9rem; font-weight: 600; color: #555; }
  .prediction-card .result { font-size: 1.2rem; font-weight: 600; color: #333; margin: 10px 0; }
  .progress-wrapper { width: 100px; margin: 15px auto 0; }
  .action-buttons { display: flex; justify-content: center; gap: 20px; margin-top: 30px; }
  .action-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 35px; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; background: linear-gradient(to right, #4a90e2, #3b82f6); color: white; text-decoration: none; }
  .action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59,130,246,0.3); }
`;

const PatientAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/patients/single/${id}`);
        if (!res.ok) throw new Error("Failed to fetch patient details");
        const data = await res.json();
        setPatient(data);
      } catch (err) {
        console.error("Error fetching patient:", err);
      }
    };

    const fetchAnalysis = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/analysis/${id}`);
        if (!res.ok) throw new Error("Failed to fetch analysis");
        const data = await res.json();
        if (data.length > 0) {
          setAnalysis(data[data.length - 1]); // latest
        }
      } catch (err) {
        console.error("Error fetching analysis:", err);
      }
    };

    fetchPatient();
    fetchAnalysis();
  }, [id]);

  if (!patient || !analysis) {
    return <div>Loading patient analysis...</div>;
  }

  return (
    <>
      <style>{styles}</style>
      <div id="patient-analysis-page">
        <div className="analysis-container">
          <header className="header">
            <div className="logo-area">
              <OncoCodeLogo />
              <div>
                <div className="company-name">ONCODECODE</div>
                <div className="tagline">Precision Oncology, Simplified</div>
              </div>
            </div>
            <nav className="main-nav">
              <a href="/dashboard">Home</a>
              <a href="#">Settings</a>
              <a href="/login">Logout</a>
            </nav>
          </header>

          <main>
            <div className="page-title">
              <h1>Patient Analysis</h1>
              <p>Comprehensive prediction report</p>
            </div>

            {/* Patient Summary */}
            <section>
              <h2 className="section-heading">Patient Summary</h2>
              <div className="patient-summary">
                <div className="summary-card">
                  <div className="summary-label">Name</div>
                  <div className="summary-value">{patient.fullName}</div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Patient ID</div>
                  <div className="summary-value">{patient.patientId}</div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Age</div>
                  <div className="summary-value">{patient.age}</div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Gender</div>
                  <div className="summary-value">{patient.gender}</div>
                </div>
              </div>
            </section>

            {/* Predictions */}
            <section>
              <h2 className="section-heading">Cancer Predictions</h2>
              <div className="predictions-grid">
                <div className="prediction-card">
                  <div className="title">Cancer Type Prediction</div>
                  <div className="result">{analysis.CancerType}</div>
                </div>
                <div className="prediction-card">
                  <div className="title">Stage Prediction</div>
                  <div className="result">{analysis.Stage}</div>
                </div>
                <div className="prediction-card">
                  <div className="title">Survival Risk</div>
                  <div className="result">
                    {analysis.SurvivalInterpretation}
                    <br />
                    Score: {analysis.SurvivalRiskScore.toFixed(2)}
                  </div>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="action-buttons">
              
              <PDFDownloadLink
                document={<ReportDocument patient={patient} results={analysis} />}
                fileName={`OncoDecode_Report_${id}.pdf`}
                className="action-btn"
              >
                {({ loading }) =>
                  loading ? "Generating Report..." : "Generate Report"
                }
              </PDFDownloadLink>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default PatientAnalysis;
