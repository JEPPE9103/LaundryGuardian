import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import HistoricalData from "./HistoricalData";

function App() {
  const handleExportData = () => {
    document.dispatchEvent(new Event("exportData"));
  };

  return (
    <Router>
      <div>
        {/* Navigationsmeny */}
        <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#333", color: "yellow" }}>
          <h2>LaundryGuardian</h2>
          <ul style={{ display: "flex", listStyle: "none", gap: "15px" }}>
            <li><Link to="/" style={{ color: "yellow", textDecoration: "none" }}>Home</Link></li>
            <li><Link to="/historical" style={{ color: "yellow", textDecoration: "none" }}>Historical Data</Link></li>
            <li style={{ color: "yellow", cursor: "pointer" }} onClick={handleExportData}>Export Data</li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/historical" element={<HistoricalData />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
