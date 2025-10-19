import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const OncoCodeLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 5C22.9086 5 5 22.9086 5 45V45H45V5Z" stroke="#333" strokeWidth="6"/>
    <path d="M55 5H95V45H55V5Z" stroke="#333" strokeWidth="6"/>
    <path d="M5 55H45V95H5V55Z" stroke="#333" strokeWidth="6"/>
    <path d="M55 95C77.0914 95 95 77.0914 95 55V55H55V95Z" stroke="#333" strokeWidth="6"/>
  </svg>
);

const UploadGeneStyles = `
  body, html, #root { margin: 0; padding: 0; width: 100%; height: 100%; font-family: 'Segoe UI', sans-serif; }
  #upload-gene-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f7fa; padding: 20px; box-sizing: border-box; }
  .upload-gene-container { width: 100%; max-width: 1100px; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); padding: 30px 40px; }
  .upload-gene-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
  .logo-area { display: flex; align-items: center; gap: 15px; }
  .logo-area .company-name { font-size: 1.2rem; font-weight: 600; color: #333; }
  .logo-area .tagline { font-size: 0.8rem; color: #888; margin-top: 2px; }
  .main-nav a { text-decoration: none; color: #555; margin-left: 30px; font-weight: 500; }
  .page-title h1 { font-size: 2.5rem; color: #222; margin: 0; }
  .page-title p { font-size: 1rem; color: #777; margin: 5px 0 40px 0; }
  .dropzone { display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px; border: 2px dashed #ddd; border-radius: 12px; background-color: #fafafa; color: #888; cursor: pointer; transition: all 0.2s ease-in-out; }
  .dropzone.drag-over { border-color: #3b82f6; background-color: #eef5ff; }
  .dropzone-icon { font-size: 4rem; color: #3b82f6; }
  .dropzone p { margin: 10px 0 0 0; font-size: 1.1rem; font-weight: 500; }
  .dropzone span { font-size: 0.9rem; }
  .file-status-section { margin-top: 30px; }
  .file-status-section h2 { font-size: 1.1rem; color: #666; margin-bottom: 15px; font-weight: 500; }
  .file-status { display: flex; align-items: center; gap: 10px; padding: 15px; background-color: #f0fff4; border: 1px solid #48bb78; border-radius: 8px; }
  .status-icon { font-size: 1.2rem; color: #48bb78; }
  .status-text { font-weight: 600; color: #2f855a; }
  .status-info { font-size: 0.8rem; color: #777; margin-top: 5px; }
  .proceed-btn { padding: 15px 30px; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; background: linear-gradient(to right, #4a90e2, #3b82f6); color: white; margin-top: 30px; transition: all 0.2s ease; }
  .proceed-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3); }
  .proceed-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }
`;

const UploadGene = () => {
  const { id } = useParams();   // 👈 patientId from URL
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'text/csv' && selectedFile.size <= 100 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      setFile(null);
      alert('Invalid file. Please upload a .csv file under 100MB.');
    }
  };

  const handleFileSelect = (e) => handleFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", id);  // ✅ Send patientId to backend

    try {
      const res = await fetch("http://localhost:5001/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("✅ Predictions:", data);

      if (!res.ok) throw new Error(data.error || "Prediction failed");

      // ✅ Redirect to prediction results with patientId
      navigate(`/prediction_result/${id}`);
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{UploadGeneStyles}</style>
      <div id="upload-gene-page">
        <div className="upload-gene-container">
          <header className="upload-gene-header">
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
              <h1>Upload & Validate Gene Data</h1>
              <p>Upload gene expression data for classification</p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept=".csv"
            />
            <div
              className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
              onClick={() => fileInputRef.current.click()}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
            >
              <FaCloudUploadAlt className="dropzone-icon" />
              <p>Drag & drop your CSV file here</p>
              <span>or click to browse</span>
            </div>

            {file && (
              <div className="file-status-section">
                <h2>File Status</h2>
                <div className="file-status">
                  <FaCheckCircle className="status-icon" />
                  <div>
                    <div className="status-text">Valid CSV Format</div>
                    <div className="status-info">Allowed format: .csv (max 100MB)</div>
                  </div>
                </div>
              </div>
            )}

            <button
              className="proceed-btn"
              disabled={!file || loading}
              onClick={handleUpload}
            >
              {loading ? "Processing..." : "Proceed to Classification"}
            </button>
          </main>
        </div>
      </div>
    </>
  );
};

export default UploadGene;
