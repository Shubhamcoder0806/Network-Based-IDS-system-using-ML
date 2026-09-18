import os
import time
import json
import random
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from ml_engine import ids_engine

RECENT_PACKETS = []
SECURITY_ALERTS = []
BLOCKED_IPS = set()
ATTACK_MODE = None

class TrafficSnifferSimulator:
    def __init__(self):
        self.is_running = False
        self._thread = None

    def start(self):
        if not self.is_running:
            self.is_running = True
            self._thread = threading.Thread(target=self._run_loop, daemon=True)
            self._thread.start()
            print("[Traffic Engine] Background Sniffer thread active.")

    def _run_loop(self):
        global ATTACK_MODE, RECENT_PACKETS, SECURITY_ALERTS
        while self.is_running:
            try:
                src_ip = f"192.168.1.{random.randint(2, 254)}"
                dst_ip = "10.0.0.1"
                proto = "TCP"

                if ATTACK_MODE:
                    curr_attack = ATTACK_MODE
                    ATTACK_MODE = None
                else:
                    curr_attack = random.choices(
                        ["Normal", "DDoS", "PortScan", "BruteForce", "Exfiltration", "ZeroDay"],
                        weights=[0.75, 0.08, 0.06, 0.05, 0.04, 0.02]
                    )[0]

                if curr_attack == "Normal":
                    size = random.uniform(100, 800)
                    dur = random.uniform(0.1, 4.0)
                    rate = random.uniform(10, 150)
                    syn = random.choice([0, 1])
                    ack = random.choice([0, 1])
                    entropy = random.uniform(2.0, 4.5)
                    port = random.choice([80, 443, 22, 53, 8080])
                    proto = random.choice(["TCP", "UDP", "HTTPS", "DNS"])
                elif curr_attack == "DDoS":
                    src_ip = f"45.142.{random.randint(1, 255)}.{random.randint(1, 255)}"
                    size = random.uniform(64, 150)
                    dur = random.uniform(0.001, 0.1)
                    rate = random.uniform(4000, 15000)
                    syn = 1
                    ack = 0
                    entropy = random.uniform(0.5, 1.8)
                    port = 80
                    proto = "SYN-FLOOD"
                elif curr_attack == "PortScan":
                    src_ip = f"185.220.{random.randint(1, 255)}.{random.randint(1, 255)}"
                    size = 64
                    dur = random.uniform(0.001, 0.02)
                    rate = random.uniform(1200, 4000)
                    syn = 1
                    ack = 0
                    entropy = 0.8
                    port = random.randint(1, 1024)
                    proto = "TCP-SCAN"
                elif curr_attack == "BruteForce":
                    src_ip = f"103.203.{random.randint(1, 255)}.{random.randint(1, 255)}"
                    size = random.uniform(250, 400)
                    dur = random.uniform(0.05, 0.3)
                    rate = random.uniform(800, 2200)
                    syn = 1
                    ack = 1
                    entropy = 3.8
                    port = 22
                    proto = "SSH"
                elif curr_attack == "Exfiltration":
                    src_ip = "192.168.1.105"
                    dst_ip = f"198.51.100.{random.randint(1, 254)}"
                    size = random.uniform(1400, 1500)
                    dur = random.uniform(10.0, 45.0)
                    rate = random.uniform(2000, 6000)
                    syn = 0
                    ack = 1
                    entropy = random.uniform(7.2, 7.95)
                    port = 443
                    proto = "HTTPS-EXFIL"
                else:
                    src_ip = f"91.240.{random.randint(1, 255)}.{random.randint(1, 255)}"
                    size = random.uniform(800, 1400)
                    dur = random.uniform(0.01, 0.5)
                    rate = random.uniform(6000, 12000)
                    syn = 1
                    ack = 0
                    entropy = random.uniform(7.6, 8.0)
                    port = random.randint(1024, 65000)
                    proto = "CUSTOM-PROTO"

                features = [size, dur, rate, syn, ack, entropy, port]
                
                if src_ip in BLOCKED_IPS:
                    analysis = {
                        "prediction": "Blocked",
                        "attack_type": "Blocked IP",
                        "label": "Traffic Dropped by Active SOC Firewall Rule",
                        "severity": "High",
                        "confidence": 100.0,
                        "mitre_id": "T1562",
                        "description": f"Source IP {src_ip} is present on firewall blacklist.",
                        "features": {"size": size, "duration": dur, "flow_rate": rate, "syn_count": syn, "ack_count": ack, "entropy": entropy, "port": port},
                        "xai_attribution": []
                    }
                else:
                    analysis = ids_engine.analyze_packet(features)

                packet_event = {
                    "id": f"pkt_{int(time.time() * 1000)}_{random.randint(100, 999)}",
                    "timestamp": time.strftime("%H:%M:%S"),
                    "src": src_ip,
                    "dst": dst_ip,
                    "proto": proto,
                    "port": port,
                    "size": round(size, 1),
                    "analysis": analysis
                }

                RECENT_PACKETS.insert(0, packet_event)
                if len(RECENT_PACKETS) > 100:
                    RECENT_PACKETS.pop()

                if analysis.get("prediction") == "Attack":
                    alert = {
                        "id": f"alt_{len(SECURITY_ALERTS) + 1}",
                        "time": packet_event["timestamp"],
                        "src": src_ip,
                        "type": analysis.get("attack_type"),
                        "severity": analysis.get("severity"),
                        "mitre": analysis.get("mitre_id"),
                        "title": f"🚨 {analysis.get('severity')} Severity: {analysis.get('label')}",
                        "details": f"Flagged traffic from {src_ip} -> {dst_ip} on port {port}. Confidence: {analysis.get('confidence')}%"
                    }
                    SECURITY_ALERTS.insert(0, alert)
                    if len(SECURITY_ALERTS) > 50:
                        SECURITY_ALERTS.pop()

            except Exception as e:
                print("[Traffic Engine] Error:", e)

            time.sleep(1.2)

