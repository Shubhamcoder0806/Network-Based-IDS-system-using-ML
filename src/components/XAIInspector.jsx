import React from 'react';
import { BrainCircuit, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

export default function XAIInspector({ selectedPacket }) {
  if (!selectedPacket) {
    return (
      <div className="glass-panel p-12 text-center flex flex-col items-center justify-center gap-3">
        <BrainCircuit className="w-12 h-12 text-slate-600 animate-pulse" />
        <h3 className="text-sm font-bold text-slate-300">No Packet Selected for XAI Inspection</h3>
        <p className="text-xs text-slate-500 font-mono max-w-md">
          Select any packet row from the Live Packet Stream table in the Live SOC Monitor tab to analyze Explainable AI feature attribution weights.
        </p>
      </div>
    );
  }

  const analysis = selectedPacket.analysis || {};
  const xai = analysis.xai_attribution || [];

  return (
    <div className="glass-panel p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#1b2742] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
              ID: {selectedPacket.id}
            </span>
            <span className="text-xs font-mono text-slate-400">Timestamp: {selectedPacket.timestamp}</span>
          </div>
          <h2 className="text-base font-bold text-slate-100 mt-1 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-cyan-400" /> Explainable AI (XAI) SHAP Feature Attribution
          </h2>
        </div>

        <div className="text-right">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
              analysis.prediction === 'Attack'
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
            }`}
          >
            {analysis.prediction === 'Attack' ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            {analysis.attack_type} ({analysis.confidence}% Confidence)
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#090e1a] border border-[#1b2742]">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Source Host</span>
          <div className="text-sm font-mono font-bold text-cyan-400 mt-1">{selectedPacket.src}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#090e1a] border border-[#1b2742]">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Destination Host</span>
          <div className="text-sm font-mono font-bold text-slate-200 mt-1">{selectedPacket.dst}:{selectedPacket.port}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#090e1a] border border-[#1b2742]">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">MITRE ATT&CK Mapping</span>
          <div className="text-sm font-mono font-bold text-yellow-400 mt-1">{analysis.mitre_id || 'N/A'}</div>
        </div>
      </div>

      {/* SHAP Feature Importance Bars */}
      <div className="p-5 rounded-xl bg-[#090e1a] border border-[#1b2742] flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" /> Feature Attribution Weight Breakdown (%)
        </h3>

        <div className="flex flex-col gap-3.5">
          {xai.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">{item.feature} (Recorded Value: <strong className="text-cyan-400">{item.value}</strong>)</span>
                <span className="text-cyan-400 font-bold">{item.importance}%</span>
              </div>
              <div className="w-full bg-[#050811] h-2.5 rounded-full overflow-hidden p-[1px]">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.importance}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOC Recommendation */}
      <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex flex-col gap-1">
        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AI Analyst SOC Recommendation:</h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {analysis.prediction === 'Attack'
            ? `Flagged high-risk ${analysis.attack_type} threat. Recommended action: Add IP ${selectedPacket.src} to active firewall blacklist and isolate compromised port ${selectedPacket.port}.`
            : 'Standard benign network packet. No active security mitigation required.'}
        </p>
      </div>
    </div>
  );
}
