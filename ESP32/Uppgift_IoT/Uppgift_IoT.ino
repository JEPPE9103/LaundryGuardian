#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"
#include "time.h" // För NTP-tid

// DHT11 Configuration
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Wi-Fi Credentials
const char* ssid = "Jesper – iPhone";
const char* password = "jeppe123";

// Firebase Realtime Database URL
const char* firebaseUrl = "https://laundryguardian-default-rtdb.europe-west1.firebasedatabase.app/sensorData.json";

// NTP Server
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 3600;
const int daylightOffset_sec = 3600;

// Skicka data varje 60 sekunder
long sendInterval = 60000;
unsigned long previousMillis = 0;

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Initiera tid från NTP-server
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("Time synchronized from NTP server.");
}

String getTimestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return "N/A";
  }
  char timestamp[20];
  strftime(timestamp, sizeof(timestamp), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(timestamp);
}

void sendToFirebase(float temperature, float humidity, String timestamp) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(firebaseUrl);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"temperature\":";
    payload += String(temperature);
    payload += ",\"humidity\":";
    payload += String(humidity);
    payload += ",\"timestamp\":\"";
    payload += timestamp;
    payload += "\"}";

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.println("Data sent successfully!");
      Serial.println("Response: " + http.getString());
    } else {
      Serial.println("Error sending data. HTTP response code: " + String(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("Wi-Fi not connected!");
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Anslut till Wi-Fi direkt i setup()
  connectWiFi();

  Serial.println("Waiting for the first sensor data...");
}

void loop() {
  unsigned long currentMillis = millis();

  // Kontrollera om det gått 60 sekunder sedan senaste sändningen
  if (currentMillis - previousMillis >= sendInterval) {
    previousMillis = currentMillis;

    // Läs temperatur och luftfuktighet
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
    }

    // Hämta tidsstämpel
    String timestamp = getTimestamp();

    // Skriv ut och skicka data
    Serial.println("Sending sensor data...");
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" °C");
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
    Serial.print("Timestamp: ");
    Serial.println(timestamp);

    sendToFirebase(temperature, humidity, timestamp);
  }
}
