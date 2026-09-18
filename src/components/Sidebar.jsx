import React from 'react';
import { Activity, Swords, BrainCircuit, Flame, BarChart3, ShieldCheck } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, alertCount, blockedCount }) {
  const tabs = [
    { id: 'live', label: 'Live SOC Monitor', icon: Activity, badge: null },
    { id: 'redteam', label: 'Red Team Sandbox', icon: Swords, badge: 'Interactive' },
    { id: 'xai', label: 'Explainable AI (XAI)', icon: BrainCircuit, badge: null },
    { id: 'firewall', label: 'SOC Active Firewall', icon: Flame, badge: blockedCount > 0 ? `${blockedCount} Blocked` : null },
    { id: 'metrics', label: 'Model Evaluation', icon: BarChart3, badge: '99.4%' },
  ];

  return (
    <aside className="w-64 bg-[#090e1a]/95 border-r border-[#1b2742] p-4 flex flex-col gap-2 shrink-0 min-h-[calc(100vh-68px)]">
      <div className="text-[11px] font-mono tracking-wider uppercase text-slate-500 px-3 py-1 font-semibold">
        Operations Console
      </div>

      <nav className="flex flex-col gap-1.5 mt-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1526]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </div>

              {tab.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                    tab.id === 'firewall' && blockedCount > 0
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Quick Card */}
      <div className="mt-auto pt-4 border-t border-[#1b2742]">
        <div className="p-3.5 rounded-xl bg-[#0e1526] border border-[#1b2742] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SIEM Core Status</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Zero-Trust Monitoring Active on Interface eth0
          </p>
          <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[94%]" />
          </div>
        </div>
      </div>
    </aside>
  );
}
