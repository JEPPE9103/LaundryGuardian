import React, { useEffect, useState, useRef, useCallback } from "react";
import { database, ref, onValue } from "./firebaseConfig";
import { query, limitToLast } from "firebase/database";
import { Line, Bar } from "react-chartjs-2";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "./App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

ChartJS.defaults.font.size = 14;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [dataPoints] = useState(20);
  const dashboardRef = useRef(null);

  // Hämtar data från Firebase
  useEffect(() => {
    const sensorRef = query(ref(database, "sensorData"), limitToLast(dataPoints));
    onValue(sensorRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        setData(Object.values(value));
      }
    });
  }, [dataPoints]);

  const latestData = data.length > 0 ? data[data.length - 1] : { temperature: 0, humidity: 0 };

  // Exportera till PDF med useCallback för att undvika varningen
  const exportDataToPDF = useCallback(() => {
    if (!dashboardRef.current) {
      console.error("Dashboard reference is null");
      return;
    }

    const recentData = data.slice(-20);

    html2canvas(dashboardRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

      let y = imgHeight + 20;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Latest 20 Sensor Data", 10, y);

      pdf.setFontSize(10);
      recentData.forEach((entry, index) => {
        y += 6;
        const line = `${index + 1}. Time: ${new Date(entry.timestamp).toLocaleString()} | Temp: ${entry.temperature}°C | Hum: ${entry.humidity}%`;
        if (y > pageHeight - 10) {
          pdf.addPage();
          y = 10;
        }
        pdf.text(line, 10, y);
      });

      pdf.save("sensor_data.pdf");
    }).catch((error) => {
      console.error("Failed to export PDF:", error);
    });
  }, [data]);

  // Lägg till export-händelsen
  useEffect(() => {
    const handleExport = () => exportDataToPDF();
    document.addEventListener("exportData", handleExport);
    return () => document.removeEventListener("exportData", handleExport);
  }, [exportDataToPDF]);

  return (
    <div
      ref={dashboardRef}
      style={{
        display: "flex",
        alignItems: "flex-start",
        backgroundColor: "#1a1a1a",
        padding: "20px",
        color: "yellow",
        fontFamily: "Arial, sans-serif",
        gap: "20px",
      }}
    >
      <div style={{ flex: 1 }}>
        <h2 className="chart-title">Temperature Over Time</h2>
        <Line
          data={{
            labels: data.map((_, index) => `Entry ${index + 1}`),
            datasets: [
              {
                label: "Temperature (°C)",
                data: data.map((entry) => entry.temperature),
                fill: true,
                backgroundColor: "rgba(255, 255, 0, 0.2)",
                borderColor: "yellow",
                tension: 0.4,
              },
            ],
          }}
          options={{ responsive: true }}
          style={{ height: "300px" }}
        />

        <h2 className="chart-title">Humidity Over Time</h2>
        <Line
          data={{
            labels: data.map((_, index) => `Entry ${index + 1}`),
            datasets: [
              {
                label: "Humidity (%)",
                data: data.map((entry) => entry.humidity),
                fill: true,
                backgroundColor: "rgba(0, 255, 255, 0.2)",
                borderColor: "cyan",
                tension: 0.4,
              },
            ],
          }}
          options={{ responsive: true }}
          style={{ height: "300px" }}
        />
      </div>

      <div style={{ flex: 1, minWidth: "400px", display: "flex", flexDirection: "column", gap: "20px", marginTop: "-20px" }}>
        <h2 className="chart-title">Temperature & Humidity Trends</h2>
        <Bar
          data={{
            labels: data.map((entry) => new Date(entry.timestamp).toLocaleTimeString()),
            datasets: [
              {
                label: "Temperature (°C)",
                data: data.map((entry) => entry.temperature),
                backgroundColor: "rgba(255, 255, 0, 0.7)",
                borderColor: "yellow",
              },
              {
                label: "Humidity (%)",
                data: data.map((entry) => entry.humidity),
                backgroundColor: "rgba(0, 255, 255, 0.7)",
                borderColor: "cyan",
              },
            ],
          }}
          options={{ responsive: true }}
          style={{ height: "300px" }}
        />

        <h2 className="chart-title">Latest Sensor Data</h2>
        <Bar
          data={{
            labels: ["Temperature", "Humidity"],
            datasets: [
              {
                label: "Latest Value",
                data: [latestData.temperature, latestData.humidity],
                backgroundColor: ["rgba(255, 255, 0, 0.7)", "rgba(0, 255, 255, 0.7)"],
                borderColor: ["yellow", "cyan"],
                borderWidth: 1,
              },
            ],
          }}
          options={{ responsive: true }}
          style={{ height: "300px" }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
