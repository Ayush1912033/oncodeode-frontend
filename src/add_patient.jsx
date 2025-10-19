import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Re-using the logo component
const OncoCodeLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 5C22.9086 5 5 22.9086 5 45V45H45V5Z" stroke="#333" strokeWidth="6"/>
    <path d="M55 5H95V45H55V5Z" stroke="#333" strokeWidth="6"/>
    <path d="M5 55H45V95H5V55Z" stroke="#333" strokeWidth="6"/>
    <path d="M55 95C77.0914 95 95 77.0914 95 55V55H55V95Z" stroke="#333" strokeWidth="6"/>
  </svg>
);

const AddPatientStyles = `
  body, html, #root { margin: 0; padding: 0; width: 100%; height: 100%; font-family: 'Segoe UI', sans-serif; }
  #add-patient-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f7fa; padding: 20px; box-sizing: border-box; }
  .add-patient-container { width: 100%; max-width: 1100px; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); padding: 30px 40px; }

  .add-patient-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
  .logo-area { display: flex; align-items: center; gap: 15px; }
  .logo-area .company-name { font-size: 1.2rem; font-weight: 600; color: #333; }
  .logo-area .tagline { font-size: 0.8rem; color: #888; margin-top: 2px; }
  .main-nav a { text-decoration: none; color: #555; margin-left: 30px; font-weight: 500; }

  .page-title h1 { font-size: 2.5rem; color: #222; margin: 0; }
  .page-title p { font-size: 1rem; color: #777; margin: 5px 0 40px 0; }

  .patient-form { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 40px; }
  .form-group { display: flex; flex-direction: column; }
  .form-group label { font-size: 0.9rem; font-weight: 600; color: #555; margin-bottom: 8px; }
  .form-group input, .form-group select, .form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    box-sizing: border-box;
  }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
  .form-group textarea { resize: vertical; min-height: 100px; }
  .full-width { grid-column: 1 / -1; }

  .save-btn {
    grid-column: 1 / -1;
    justify-self: start;
    width: 200px;
    padding: 15px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    background: linear-gradient(to right, #4a90e2, #3b82f6);
    color: white;
    margin-top: 20px;
    transition: all 0.2s ease;
  }
  .save-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
  }
`;

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    caseId: '',
    patientId: '',
    fullName: '',
    age: '',
    gender: '',
    medicalHistory: '',
    contactInfo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ get doctorId from localStorage (set during login)
      const doctorId = localStorage.getItem("doctorId");
      if (!doctorId) {
        alert("No doctor logged in!");
        return;
      }

      const response = await fetch("http://localhost:5000/api/patients/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, doctorId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Patient Saved!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to save patient");
      }
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Server error while saving patient");
    }
  };

  return (
    <>
      <style>{AddPatientStyles}</style>
      <div id="add-patient-page">
        <div className="add-patient-container">
          <header className="add-patient-header">
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
              <h1>Add New Patient</h1>
              <p>Enter patient details to register a new profile</p>
            </div>

            <form className="patient-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="caseId">Case ID</label>
                <input type="text" id="caseId" name="caseId" value={formData.caseId} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="patientId">Patient ID</label>
                <input type="text" id="patientId" name="patientId" value={formData.patientId} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
              </div>
              <div className="form-group full-width">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label htmlFor="medicalHistory">Medical History</label>
                <textarea id="medicalHistory" name="medicalHistory" value={formData.medicalHistory} onChange={handleChange}></textarea>
              </div>
              <div className="form-group full-width">
                <label htmlFor="contactInfo">Contact Info</label>
                <textarea id="contactInfo" name="contactInfo" value={formData.contactInfo} onChange={handleChange}></textarea>
              </div>
              <button type="submit" className="save-btn">Save Patient</button>
            </form>
          </main>
        </div>
      </div>
    </>
  );
};

export default AddPatient;
