// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import oncoLogo from "./assets/logoReport.png"; // ✅ PNG logo
import Lottie from "lottie-react";
import heroAnimation from "./assets/doctor.json"; // ✅ Download any Lottie animation from lottiefiles.com
import AOS from "aos";
import "aos/dist/aos.css";



const Dashboard = () => {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem("doctorId");
  const token = localStorage.getItem("token");

  const [totalPatients, setTotalPatients] = useState(0);
  const [pendingClassification, setPendingClassification] = useState(0);
  const [recentReports, setRecentReports] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

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
      <style>{`
        body, html, #root {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', sans-serif;
          scroll-behavior: smooth;
          background: #f7f3ff;
        }

        /* --- FIXED HEADER --- */
        .fixed-header {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 60px;
          z-index: 10;
          box-shadow: 0 2px 12px rgba(147, 51, 234, 0.1);
          animation: slideDown 1s ease forwards;
        }

        @keyframes slideDown {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-logo {
          width: 55px;
          height: auto;
          animation: slideInLeft 1.2s ease forwards;
        }

        @keyframes slideInLeft {
          from { transform: translateX(-80px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .header-title {
          font-weight: 700;
          font-size: 1.3rem;
          background: linear-gradient(90deg, #d26cfc, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-links a {
          margin-left: 30px;
          text-decoration: none;
          font-weight: 600;
          color: #4b1f8c;
          transition: color 0.3s ease;
        }

        .nav-links a:hover {
          color: #8b5cf6;
        }

        /* --- HERO SECTION --- */
        .hero-section {
          min-height: 100vh;
          background: linear-gradient(120deg, #8b5cf6, #ec4899);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: left;
          padding: 0 80px;
          margin-top: 70px; /* header offset */
          overflow: hidden;
        }

        .hero-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          width: 100%;
          gap: 80px;
        }

        .hero-text {
          flex: 1;
          animation: slideInRight 1.2s ease forwards;
        }

        @keyframes slideInRight {
          from { transform: translateX(80px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .hero-text h1 {
          font-size: 3.2rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .hero-text p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 30px;
        }

        .hero-animation {
          flex: 1;
          width: 450px;
          will-change: transform;
          transform: translateZ(0);
          animation: floatAnimation 6s ease-in-out infinite alternate;
        }

        @keyframes floatAnimation {
          from { transform: translateY(0) scale(1); }
          to { transform: translateY(-10px) scale(1.02); }
        }

        .scroll-down {
          position: absolute;
          bottom: 40px;
          font-size: 1.1rem;
          animation: bounce 2s infinite;
          cursor: pointer;
          color: #fff;
          left: 50%;
          transform: translateX(-50%);
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }

        /* --- DASHBOARD CONTENT --- */
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 30px 30px 0 0;
          box-shadow: 0 -5px 30px rgba(147, 51, 234, 0.08);
          padding: 70px 50px;
        }

        section {
          margin-bottom: 50px;
        }

        h2 {
          color: #5b21b6;
          margin-bottom: 15px;
        }

        .stats-container {
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
        }

        .stat-card {
          flex: 1;
          background: #faf9ff;
          border: 1px solid #e5d4ff;
          border-radius: 16px;
          padding: 25px;
          text-align: center;
          box-shadow: 0 4px 10px rgba(155, 92, 246, 0.15);
          transition: transform 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .value {
          font-size: 2.4rem;
          font-weight: 700;
          color: #5b21b6;
        }

        .label {
          font-size: 1rem;
          color: #555;
        }

        .actions-container {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .action-btn {
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
          border: none;
          border-radius: 10px;
          color: white;
          padding: 14px 28px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 20px rgba(147, 51, 234, 0.3);
          transition: all 0.3s;
        }

        .action-btn:hover {
          transform: translateY(-3px);
        }

        .reports-activity-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .report-item, .activity-item {
          padding: 14px;
          border-radius: 10px;
          background: #f8f6ff;
          border: 1px solid #e9d5ff;
          box-shadow: 0 3px 10px rgba(155, 92, 246, 0.08);
        }

        .patient-info {
          display: flex;
          align-items: center;
          gap: 10px;
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
      `}</style>

      <div id="dashboard-page">
        {/* FIXED HEADER */}
        <div className="fixed-header">
          <div className="header-left">
            <img src={oncoLogo} alt="OncoDecode Logo" className="header-logo" />
            <span className="header-title">OncoDecode</span>
          </div>
          <div className="nav-links">
            <a href="#" className="active">Home</a>
            <a href="/analysis">Analysis</a>
            <a href="/login">Logout</a>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-inner">
            <Lottie
              animationData={heroAnimation}
              loop
              autoplay
              className="hero-animation"
            />
            <div className="hero-text">
              <h1>Welcome to OncoDecode</h1>
              <p>Empowering Doctors with AI-driven Cancer Analysis</p>
            </div>
          </div>

          <div
            className="scroll-down"
            onClick={() =>
              document.getElementById("dashboard-main").scrollIntoView({ behavior: "smooth" })
            }
          >
            ↓ Scroll Down
          </div>
        </section>

        {/* DASHBOARD CONTENT */}
        <div id="dashboard-main" className="dashboard-container">
          {/* Overview */}
          <section data-aos="fade-up">
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
          <section data-aos="fade-up">
            <h2>Main Actions</h2>
            <div className="actions-container">
              <button className="action-btn" onClick={() => navigate("/search_patient")}>
                <FaSearch /> Search Patient
              </button>
              <button className="action-btn" onClick={() => navigate("/add_patient")}>
                <FaPlus /> Add Patient
              </button>
            </div>
          </section>

          {/* Recent Activity + Reports */}
          <section className="reports-activity-grid" data-aos="fade-up">
            <div>
              <h2>Recent Reports</h2>
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

            <div>
              <h2>Recent Activity</h2>
              {recentPatients.length > 0 ? (
                recentPatients.map((p) => (
                  <div key={p._id} className="activity-item">
                    <div className="patient-info">
                      <FaUserCircle style={{ fontSize: "32px", color: "#8b5cf6" }} />
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
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