sniffer = TrafficSnifferSimulator()
sniffer.start()

class SOCRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/health":
            self._send_json({
                "status": "online",
                "engine": "Advanced Standard Python ML/DL Threat Detection Suite",
                "sniffer_active": sniffer.is_running,
                "blocked_ips_count": len(BLOCKED_IPS)
            })
        elif self.path == "/api/traffic/recent":
            normal_count = sum(1 for p in RECENT_PACKETS if p["analysis"].get("prediction") == "Normal")
            attack_count = sum(1 for p in RECENT_PACKETS if p["analysis"].get("prediction") == "Attack")
            blocked_count = sum(1 for p in RECENT_PACKETS if p["analysis"].get("prediction") == "Blocked")
            self._send_json({
                "packets": RECENT_PACKETS[:30],
                "alerts": SECURITY_ALERTS[:15],
                "stats": {
                    "total_analyzed": len(RECENT_PACKETS),
                    "normal_count": normal_count,
                    "attack_count": attack_count,
                    "blocked_count": blocked_count,
                    "threat_ratio": round((attack_count / max(1, len(RECENT_PACKETS))) * 100, 1)
                },
                "blocked_ips": list(BLOCKED_IPS)
            })
        elif self.path == "/api/metrics":
            self._send_json(ids_engine.get_model_performance_metrics())
        else:
            super().do_GET()

    def do_POST(self):
        global ATTACK_MODE
        content_length = int(self.headers.get('Content-Length', 0))
        body_str = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        try:
            payload = json.loads(body_str)
        except:
            payload = {}

        if self.path == "/predict":
            features = payload.get("features", [500, 1.0, 50, 0, 1, 3.2, 80])
            analysis = ids_engine.analyze_packet(features)
            self._send_json({
                "prediction": analysis["prediction"],
                "attack_type": analysis["attack_type"],
                "confidence": analysis["confidence"],
                "analysis": analysis
            })
        elif self.path == "/api/simulate/attack":
            attack_type = payload.get("attack_type", "DDoS")
            ATTACK_MODE = attack_type
            self._send_json({"status": "success", "message": f"Triggered attack simulation: {attack_type}"})
        elif self.path == "/api/firewall/block":
            ip = payload.get("ip")
            if ip:
                BLOCKED_IPS.add(ip)
            self._send_json({"status": "success", "blocked_ips": list(BLOCKED_IPS)})
        elif self.path == "/api/firewall/unblock":
            ip = payload.get("ip")
            if ip:
                BLOCKED_IPS.discard(ip)
            self._send_json({"status": "success", "blocked_ips": list(BLOCKED_IPS)})
        else:
            self.send_error(404, "Endpoint not found")

    def _send_json(self, data):
        body = json.dumps(data).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == "__main__":
    PORT = 5000
    print(f"🚀 High-End Enterprise AI NIDS & SOC Suite active on http://0.0.0.0:{PORT}")
    server = HTTPServer(('0.0.0.0', PORT), SOCRequestHandler)
    server.serve_forever()
