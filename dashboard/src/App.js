import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import HistoricalData from "./HistoricalData";

function App() {
  return (
    <Router>
      <div>
        {/* Navigationsmeny */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            backgroundColor: "#333", // Mörk bakgrund
            color: "#ffcc00", // Gul text
          }}
        >
          <h2 style={{ color: "#ffcc00" }}>LaundryGuardian</h2>
          <ul style={{ display: "flex", listStyle: "none", gap: "15px" }}>
            <li>
              <Link to="/" style={{ color: "#ffcc00", textDecoration: "none" }}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/historical" style={{ color: "#ffcc00", textDecoration: "none" }}>
                Historical Data
              </Link>
            </li>
            <li
              style={{
                color: "#ffcc00",
                cursor: "pointer",
              }}
              onClick={() => {
                const exportEvent = new CustomEvent("exportData");
                document.dispatchEvent(exportEvent);
              }}
            >
              Export Data
            </li>
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
