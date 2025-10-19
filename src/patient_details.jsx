import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaBirthdayCake, FaVenusMars, FaFileDownload, FaUpload, FaIdCard } from 'react-icons/fa';

const OncoCodeLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 5C22.9086 5 5 22.9086 5 45V45H45V5Z" stroke="#333" strokeWidth="6"/>
    <path d="M55 5H95V45H55V5Z" stroke="#333" strokeWidth="6"/>
    <path d="M5 55H45V95H5V55Z" stroke="#333" strokeWidth="6"/>
    <path d="M55 95C77.0914 95 95 77.0914 95 55V55H55V95Z" stroke="#333" strokeWidth="6"/>
  </svg>
);

const PatientDetailsStyles = `
  body, html, #root { margin: 0; padding: 0; width: 100%; height: 100%; font-family: 'Segoe UI', sans-serif; }
  #patient-details-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f7fa; padding: 20px; box-sizing: border-box; }
  .patient-details-container { width: 100%; max-width: 1100px; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); padding: 30px 40px; }
  .patient-details-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
  .logo-area { display: flex; align-items: center; gap: 15px; }
  .logo-area .company-name { font-size: 1.2rem; font-weight: 600; color: #333; }
  .logo-area .tagline { font-size: 0.8rem; color: #888; margin-top: 2px; }
  .main-nav a { text-decoration: none; color: #555; margin-left: 30px; font-weight: 500; }
  .section-heading { font-size: 1.1rem; color: #666; margin-bottom: 20px; font-weight: 500; border-bottom: 1px solid #eee; padding-bottom: 10px; }
  .patient-summary { background-color: #fdfdff; border: 1px solid #eee; border-radius: 12px; padding: 25px; margin-bottom: 40px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 25px; }
  .summary-item { display: flex; align-items: center; gap: 12px; }
  .summary-item .icon { color: #3b82f6; font-size: 1.2rem; }
  .summary-item .label { font-size: 0.9rem; color: #777; }
  .summary-item .value { font-size: 1.1rem; font-weight: 600; color: #333; }
  .reports-list { display: flex; flex-direction: column; gap: 10px; }
  .report-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-radius: 10px; border: 1px solid #f0f0f0; background-color: #fafbff; }
  .report-info .title { font-weight: 600; color: #444; }
  .report-info .date { font-size: 0.9rem; color: #888; }
  .download-btn { display: flex; align-items: center; gap: 8px; padding: 8px 15px; border: 1px solid #ddd; background-color: #fff; color: #555; border-radius: 8px; cursor: pointer; font-weight: 500; text-decoration: none; transition: all 0.2s ease; }
  .download-btn:hover { background-color: #f5f5f5; border-color: #bbb; }
  .page-actions { margin-top: 30px; }
  .upload-btn { display: inline-flex; align-items: center; gap: 10px; padding: 15px 25px; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; background: linear-gradient(to right, #4a90e2, #3b82f6); color: white; transition: all 0.2s ease; }
  .upload-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3); }
`;

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/patients/single/${id}`);
        if (!res.ok) {
          console.error("Failed to fetch patient:", res.status);
          return;
        }
        const data = await res.json();
        setPatient(data);
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    };
    fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <style>{PatientDetailsStyles}</style>
      <div id="patient-details-page">
        <div className="patient-details-container">
          <header className="patient-details-header">
            <div className="logo-area">
              <OncoCodeLogo />
              <div>
                <div className="company-name">ONCODECODE</div>
                <div className="tagline">Precision Oncology, Simplified</div>
              </div>
            </div>
            <nav className="main-nav">
              <a href="/dashboard">Home</a><a href="#">Settings</a><a href="/login">Logout</a>
            </nav>
          </header>
          <main>
            <section>
              <h2 className="section-heading">Patient Summary</h2>
              <div className="patient-summary">
                <div className="summary-item"><FaUser className="icon"/><div><div className="label">Patient Name</div><div className="value">{patient.fullName}</div></div></div>
                <div className="summary-item"><FaIdCard className="icon"/><div><div className="label">Patient ID</div><div className="value">{patient.patientId}</div></div></div>
                <div className="summary-item"><FaBirthdayCake className="icon"/><div><div className="label">Age</div><div className="value">{patient.age}</div></div></div>
                <div className="summary-item"><FaVenusMars className="icon"/><div><div className="label">Gender</div><div className="value">{patient.gender}</div></div></div>
              </div>
            </section>
            <section>
              <h2 className="section-heading">Previous Reports</h2>
              <div className="reports-list">
                {patient.reports && patient.reports.length > 0 ? patient.reports.map((report, i) => (
                  <div className="report-item" key={i}>
                    <div className="report-info">
                      <div className="title">{report.title}</div>
                      <div className="date">Date: {report.date}</div>
                    </div>
                    <a href={report.url} className="download-btn" download><FaFileDownload /> Download</a>
                  </div>
                )) : <p>No reports found for this patient.</p>}
              </div>
            </section>
            <div className="page-actions">
              <button 
  className="upload-btn" 
  onClick={() => navigate(`/upload_gene/${patient._id}`)}  // ✅ include patient._id
>
  <FaUpload /> Upload New Gene Data
</button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
export default PatientDetails;
