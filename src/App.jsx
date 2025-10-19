import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './login';
import Dashboard from './dashboard';
import AddPatient from './add_patient';
import SearchPatient from './search_patient';
import UploadGene from './upload_gene';
import PatientDetails from './patient_details';
import PredictionResults from './prediction_result';
import ReportDocument from './ReportDocument';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Main pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add_patient" element={<AddPatient />} />
        <Route path="/search_patient" element={<SearchPatient />} />
        <Route path="/patient/:id" element={<PatientDetails />} />

        {/* Gene upload & predictions */}
        <Route path="/upload_gene/:id" element={<UploadGene />} />
        <Route path="/prediction_result/:id" element={<PredictionResults />} />

        {/* Report */}
        <Route path="/report_document" element={<ReportDocument />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
