import React, { useState, useEffect } from 'react';
import { Shield, Radio, Download, Volume2, VolumeX, Clock, Cpu } from 'lucide-react';

export default function Navbar({ onExportReport, snifferActive }) {
  const [timeStr, setTimeStr] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#090e1a]/90 backdrop-blur-xl border-b border-[#1b2742] px-6 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-[#050811] rounded-[11px] flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        <div>
          <h1 className="text-base font-bold tracking-wide bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
            CYBERGUARD AI
          </h1>
          <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <span>SOC Threat Suite</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <Cpu className="w-3 h-3" /> Multi-Model Ensemble
            </span>
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Live Status Badge */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-emerald-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-green" />
          <span>SNIFFER {snifferActive ? 'ACTIVE' : 'IDLE'}</span>
        </div>

        {/* Live Clock */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-[#0e1526] border border-[#1b2742] px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{timeStr || '--:--:--'}</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg bg-[#0e1526] border border-[#1b2742] text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors"
          title={soundEnabled ? 'Mute Alert Sounds' : 'Unmute Alert Sounds'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Export Report Button */}
        <button
          onClick={onExportReport}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500 hover:text-black hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log</span>
        </button>
      </div>
    </header>
  );
}
