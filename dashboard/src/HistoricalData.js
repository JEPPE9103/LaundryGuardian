import React, { useEffect, useState } from "react";
import { database, ref, query, limitToLast, onValue } from "./firebaseConfig";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HistoricalData = () => {
  const [historicalData, setHistoricalData] = useState([]);

  // Hämta senaste 100 mätningar från Firebase
  useEffect(() => {
    const historicalRef = query(ref(database, "sensorData"), limitToLast(100));
    onValue(historicalRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        setHistoricalData(Object.values(value));
      }
    });
  }, []);

  // Diagramdata
  const chartData = {
    labels: historicalData.map((_, index) => `Entry ${index + 1}`),
    datasets: [
      {
        label: "Temperature (°C)",
        data: historicalData.map((entry) => entry.temperature),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Humidity (%)",
        data: historicalData.map((entry) => entry.humidity),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "yellow", // Textfärg för legend
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Latest 100 Sensor Data",
        color: "yellow",
        font: {
          size: 20,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white", // Färg på x-axelns etiketter
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Bakgrundslinjer
        },
      },
      y: {
        ticks: {
          color: "white", // Färg på y-axelns etiketter
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Bakgrundslinjer
        },
      },
    },
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#1a1a1a",
        color: "white",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "yellow", marginBottom: "20px" }}>
        Historical Sensor Data
      </h1>
      <div
        style={{
          backgroundColor: "#222",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default HistoricalData;
