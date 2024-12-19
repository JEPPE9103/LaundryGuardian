# LaundryGuardian

LaundryGuardian is an IoT project designed to monitor the temperature and humidity in laundry rooms. This solution uses an ESP32 with a DHT11 sensor and a Firebase backend, while providing real-time and historical data visualization via a React-based web application.

## Features

1. **IoT Monitoring**: Real-time monitoring of temperature and humidity using ESP32 and DHT11.
2. **Web Application**: View live and historical data with charts and export options.
3. **Firebase Integration**: Securely store and retrieve sensor data.

---

## Table of Contents

- [Hardware Requirements](#hardware-requirements)
- [Software Requirements](#software-requirements)
- [Installation](#installation)
  - [ESP32 Setup](#esp32-setup)
  - [Web Application Setup](#web-application-setup)
- [How It Works](#how-it-works)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

---

## Hardware Requirements

- ESP32 (NodeMCU-32s)
- DHT11 sensor
- 10kΩ resistor
- Breadboard and jumper wires

---

## Software Requirements

1. [Arduino IDE](https://www.arduino.cc/en/software)
2. [Node.js and npm](https://nodejs.org/)
3. Web browser for the React app

---

## Installation

### ESP32 Setup

1. **Install ESP32 Board in Arduino IDE**:
   - Open Arduino IDE.
   - Go to **File > Preferences**.
   - Add the following URL to the "Additional Board Manager URLs":
     ```
     https://dl.espressif.com/dl/package_esp32_index.json
     ```
   - Go to **Tools > Board > Board Manager** and search for "ESP32".
   - Install "esp32 by Espressif Systems".

2. **Install Required Libraries**:
   - Install the following libraries in Arduino IDE by going to **Tools > Manage Libraries**:
     - `DHT sensor library` by Adafruit
     - `WiFi.h` (part of ESP32 SDK)
     - `HTTPClient.h` (part of ESP32 SDK)

3. **Upload the Code**:
   - Open `LaundryGuardian.ino`.
   - Update the `ssid` and `password` variables with your Wi-Fi credentials.
   - Upload the code to your ESP32.

---

### Web Application Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/JEPPE9103/LaundryGuardian
   cd LaundryGuardian
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm start
   ```
   - Open `http://localhost:3000` in your browser.

---

## How It Works

1. **ESP32 Device**:
   - Reads temperature and humidity data from the DHT11 sensor.
   - Sends data to Firebase Realtime Database with a timestamp.

2. **Web Application**:
   - Fetches data from Firebase.
   - Displays real-time and historical data using interactive charts.
   - Allows exporting data to PDF.

---

## Visuals

### Web Dashboard
Here is a PDF showcasing the LaundryGuardian dashboard with live data:
[View Dashboard PDF](./assets/sensor_data.pdf)

---

## Acknowledgments

- **Firebase Documentation**: For detailed integration with Firebase services. [Visit Firebase Docs](https://firebase.google.com/docs)
- **Chart.js**: Used for interactive data visualization.

---

## Contact

- **Email**: Jespe9103@gmail.com
- **GitHub**: [JEPPE9103](https://github.com/JEPPE9103)

