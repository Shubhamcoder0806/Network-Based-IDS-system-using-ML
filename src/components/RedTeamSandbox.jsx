import React from 'react';
import { Swords, Waves, Search, Key, Package, Biohazard, Play } from 'lucide-react';

export default function RedTeamSandbox({ onTriggerAttack }) {
  const attackVectors = [
    {
      id: 'DDoS',
      title: 'SYN / UDP Volumetric DDoS',
      mitre: 'T1498.001',
      icon: Waves,
      color: 'from-rose-500 to-red-600',
      description: 'High-frequency packet flood targeting target IP port 80. Flagged by high flow rate and SYN flags.'
    },
    {
      id: 'PortScan',
      title: 'Reconnaissance Port Scan',
      mitre: 'T1046',
      icon: Search,
      color: 'from-amber-500 to-orange-600',
      description: 'Sequential TCP SYN sweep across internal subnet to identify exposed service ports.'
    },
    {
      id: 'BruteForce',
      title: 'SSH Credential Spray',
      mitre: 'T1110',
      icon: Key,
      color: 'from-yellow-500 to-amber-600',
      description: 'Rapid authentication attempts targeting port 22 with default password dictionaries.'
    },
    {
      id: 'Exfiltration',
      title: 'Data Exfiltration Payload',
      mitre: 'T1041',
      icon: Package,
      color: 'from-purple-500 to-indigo-600',
      description: 'Encrypted outbound data transfer burst with high payload entropy (7.8+).'
    },
    {
      id: 'ZeroDay',
      title: 'Zero-Day Anomaly Detection',
      mitre: 'T1203',
      icon: Biohazard,
      color: 'from-cyan-500 to-blue-600',
      description: 'Unseen behavioral protocol anomaly flagged by Deep Autoencoder anomaly engine.'
    }
  ];

  return (
    <div className="glass-panel p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#1b2742] pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Swords className="w-5 h-5 text-rose-400" /> Red Team Interactive Attack Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Inject realistic synthetic cyber attack vectors into the live network stream to evaluate ML Ensemble detection speed & XAI attribution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {attackVectors.map((atk) => {
          const Icon = atk.icon;
          return (
            <div
              key={atk.id}
              className="glass-panel glass-panel-hover p-5 flex flex-col justify-between gap-4 relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${atk.color}`} />

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-[#1b2742] text-slate-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded">
                    {atk.mitre}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 mt-1 group-hover:text-cyan-400 transition-colors">
                  {atk.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {atk.description}
                </p>
              </div>

              <button
                onClick={() => onTriggerAttack(atk.id)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-red-600/20 border border-rose-500/40 text-rose-400 text-xs font-semibold hover:from-rose-500 hover:to-red-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-rose-500/20 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Inject {atk.id} Attack</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
