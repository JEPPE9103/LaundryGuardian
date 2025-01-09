import React, { useEffect, useState, useRef, useCallback } from "react";
import { database, ref, onValue } from "./firebaseConfig";
import { query, limitToLast } from "firebase/database";
import { Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "./App.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const dashboardRef = useRef(null);

  // Hämta data från Firebase
  useEffect(() => {
    const sensorRef = query(ref(database, "sensorData"), limitToLast(20)); // Hämta de senaste 20 värdena
    onValue(sensorRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        setData(Object.values(value));
      }
    });
  }, []);

  // Exportera dashboard till PDF
  const exportDataToPDF = useCallback(() => {
    if (!dashboardRef.current) {
      console.error("Dashboard reference is null");
      return;
    }

    const recentData = data.slice(-20); // Se till att vi använder de senaste 20 värdena

    html2canvas(dashboardRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Lägg till dashboard som bild
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

      // Lägg till data under bilden
      let y = imgHeight + 20;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0); // Svart text
      pdf.text("Latest 20 Sensor Data:", 10, y);

      pdf.setFontSize(10);
      recentData.forEach((entry, index) => {
        y += 6;
        const textLine = `${index + 1}. Time: ${new Date(entry.timestamp).toLocaleString()} | Temp: ${
          entry.temperature
        }°C | Hum: ${entry.humidity}%`;
        if (y > pageHeight - 10) {
          pdf.addPage();
          y = 10;
        }
        pdf.text(textLine, 10, y);
      });

      pdf.save("sensor_dashboard_with_data.pdf");
    });
  }, [data]);

  // Lyssna på "exportData"-händelsen från App.js
  useEffect(() => {
    const handleExport = () => exportDataToPDF();
    document.addEventListener("exportData", handleExport);

    return () => document.removeEventListener("exportData", handleExport);
  }, [exportDataToPDF]);

  // Beräkna data för informativa lådor
  const latestData = data.length > 0 ? data[data.length - 1] : { temperature: 0, humidity: 0 };
  const highestTemp = Math.max(...data.map((entry) => entry.temperature || 0));
  const lowestTemp = Math.min(...data.map((entry) => entry.temperature || 0));
  const highestHumidity = Math.max(...data.map((entry) => entry.humidity || 0));
  const lowestHumidity = Math.min(...data.map((entry) => entry.humidity || 0));

  // Diagramdata
  const temperatureData = {
    labels: data.map((_, index) => `Entry ${index + 1}`),
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map((entry) => entry.temperature),
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.4,
      },
    ],
  };

  const humidityData = {
    labels: data.map((_, index) => `Entry ${index + 1}`),
    datasets: [
      {
        label: "Humidity (%)",
        data: data.map((entry) => entry.humidity),
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div
      ref={dashboardRef}
      style={{
        backgroundColor: "#1a1a1a",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "yellow",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        Sensor Dashboard
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div>
          <div className="info-row">
            <div className="info-box">Current Temperature: {latestData.temperature}°C</div>
            <div className="info-box">Highest Temperature: {highestTemp}°C</div>
            <div className="info-box">Lowest Temperature: {lowestTemp}°C</div>
          </div>
          <h2>Temperature Over Time</h2>
          <Line data={temperatureData} options={{ responsive: true }} />
        </div>
        <div>
          <div className="info-row">
            <div className="info-box">Current Humidity: {latestData.humidity}%</div>
            <div className="info-box">Highest Humidity: {highestHumidity}%</div>
            <div className="info-box">Lowest Humidity: {lowestHumidity}%</div>
          </div>
          <h2>Humidity Over Time</h2>
          <Line data={humidityData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
