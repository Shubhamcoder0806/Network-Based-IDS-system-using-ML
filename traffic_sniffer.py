import time
import random
import threading
from ml_engine import ids_engine

class TrafficSnifferSimulator:
    def __init__(self, callback=None):
        self.callback = callback
        self.is_running = False
        self._thread = None
        self.blocked_ips = set()
        self.attack_mode = None

    def start(self):
        if not self.is_running:
            self.is_running = True
            self._thread = threading.Thread(target=self._run_loop, daemon=True)
            self._thread.start()
            print("[Traffic Engine] Live Packet Sniffer & Generator background worker active.")

    def stop(self):
        self.is_running = False

    def trigger_attack_simulation(self, attack_type):
        self.attack_mode = attack_type
        print(f"[Traffic Engine] Red Team Attack Simulation Triggered: {attack_type}")

    def block_ip(self, ip_address):
        self.blocked_ips.add(ip_address)
        print(f"[Firewall Manager] IP {ip_address} blocked successfully.")
        return list(self.blocked_ips)

    def unblock_ip(self, ip_address):
        self.blocked_ips.discard(ip_address)
        print(f"[Firewall Manager] IP {ip_address} unblocked.")
        return list(self.blocked_ips)

    def generate_packet_features(self):
        src_ip = f"192.168.1.{random.randint(2, 254)}"
        dst_ip = "10.0.0.1"
        proto = "TCP"

        if self.attack_mode:
            curr_attack = self.attack_mode
            self.attack_mode = None
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
        return src_ip, dst_ip, proto, port, features

    def _run_loop(self):
        while self.is_running:
            try:
                src, dst, proto, port, features = self.generate_packet_features()
                
                if src in self.blocked_ips:
                    analysis = {
                        "prediction": "Blocked",
                        "attack_type": "Blocked IP",
                        "label": "Traffic Dropped by Active SOC Firewall Rule",
                        "severity": "High",
                        "confidence": 100.0,
                        "mitre_id": "T1562",
                        "description": f"Source IP {src} is present on the active firewall blacklist.",
                        "features": {"size": features[0], "duration": features[1], "flow_rate": features[2], "syn_count": features[3], "ack_count": features[4], "entropy": features[5], "port": port},
                        "xai_attribution": []
                    }
                else:
                    analysis = ids_engine.analyze_packet(features)

                packet_event = {
                    "id": f"pkt_{int(time.time() * 1000)}_{random.randint(100, 999)}",
                    "timestamp": time.strftime("%H:%M:%S"),
                    "src": src,
                    "dst": dst,
                    "proto": proto,
                    "port": port,
                    "size": round(features[0], 1),
                    "analysis": analysis
                }

                if self.callback:
                    self.callback(packet_event)

            except Exception as e:
                print("[Traffic Engine] Loop exception:", e)

            time.sleep(1.2)

traffic_sniffer = TrafficSnifferSimulator()
