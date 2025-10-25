// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import oncoLogo from "./assets/Gemini_Generated_Image_g5p0prg5p0prg5p0-removebg-preview.webp";

const OncoCodeLogo = () => (
  <img src={oncoLogo} alt="OncoDecode Logo" className="logo-img" />
);

const DashboardStyles = `
  body, html, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(180deg, #f7f3ff 0%, #efe6ff 50%, #f5e6ff 100%);
    color: #2d155a;
  }

  #dashboard-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 30px;
  }

  .dashboard-container {
    width: 100%;
    max-width: 1500px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(118, 55, 190, 0.15);
    padding: 35px 45px;
  }

  /* HEADER */
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #ede9fe;
    padding-bottom: 20px;
    margin-bottom: 30px;
  }

  .logo-img {
    width: 95px;
    height: auto;
    object-fit: contain;
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .company-name {
    font-size: 1.4rem;
    font-weight: 700;
    background: linear-gradient(90deg, #d26cfc, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .main-nav {
    display: flex;
    align-items: center;
  }

  .main-nav a {
    margin-left: 30px;
    text-decoration: none;
    color: #4a3b82;
    font-weight: 600;
    transition: all 0.3s ease;
    border-bottom: 2px solid transparent;
  }

  .main-nav a:hover,
  .main-nav a.active {
    color: #8b5cf6;
    border-bottom: 2px solid #8b5cf6;
  }

  /* HEADINGS */
  .welcome-message h1 {
    font-size: 2.4rem;
    font-weight: 700;
    color: #2d155a;
    margin-bottom: 30px;
    text-align: center; /* Centered */
  }

  .dashboard-section h2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #5b21b6;
    margin-bottom: 20px;
  }

  /* STATS */
  .stats-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .stat-card {
    flex: 1;
    background: #faf9ff;
    border: 1px solid #e5d4ff;
    border-radius: 16px;
    padding: 25px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(155, 92, 246, 0.15);
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 25px rgba(155, 92, 246, 0.25);
  }

  .stat-card .value {
    font-size: 2.6rem;
    font-weight: 700;
    color: #5b21b6;
  }

  .stat-card .label {
    font-size: 0.95rem;
    color: #555;
    margin-top: 5px;
  }

  /* BUTTONS */
  .actions-container {
    display: flex;
    justify-content: center; /* Centered buttons */
    gap: 20px;
    flex-wrap: wrap;
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 28px;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    background: linear-gradient(90deg, #8b5cf6, #ec4899);
    color: white;
    box-shadow: 0 6px 20px rgba(147, 51, 234, 0.3);
    transition: all 0.3s ease;
  }

  .action-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(147, 51, 234, 0.45);
  }

  /* GRID for Recent Reports + Activity */
  .reports-activity-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  .reports-list,
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .report-item {
    padding: 14px;
    border-radius: 10px;
    border: 1px solid #e9d5ff;
    background: #f7f4ff;
    color: #2d155a;
    font-weight: 500;
    box-shadow: 0 3px 10px rgba(147, 51, 234, 0.1);
  }

  .activity-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #faf9ff;
    border-radius: 10px;
    border: 1px solid #e9d5ff;
    box-shadow: 0 3px 10px rgba(155, 92, 246, 0.1);
  }

  .patient-avatar {
    font-size: 36px;
    color: #8b5cf6;
  }

  .patient-name {
    font-weight: 600;
    color: #2d155a;
  }

  .patient-subtext {
    font-size: 0.9rem;
    color: #6b21a8;
  }

  .patient-codes {
    text-align: right;
    color: #4c1d95;
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem("doctorId");
  const token = localStorage.getItem("token");

  const [totalPatients, setTotalPatients] = useState(0);
  const [pendingClassification, setPendingClassification] = useState(0);
  const [recentReports, setRecentReports] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientRes = await fetch(`http://localhost:5000/api/patients/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const patients = await patientRes.json();
        setTotalPatients(patients.length);

        const analysisRes = await fetch(
          `http://localhost:5000/api/analysis/all?doctorId=${doctorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const analyses = await analysisRes.json();

        if (!Array.isArray(analyses)) {
          setPendingClassification(patients.length);
          setRecentReports([]);
          return;
        }

        const analyzedPatientIds = new Set(analyses.map((a) => a.patientId));
        const pending = patients.filter((p) => !analyzedPatientIds.has(p._id));
        setPendingClassification(pending.length);

        setRecentReports(analyses.slice(-5).reverse());
        setRecentPatients(patients.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    if (doctorId) fetchData();
  }, [doctorId, token]);

  return (
    <>
      <style>{DashboardStyles}</style>
      <div id="dashboard-page">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div className="logo-area">
              <OncoCodeLogo />
            </div>
            <nav className="main-nav">
              <a href="#" className="active">Home</a>
              <a href="/analysis">Analysis</a>
              <a href="/login">Logout</a>
            </nav>
          </header>

          <main>
            <div className="welcome-message">
              <h1>Welcome to OncoDecode</h1>
            </div>

            {/* Stats */}
            <section className="dashboard-section">
              <h2>Overview</h2>
              <div className="stats-container">
                <div className="stat-card">
                  <div className="value">{totalPatients}</div>
                  <div className="label">Total Patients</div>
                </div>
                <div className="stat-card">
                  <div className="value">{pendingClassification}</div>
                  <div className="label">Pending Classifications</div>
                </div>
              </div>
            </section>

            {/* Main Actions */}
            <section className="dashboard-section">
              <h2>Main Actions</h2>
              <div className="actions-container">
                <button className="action-btn" onClick={() => navigate('/search_patient')}>
                  <FaSearch /> Search Patient
                </button>
                <button className="action-btn" onClick={() => navigate('/add_patient')}>
                  <FaPlus /> Add Patient
                </button>
              </div>
            </section>

            {/* Reports + Activity Side-by-Side */}
            <section className="dashboard-section reports-activity-grid">
              <div>
                <h2>Recent Reports</h2>
                <div className="reports-list">
                  {recentReports.length > 0 ? (
                    recentReports.map((r, i) => (
                      <div key={i} className="report-item">
                        <strong>{r.CancerType}</strong> – {r.Stage} ({r.SurvivalInterpretation})
                      </div>
                    ))
                  ) : (
                    <p>No recent reports.</p>
                  )}
                </div>
              </div>

              <div>
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  {recentPatients.length > 0 ? (
                    recentPatients.map((p) => (
                      <div key={p._id} className="activity-item">
                        <div className="patient-details">
                          <FaUserCircle className="patient-avatar" />
                          <div>
                            <div className="patient-name">{p.fullName}</div>
                            <div className="patient-subtext">{p.patientId}</div>
                          </div>
                        </div>
                        <div className="patient-codes">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No recent patients.</p>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
