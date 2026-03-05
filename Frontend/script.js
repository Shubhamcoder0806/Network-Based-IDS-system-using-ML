// ============================================================
// CONFIGURATION
// ============================================================

const API_BASE_URL = 'http://localhost:5000/api';

// ============================================================
// FETCH DATA FROM BACKEND
// ============================================================

let trafficData = [];
let totalTraffic = 0;
let attackCount = 0;
let normalCount = 0;
let protoMap = {};

async function fetchTrafficData() {
  try {
    const response = await fetch(`${API_BASE_URL}/traffic`);
    const result = await response.json();
    
    if (result.success) {
      // Convert backend format to frontend format
      trafficData = result.data.map(record => ({
        src: record.src,
        dst: record.dst,
        proto: record.proto,
        port: record.port,
        size: record.size,
        pred: record.pred === 1 ? "Attack" : "Normal",
        sev: record.sev
      }));
      
      computeStats();
      return true;
    }
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    // Fallback to mock data
    useMockData();
  }
  return false;
}

function useMockData() {
  // Fallback mock data (same as before)
  trafficData = [
    { src: "192.168.1.10", dst: "10.0.0.1",  proto: "TCP",  port: 80,   size: 1024, pred: "Normal", sev: "None"   },
    { src: "172.16.0.23",  dst: "10.0.0.1",  proto: "UDP",  port: 53,   size: 512,  pred: "Attack", sev: "High"   },
    { src: "192.168.1.45", dst: "10.0.0.5",  proto: "TCP",  port: 443,  size: 2048, pred: "Normal", sev: "None"   },
    { src: "10.10.10.5",   dst: "10.0.0.1",  proto: "ICMP", port: 0,    size: 64,   pred: "Attack", sev: "High"   },
    { src: "192.168.2.12", dst: "10.0.0.8",  proto: "TCP",  port: 22,   size: 340,  pred: "Normal", sev: "None"   },
    { src: "203.0.113.7",  dst: "10.0.0.1",  proto: "TCP",  port: 4444, size: 890,  pred: "Attack", sev: "High"   },
    { src: "192.168.1.88", dst: "10.0.0.2",  proto: "UDP",  port: 123,  size: 200,  pred: "Normal", sev: "None"   },
    { src: "198.51.100.9", dst: "10.0.0.1",  proto: "TCP",  port: 8080, size: 3200, pred: "Attack", sev: "High"   },
    { src: "192.168.3.4",  dst: "10.0.0.3",  proto: "TCP",  port: 21,   size: 780,  pred: "Normal", sev: "None"   },
    { src: "172.16.5.99",  dst: "10.0.0.1",  proto: "UDP",  port: 161,  size: 450,  pred: "Attack", sev: "Low"    },
    { src: "192.168.1.22", dst: "10.0.0.6",  proto: "TCP",  port: 3306, size: 1500, pred: "Normal", sev: "None"   },
    { src: "10.10.5.200",  dst: "10.0.0.1",  proto: "ICMP", port: 0,    size: 128,  pred: "Attack", sev: "High"   },
    { src: "192.168.0.5",  dst: "10.0.0.4",  proto: "TCP",  port: 25,   size: 660,  pred: "Normal", sev: "None"   },
    { src: "185.220.101.1",dst: "10.0.0.1",  proto: "TCP",  port: 1433, size: 4096, pred: "Attack", sev: "High"   },
    { src: "192.168.1.77", dst: "10.0.0.9",  proto: "UDP",  port: 67,   size: 300,  pred: "Normal", sev: "None"   },
    { src: "91.108.4.15",  dst: "10.0.0.1",  proto: "TCP",  port: 23,   size: 712,  pred: "Attack", sev: "Low"    },
    { src: "192.168.2.55", dst: "10.0.0.7",  proto: "TCP",  port: 8443, size: 2200, pred: "Normal", sev: "None"   },
    { src: "45.33.32.156", dst: "10.0.0.1",  proto: "TCP",  port: 6667, size: 950,  pred: "Attack", sev: "High"   },
    { src: "192.168.1.33", dst: "10.0.0.2",  proto: "UDP",  port: 500,  size: 180,  pred: "Normal", sev: "None"   },
    { src: "198.51.100.50",dst: "10.0.0.1",  proto: "TCP",  port: 9001, size: 5120, pred: "Attack", sev: "High"   },
  ];
  computeStats();
}

function computeStats() {
  totalTraffic = trafficData.length;
  attackCount = trafficData.filter(r => r.pred === "Attack").length;
  normalCount = trafficData.filter(r => r.pred === "Normal").length;
  
  protoMap = {};
  trafficData.forEach(r => {
    protoMap[r.proto] = (protoMap[r.proto] || 0) + 1;
  });
}

