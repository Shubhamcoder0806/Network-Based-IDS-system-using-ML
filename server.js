const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, ".")));

const PYTHON_API = process.env.PYTHON_API || "http://localhost:5000";

function generateFeatures() {
  return [
    Math.random() * 1000 + 50,
    Math.random() * 4 + 0.1,
    Math.random() * 500 + 10,
    Math.round(Math.random()),
    Math.round(Math.random()),
    Math.random() * 6 + 1.5,
    [80, 443, 22, 53][Math.floor(Math.random() * 4)]
  ];
}

app.get("/traffic", async (req, res) => {
  try {
    const features = generateFeatures();
    const response = await axios.post(`${PYTHON_API}/predict`, { features }, { timeout: 3000 });
    res.json({
      src: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      dst: "10.0.0.1",
      proto: "TCP",
      port: features[6],
      size: Math.round(features[0]),
      prediction: response.data.prediction,
      analysis: response.data.analysis
    });
  } catch (err) {
    const features = generateFeatures();
    const isAttack = features[0] > 800;
    res.json({
      src: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      dst: "10.0.0.1",
      proto: "TCP",
      port: features[6],
      size: Math.round(features[0]),
      prediction: isAttack ? "Attack" : "Normal",
      analysis: {
        attack_type: isAttack ? "DDoS" : "Normal",
        severity: isAttack ? "High" : "Low",
        confidence: 95.0,
        mitre_id: isAttack ? "T1498" : "N/A"
      }
    });
  }
});

app.post("/ingest", async (req, res) => {
  try {
    const { features } = req.body;
    if (!features || !Array.isArray(features)) {
      return res.status(400).json({ error: "features array is required" });
    }

    const response = await axios.post(`${PYTHON_API}/predict`, { features });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Gateway Node Server listening on port ${PORT}`));
