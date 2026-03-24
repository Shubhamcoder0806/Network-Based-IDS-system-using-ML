// ============================================================
// MOCK DATA
// These records simulate the output of the trained Random
// Forest ML model. In production, this would be replaced by
// real-time predictions from the backend ML pipeline.
// Future Scope: WebSocket / REST API integration with Python backend.
// ============================================================

const trafficData = [
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

// Pre-built alert messages for attack records
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

// Possible simulation outcomes (mimics real ML class output)
const simOutcomes = [
  { type: "normal", emoji: "✅", label: "Normal Traffic Detected",
    detail: "Model Confidence: 96.2% | Class: Benign | Feature: Low entropy, expected port" },
  { type: "normal", emoji: "✅", label: "Normal Traffic Detected",
    detail: "Model Confidence: 98.7% | Class: Benign | Feature: Regular HTTP packet" },
  { type: "attack", emoji: "🚨", label: "Attack Detected!",
    detail: "Model Confidence: 94.5% | Class: DoS | Feature: High packet rate, malformed header" },
  { type: "attack", emoji: "🚨", label: "Attack Detected!",
    detail: "Model Confidence: 91.3% | Class: Probe | Feature: Port scan pattern, ICMP sweep" },
  { type: "attack", emoji: "🚨", label: "Attack Detected!",
    detail: "Model Confidence: 97.1% | Class: R2L  | Feature: Unauthorized login attempts on SSH" },
];

// ============================================================
// UTILITIES
// ============================================================

// Live clock
function updateClock() {
  document.getElementById("clock").textContent =
    new Date().toLocaleTimeString("en-IN", { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// Pad a number with a leading zero for display
function pad(n) { return n < 10 ? "0" + n : n; }

// Return current HH:MM:SS string
function timeNow() {
  let d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ============================================================
// COMPUTE STATS FROM MOCK DATA
// ============================================================

let totalTraffic = trafficData.length;
let attackCount  = trafficData.filter(r => r.pred === "Attack").length;
let normalCount  = trafficData.filter(r => r.pred === "Normal").length;

// Protocol frequency map
let protoMap = {};
trafficData.forEach(r => {
  protoMap[r.proto] = (protoMap[r.proto] || 0) + 1;
});

// ============================================================
// UPDATE SUMMARY CARDS (with count-up animation)
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

// ============================================================
// RENDER TRAFFIC TABLE
// ============================================================

function renderTable() {
  let tbody = document.getElementById("traffic-tbody");
  tbody.innerHTML = ""; // clear first

  trafficData.forEach((row, i) => {
    let isAtk  = row.pred === "Attack";
    let isHigh = row.sev  === "High";

    // Build prediction pill
    let predHtml = isAtk
      ? `<span class="pred attack">🔴 Attack</span>`
      : `<span class="pred normal">🟢 Normal</span>`;

    // Build severity badge
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

// ============================================================
// RENDER BAR CHART
// ============================================================

function renderBars() {
  let maxVal = Math.max(normalCount, attackCount);

  // Normal bar
  let normPct = Math.round((normalCount / maxVal) * 100);
  let nBar = document.getElementById("bar-normal");
  nBar.textContent = normalCount + " pkts";
  document.getElementById("lbl-normal").textContent = normalCount + " packets";
  setTimeout(() => { nBar.style.width = normPct + "%"; }, 100);

  // Attack bar
  let atkPct  = Math.round((attackCount / maxVal) * 100);
  let aBar = document.getElementById("bar-attack");
  aBar.textContent = attackCount + " pkts";
  document.getElementById("lbl-attack").textContent = attackCount + " packets";
  setTimeout(() => { aBar.style.width = atkPct + "%"; }, 200);

  // Protocol bars
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

// ============================================================
// RENDER SVG DONUT CHART
// ============================================================

function renderDonut() {
  let svg    = document.getElementById("donut-svg");
  let legend = document.getElementById("donut-legend");
  let cx = 45, cy = 45, r = 32, stroke = 12;
  let circ = 2 * Math.PI * r;

  // Segments: [label, count, color]
  let segments = [
    ["Normal", normalCount, "#00ff88"],
    ["Attack", attackCount, "#ff3860"],
  ];

  let total = normalCount + attackCount;
  let offset = 0;   // running dashoffset
  // Start from top: rotate SVG -90 deg
  let circleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  circleGroup.setAttribute("transform", `rotate(-90 ${cx} ${cy})`);
  svg.appendChild(circleGroup);

  // Background circle
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

    // Legend
    let item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `
      <div class="legend-dot" style="background:${color}"></div>
      <span>${label}: <strong style="color:${color}">${count}</strong>
        (${Math.round(pct*100)}%)</span>
    `;
    legend.appendChild(item);
  });

  // Centre text
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

// ============================================================
// RENDER ALERT SECTION
// ============================================================

function renderAlerts() {
  let list = document.getElementById("alert-list");
  list.innerHTML = "";

  // Use pre-defined alert messages for the attack records
  alertMessages.forEach((a, i) => {
    let isInfo = a.title.startsWith("ℹ");
    let item = document.createElement("div");
    item.className = "alert-item" + (isInfo ? " info" : "");
    // Stagger animation
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
// SIMULATE DETECTION (Manual Demo for Review)
// ============================================================

function simulateDetection() {
  // Pick a random outcome from simOutcomes array
  let outcome = simOutcomes[Math.floor(Math.random() * simOutcomes.length)];
  let el = document.getElementById("sim-result");

  // Reset to trigger animation again
  el.style.display = "none";
  el.className = "";

  void el.offsetWidth; // force reflow

  el.style.display = "block";
  el.className = outcome.type === "attack" ? "attack-res" : "normal-res";
  el.innerHTML = `
    <div>${outcome.emoji}&nbsp; ${outcome.label}</div>
    <p>🤖 ${outcome.detail}</p>
  `;

  // If an attack is simulated, add a live alert entry at top
  if (outcome.type === "attack") {
    addLiveAlert("🚨 Simulated Intrusion", "Random Forest flagged a packet — " + outcome.detail);
  }
}

function resetSimulation() {
  let el = document.getElementById("sim-result");
  el.style.display = "none";
  el.textContent = "";
}

// Push a new alert to the top of the alert list
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
  list.insertBefore(item, list.firstChild); // prepend
}

// ============================================================
// INITIALISE DASHBOARD
// All rendering functions are called here on page load.
// ============================================================

function init() {
  initCards();
  renderTable();
  renderBars();
  renderDonut();
  renderAlerts();
}

// Run when page is ready
window.addEventListener("DOMContentLoaded", init);

/*
 * ============================================================
 * FUTURE SCOPE (for academic report / viva):
 * ─────────────────────────────────────────
 * 1. WebSocket connection to Python Flask/FastAPI backend
 * 2. Real-time packet capture using Scapy / PyShark
 * 3. Live ML predictions streamed to this frontend
 * 4. Replace trafficData[] with API response
 * 5. Add user authentication & role-based access
 * 6. Historical data storage with SQLite / MongoDB
 * ============================================================
 */
```

---

## 📁 **Final Project Structure**
```
your-project-folder/
├── index.html
├── style.css
└── script.js