// Alert messages
const alertMessages = [
  { title: "🚨 Port Scan Detected",        body: "Suspicious ICMP sweep from 10.10.10.5 targeting internal gateway." },
  { title: "🚨 Intrusion Detected",         body: "Malicious payload on port 4444 — possible reverse shell from 203.0.113.7." },
  { title: "🚨 DDoS Pattern Identified",    body: "High-volume UDP flood from 198.51.100.9 on port 8080." },
  { title: "🚨 Brute-Force Attempt",        body: "Repeated SSH login failures detected from 45.33.32.156 on port 23." },
  { title: "🚨 SQL Injection Probe",        body: "Anomalous DB query traffic from 185.220.101.1 on port 1433." },
  { title: "🚨 C2 Communication Attempt",   body: "IRC-based C2 traffic detected from 45.33.32.156 on port 6667." },
  { title: "🚨 SNMP Enumeration",           body: "UDP SNMP enumeration from 172.16.5.99 — possible reconnaissance." },
  { title: "ℹ️ High-Volume Traffic",        body: "Unusually large packet (5120 B) from 198.51.100.50 flagged for review." },
];

// ============================================================
// UTILITIES
// ============================================================

function updateClock() {
  document.getElementById("clock").textContent =
    new Date().toLocaleTimeString("en-IN", { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

function pad(n) { return n < 10 ? "0" + n : n; }

function timeNow() {
  let d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ============================================================
// UPDATE UI
// ============================================================

function animateCount(elId, target, suffix) {
  let el = document.getElementById(elId);
  let start = 0;
  let step  = Math.ceil(target / 40);
  let timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = start + (suffix || "");
  }, 30);
}

function initCards() {
  animateCount("c-total",   totalTraffic);
  animateCount("c-attacks", attackCount);
  animateCount("c-normal",  normalCount);
  document.getElementById("tbl-badge").textContent = totalTraffic + " records";
}

function renderTable() {
  let tbody = document.getElementById("traffic-tbody");
  tbody.innerHTML = "";

  trafficData.forEach((row, i) => {
    let isAtk  = row.pred === "Attack";
    
    let predHtml = isAtk
      ? `<span class="pred attack">🔴 Attack</span>`
      : `<span class="pred normal">🟢 Normal</span>`;

    let sevClass = row.sev === "High" ? "high" : row.sev === "Low" ? "low" : "none";
    let sevHtml  = `<span class="sev ${sevClass}">${row.sev}</span>`;

    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="color:var(--text-muted)">${i + 1}</td>
      <td class="ip">${row.src}</td>
      <td class="ip">${row.dst}</td>
      <td><span class="proto-badge">${row.proto}</span></td>
      <td class="port">${row.port || "—"}</td>
      <td style="color:var(--text-dim)">${row.size} B</td>
      <td>${predHtml}</td>
      <td>${sevHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderBars() {
  let maxVal = Math.max(normalCount, attackCount);

  let normPct = Math.round((normalCount / maxVal) * 100);
  let nBar = document.getElementById("bar-normal");
  nBar.textContent = normalCount + " pkts";
  document.getElementById("lbl-normal").textContent = normalCount + " packets";
  setTimeout(() => { nBar.style.width = normPct + "%"; }, 100);

  let atkPct  = Math.round((attackCount / maxVal) * 100);
  let aBar = document.getElementById("bar-attack");
  aBar.textContent = attackCount + " pkts";
  document.getElementById("lbl-attack").textContent = attackCount + " packets";
  setTimeout(() => { aBar.style.width = atkPct + "%"; }, 200);

  let protoContainer = document.getElementById("proto-bars");
  protoContainer.innerHTML = "";
  let maxProto = Math.max(...Object.values(protoMap));

  Object.entries(protoMap).forEach(([proto, count], idx) => {
    let pct = Math.round((count / maxProto) * 100);
    let wrap = document.createElement("div");
    wrap.className = "bar-group";
    wrap.style.marginBottom = "10px";
    wrap.innerHTML = `
      <label>
        <span>${proto}</span>
        <span>${count} records</span>
      </label>
      <div class="bar-track">
        <div class="bar-fill proto" id="pbar-${idx}" style="width:0">${count}</div>
      </div>
    `;
    protoContainer.appendChild(wrap);
    setTimeout(() => {
      document.getElementById(`pbar-${idx}`).style.width = pct + "%";
    }, 300 + idx * 80);
  });
}

function renderDonut() {
  let svg    = document.getElementById("donut-svg");
  let legend = document.getElementById("donut-legend");
  let cx = 45, cy = 45, r = 32, stroke = 12;
  let circ = 2 * Math.PI * r;

  let segments = [
    ["Normal", normalCount, "#00ff88"],
    ["Attack", attackCount, "#ff3860"],
  ];

  let total = normalCount + attackCount;
  let offset = 0;
  let circleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  circleGroup.setAttribute("transform", `rotate(-90 ${cx} ${cy})`);
  svg.appendChild(circleGroup);

  let bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  bg.setAttribute("cx", cx); bg.setAttribute("cy", cy); bg.setAttribute("r", r);
  bg.setAttribute("fill", "none");
  bg.setAttribute("stroke", "#1e2d4a");
  bg.setAttribute("stroke-width", stroke);
  circleGroup.appendChild(bg);

  segments.forEach(([label, count, color]) => {
    let pct  = count / total;
    let dash = pct * circ;

    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx); circle.setAttribute("cy", cy); circle.setAttribute("r", r);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", color);
    circle.setAttribute("stroke-width", stroke);
    circle.setAttribute("stroke-dasharray", `${dash} ${circ - dash}`);
    circle.setAttribute("stroke-dashoffset", -offset);
    circle.setAttribute("stroke-linecap", "round");
    circleGroup.appendChild(circle);

    offset += dash;

    let item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `
      <div class="legend-dot" style="background:${color}"></div>
      <span>${label}: <strong style="color:${color}">${count}</strong>
        (${Math.round(pct*100)}%)</span>
    `;
    legend.appendChild(item);
  });

  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", cx); text.setAttribute("y", cy + 2);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("fill", "#e2e8f0");
  text.setAttribute("font-size", "11");
  text.setAttribute("font-family", "Courier New");
  text.textContent = total;
  svg.appendChild(text);

  let sub = document.createElementNS("http://www.w3.org/2000/svg", "text");
  sub.setAttribute("x", cx); sub.setAttribute("y", cy + 16);
  sub.setAttribute("text-anchor", "middle");
  sub.setAttribute("fill", "#64748b");
  sub.setAttribute("font-size", "8");
  sub.textContent = "packets";
  svg.appendChild(sub);
}

function renderAlerts() {
  let list = document.getElementById("alert-list");
  list.innerHTML = "";

  alertMessages.forEach((a, i) => {
    let isInfo = a.title.startsWith("ℹ");
    let item = document.createElement("div");
    item.className = "alert-item" + (isInfo ? " info" : "");
    item.style.animationDelay = (i * 80) + "ms";
    item.innerHTML = `
      <div class="alert-top">
        <span class="alert-title">${a.title}</span>
        <span class="alert-time">${timeNow()}</span>
      </div>
      <div class="alert-body">${a.body}</div>
    `;
    list.appendChild(item);
  });
}

// ============================================================
// SIMULATE DETECTION (REAL ML API CALL)
// ============================================================

async function simulateDetection() {
  try {
    const response = await fetch(`${API_BASE_URL}/simulate`);
    const result = await response.json();
    
    if (result.success) {
      const outcome = result.simulation;
      let el = document.getElementById("sim-result");

      el.style.display = "none";
      el.className = "";
      void el.offsetWidth;

      el.style.display = "block";
      el.className = outcome.type === "attack" ? "attack-res" : "normal-res";
      el.innerHTML = `
        <div>${outcome.type === "attack" ? "🚨" : "✅"}&nbsp; ${outcome.label}</div>
        <p>🤖 Model Confidence: ${(outcome.confidence * 100).toFixed(1)}% | Class: ${outcome.class_name} | Feature: ${outcome.detail}</p>
      `;

      if (outcome.type === "attack") {
        addLiveAlert("🚨 Simulated Intrusion", `Random Forest flagged a packet — Confidence: ${(outcome.confidence * 100).toFixed(1)}%`);
      }
    }
  } catch (error) {
    console.error('Simulation error:', error);
    alert('⚠️ Backend API is offline. Please start the Flask server.');
  }
}

function resetSimulation() {
  let el = document.getElementById("sim-result");
  el.style.display = "none";
  el.textContent = "";
}

function addLiveAlert(title, body) {
  let list = document.getElementById("alert-list");
  let item = document.createElement("div");
  item.className = "alert-item";
  item.style.borderLeftColor = "#ff9f43";
  item.innerHTML = `
    <div class="alert-top">
      <span class="alert-title" style="color:var(--accent-orange)">${title}</span>
      <span class="alert-time">${timeNow()}</span>
    </div>
    <div class="alert-body">${body}</div>
  `;
  list.insertBefore(item, list.firstChild);
}

// ============================================================
// INITIALIZE
// ============================================================

async function init() {
  await fetchTrafficData();
  initCards();
  renderTable();
  renderBars();
  renderDonut();
  renderAlerts();
}

window.addEventListener("DOMContentLoaded", init);
