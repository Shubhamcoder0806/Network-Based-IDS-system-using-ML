import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ShieldAlert, ShieldCheck, Target, AlertTriangle, ShieldX, Eye } from 'lucide-react';

export default function LiveMonitor({ packets, alerts, stats, chartData, onInspectXAI, onBlockIP }) {
  return (
    <div className="flex flex-col gap-6">
      {/* 4 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Packets Card */}
        <div className="glass-panel glass-panel-hover p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Packets</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-cyan-400 mb-1">{stats.total_analyzed || 0}</div>
          <p className="text-xs text-slate-400">Sampled real-time traffic flows</p>
        </div>

        {/* Threats Detected Card */}
        <div className="glass-panel glass-panel-hover p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Threats Flagged</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-rose-400 mb-1">{stats.attack_count || 0}</div>
          <p className="text-xs text-slate-400">Intrusions & malicious events</p>
        </div>

        {/* Normal Traffic Card */}
        <div className="glass-panel glass-panel-hover p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Normal Traffic</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400 mb-1">{stats.normal_count || 0}</div>
          <p className="text-xs text-slate-400">Legitimate business packets</p>
        </div>

        {/* Ensemble Accuracy Card */}
        <div className="glass-panel glass-panel-hover p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ML Accuracy</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-purple-400 mb-1">99.4%</div>
          <p className="text-xs text-slate-400">Random Forest + XGBoost Ensemble</p>
        </div>
      </div>

      {/* TELEMETRY CHART + ALERTS DRAWER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Telemetry Chart */}
        <div className="lg:col-span-2 glass-panel p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Real-Time Bandwidth & Threat Volumetric Flow</h3>
              <p className="text-xs text-slate-400">Live sampling window (1.2s emission rate)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Normal Flow
              </div>
              <div className="flex items-center gap-1.5 text-rose-400">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Threat Spikes
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="attackGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090e1a', borderColor: '#1b2742', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="normal" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#normalGrad)" />
                <Area type="monotone" dataKey="attack" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#attackGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Alerts Panel */}
        <div className="glass-panel p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Live Security Alerts
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[10px]">
              {alerts.length} Recent
            </span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[250px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500 font-mono">
                No active threat alerts detected yet.
              </div>
            ) : (
              alerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 border-l-4 border-l-rose-500 flex flex-col gap-1 transition-all hover:bg-rose-500/10"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
                    <span>{alt.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{alt.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{alt.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* LIVE PACKETS STREAM TABLE */}
      <div className="glass-panel p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Live Network Packet Stream & ML Inference Log</h3>
            <p className="text-xs text-slate-400">Real-time classification, MITRE ATT&CK mapping & XAI inspect controls</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-lg">
            {packets.length} packets buffered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#1b2742] text-slate-400 uppercase text-[10px] tracking-wider bg-black/30">
                <th className="p-3">Time</th>
                <th className="p-3">Source IP</th>
                <th className="p-3">Destination IP</th>
                <th className="p-3">Protocol</th>
                <th className="p-3">Port</th>
                <th className="p-3">Size</th>
                <th className="p-3">ML Classification</th>
                <th className="p-3">Severity</th>
                <th className="p-3">MITRE ATT&CK</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2742]/50 text-slate-300">
              {packets.map((pkt) => {
                const analysis = pkt.analysis || {};
                const isAttack = analysis.prediction === 'Attack';
                const isBlocked = analysis.prediction === 'Blocked';

                return (
                  <tr key={pkt.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 text-slate-400">{pkt.timestamp}</td>
                    <td className="p-3 font-semibold text-cyan-400">{pkt.src}</td>
                    <td className="p-3 text-slate-400">{pkt.dst}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px]">
                        {pkt.proto}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{pkt.port}</td>
                    <td className="p-3 text-slate-400">{pkt.size} B</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                          isAttack
                            ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                            : isBlocked
                            ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400'
                            : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {analysis.attack_type || 'Normal'}
                      </span>
                    </td>
                    <td className="p-3 font-bold">
                      <span className={analysis.severity === 'Critical' || analysis.severity === 'High' ? 'text-rose-400' : 'text-emerald-400'}>
                        {analysis.severity || 'Low'}
                      </span>
                    </td>
                    <td className="p-3">
                      <code className="text-yellow-400 text-[11px] bg-yellow-400/10 border border-yellow-400/20 px-1.5 py-0.5 rounded">
                        {analysis.mitre_id || 'N/A'}
                      </code>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2 font-sans">
                        <button
                          onClick={() => onInspectXAI(pkt)}
                          className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] hover:bg-cyan-500 hover:text-black transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> XAI
                        </button>
                        {!isBlocked && (
                          <button
                            onClick={() => onBlockIP(pkt.src)}
                            className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-1"
                          >
                            <ShieldX className="w-3 h-3" /> Block
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
