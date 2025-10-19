// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaUserCircle, FaFileAlt, FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OncoCodeLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 5C22.9086 5 5 22.9086 5 45V45H45V5Z" stroke="#333" strokeWidth="6" />
    <path d="M55 5H95V45H55V5Z" stroke="#333" strokeWidth="6" />
    <path d="M5 55H45V95H5V55Z" stroke="#333" strokeWidth="6" />
    <path d="M55 95C77.0914 95 95 77.0914 95 55V55H55V95Z" stroke="#333" strokeWidth="6" />
  </svg>
);

const DashboardStyles = `
  body, html, #root { margin: 0; padding: 0; width: 100%; height: 100%; font-family: 'Segoe UI', sans-serif; }
  #dashboard-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f7fa; padding: 20px; }
  .dashboard-container { width: 100%; max-width: 1100px; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); padding: 30px 40px; }
  .dashboard-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
  .logo-area { display: flex; align-items: center; gap: 15px; }
  .company-name { font-size: 1.2rem; font-weight: 600; color: #333; }
  .tagline { font-size: 0.8rem; color: #888; margin-top: 2px; }
  .main-nav a { margin-left: 30px; text-decoration: none; color: #555; font-weight: 500; }
  .main-nav a.active { color: #3b82f6; border-bottom: 2px solid #3b82f6; }
  .welcome-message h1 { font-size: 2.5rem; color: #222; margin-bottom: 30px; }
  .dashboard-section { margin-bottom: 40px; }
  .dashboard-section h2 { font-size: 1.1rem; color: #666; margin-bottom: 20px; font-weight: 500; }
  .stats-container { display: flex; gap: 20px; }
  .stat-card { flex: 1; background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  .stat-card .value { font-size: 2.5rem; font-weight: 600; color: #333; }
  .stat-card .label { font-size: 0.9rem; color: #777; margin-top: 5px; }
  .actions-container { display: flex; gap: 20px; }
  .action-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 25px; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-primary { background: linear-gradient(to right, #4a90e2, #3b82f6); color: white; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59,130,246,0.3); }
  .activity-list { display: flex; flex-direction: column; gap: 15px; }
  .activity-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #fcfcfc; border-radius: 10px; border: 1px solid #eee; }
  .patient-details { display: flex; align-items: center; gap: 15px; }
  .patient-avatar { font-size: 36px; color: #ccc; }
  .patient-name { font-weight: 600; color: #444; }
  .patient-subtext { font-size: 0.9rem; color: #888; }
  .patient-codes { text-align: right; color: #555; font-size: 0.9rem; font-weight: 500; }
  .reports-list { display: flex; flex-direction: column; gap: 10px; }
  .report-item { padding: 12px; border-radius: 10px; border: 1px solid #eee; background: #fafbff; }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem("doctorId"); // stored after login
  const token = localStorage.getItem("token");

  const [totalPatients, setTotalPatients] = useState(0);
  const [pendingClassification, setPendingClassification] = useState(0);
  const [recentReports, setRecentReports] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all patients
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
  console.error("Invalid analyses response:", analyses);
  setPendingClassification(patients.length);
  setRecentReports([]);
  return;
}



        // Pending classification = patients without analysis
        const analyzedPatientIds = new Set(analyses.map((a) => a.patientId));
        const pending = patients.filter((p) => !analyzedPatientIds.has(p._id));
        setPendingClassification(pending.length);

        // Recent reports = last 5 analyses
        setRecentReports(analyses.slice(-5).reverse());

        // Recent patients = last 5 patients
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
              <div>
                <div className="company-name">ONCODECODE</div>
                <div className="tagline">Precision Oncology, Simplified</div>
              </div>
            </div>
            <nav className="main-nav">
              <a href="#" className="active">Home</a>
              <a href="#">Settings</a>
              <a href="/login">Logout</a>
            </nav>
          </header>

          <main>
            <div className="welcome-message"><h1>Welcome to OncoDecode</h1></div>

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
                <button className="action-btn btn-primary" onClick={() => navigate('/search_patient')}>
                  <FaSearch /> Search Patient
                </button>
                <button className="action-btn btn-primary" onClick={() => navigate('/add_patient')}>
                  <FaPlus /> Add Patient
                </button>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="dashboard-section">
              
            </section>

            {/* Recent Reports */}
            <section className="dashboard-section">
              <h2>Recent Reports</h2>
              <div className="reports-list">
                {recentReports.length > 0 ? (
                  recentReports.map((r, i) => (
                    <div key={i} className="report-item">
                      <strong>{r.CancerType}</strong> – {r.Stage} ({r.SurvivalInterpretation})
                    </div>
                  ))
                ) : <p>No recent reports.</p>}
              </div>
            </section>

            {/* Recent Activity */}
            <section className="dashboard-section">
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
                      <div className="patient-codes">{new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))
                ) : <p>No recent patients.</p>}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
