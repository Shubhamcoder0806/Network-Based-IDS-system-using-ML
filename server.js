const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

function generateFeatures() {
  return [
    Math.random() * 1000, // packet size
    Math.random() * 10,   // duration
    Math.random() * 5     // protocol encoding etc.
  ];
}

app.get("/traffic", async (req, res) => {
  try {
    const features = generateFeatures();
    const response = await axios.post("http://localhost:5000/predict", { features });

    res.json({
      src: `192.168.1.${Math.floor(Math.random() * 255)}`,
      dst: "10.0.0.1",
      proto: "TCP",
      port: 80,
      size: features[0],
      prediction: response.data.prediction
    });
  } catch (err) {
    console.error("/traffic error", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/ingest", async (req, res) => {
  try {
    const { features } = req.body;
    if (!features || !Array.isArray(features)) {
      return res.status(400).json({ error: "features array is required" });
    }

    const response = await axios.post("http://localhost:5000/predict", { features });
    res.json({ prediction: response.data.prediction, features });
  } catch (err) {
    console.error("/ingest error", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

