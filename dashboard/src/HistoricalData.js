import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "./firebaseConfig";
import { Line } from "react-chartjs-2";

const HistoricalData = () => {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const historicalRef = ref(database, "sensorData");
    onValue(historicalRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        setHistoricalData(Object.values(value));
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#1a1a1a", color: "yellow" }}>
      <h2>Historical Sensor Data</h2>
      <Line
        data={{
          labels: historicalData.map((_, index) => `Entry ${index + 1}`),
          datasets: [
            {
              label: "Temperature (°C)",
              data: historicalData.map((entry) => entry.temperature),
              borderColor: "yellow",
              backgroundColor: "rgba(255, 255, 0, 0.2)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Humidity (%)",
              data: historicalData.map((entry) => entry.humidity),
              borderColor: "cyan",
              backgroundColor: "rgba(0, 255, 255, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        }}
        options={{ responsive: true }}
      />
    </div>
  );
};

export default HistoricalData;
