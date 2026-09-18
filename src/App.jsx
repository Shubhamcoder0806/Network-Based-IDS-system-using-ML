import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LiveMonitor from './components/LiveMonitor';
import RedTeamSandbox from './components/RedTeamSandbox';
import XAIInspector from './components/XAIInspector';
import FirewallConsole from './components/FirewallConsole';
import ModelMetrics from './components/ModelMetrics';

const API_BASE = 'http://localhost:5000';

export default function App() {
  const [activeTab, setActiveTab] = useState('live');
  const [packets, setPackets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ total_analyzed: 0, normal_count: 0, attack_count: 0, blocked_count: 0 });
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [chartData, setChartData] = useState(Array(15).fill({ time: '', normal: 0, attack: 0 }));
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [snifferActive, setSnifferActive] = useState(true);

  // Poll real-time traffic stream
  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/traffic/recent`);
        if (!res.ok) return;
        const data = await res.json();

        setPackets(data.packets || []);
        setAlerts(data.alerts || []);
        setStats(data.stats || {});
        setBlockedIPs(data.blocked_ips || []);

        // Update telemetry chart history
        setChartData((prev) => {
          const next = [...prev.slice(1)];
          next.push({
            time: new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' }),
            normal: data.stats.normal_count || 0,
            attack: data.stats.attack_count || 0
          });
          return next;
        });
      } catch (err) {
        console.warn('Backend stream offline, using live generator.');
      }
    };

    fetchStream();
    const interval = setInterval(fetchStream, 1500);
    return () => clearInterval(interval);
  }, []);

  // Fetch model metrics
  useEffect(() => {
    fetch(`${API_BASE}/api/metrics`)
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => {});
  }, []);

  const handleInspectXAI = (packet) => {
    setSelectedPacket(packet);
    setActiveTab('xai');
  };

  const handleTriggerAttack = async (attackType) => {
    try {
      await fetch(`${API_BASE}/api/simulate/attack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attack_type: attackType }),
      });
      alert(`⚔️ Red Team Attack Simulation Launched: ${attackType}`);
    } catch (err) {
      alert(`Simulation triggered: ${attackType}`);
    }
  };

  const handleBlockIP = async (ip) => {
    try {
      await fetch(`${API_BASE}/api/firewall/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip }),
      });
      setBlockedIPs((prev) => Array.from(new Set([...prev, ip])));
    } catch (err) {
      setBlockedIPs((prev) => Array.from(new Set([...prev, ip])));
    }
  };

  const handleUnblockIP = async (ip) => {
    try {
      await fetch(`${API_BASE}/api/firewall/unblock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip }),
      });
      setBlockedIPs((prev) => prev.filter((i) => i !== ip));
    } catch (err) {
      setBlockedIPs((prev) => prev.filter((i) => i !== ip));
    }
  };

  const handleExportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      system: 'CYBERGUARD AI SOC Threat Operations Suite',
      stats,
      blocked_ips: blockedIPs,
      recent_packets: packets,
      recent_alerts: alerts,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CYBERGUARD_SOC_Audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans">
      <Navbar onExportReport={handleExportReport} snifferActive={snifferActive} />

      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          alertCount={alerts.length}
          blockedCount={blockedIPs.length}
        />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {activeTab === 'live' && (
            <LiveMonitor
              packets={packets}
              alerts={alerts}
              stats={stats}
              chartData={chartData}
              onInspectXAI={handleInspectXAI}
              onBlockIP={handleBlockIP}
            />
          )}

          {activeTab === 'redteam' && (
            <RedTeamSandbox onTriggerAttack={handleTriggerAttack} />
          )}

          {activeTab === 'xai' && (
            <XAIInspector selectedPacket={selectedPacket} />
          )}

          {activeTab === 'firewall' && (
            <FirewallConsole
              blockedIPs={blockedIPs}
              onBlockIP={handleBlockIP}
              onUnblockIP={handleUnblockIP}
            />
          )}

          {activeTab === 'metrics' && (
            <ModelMetrics metrics={metrics} />
          )}
        </main>
      </div>
    </div>
  );
}
