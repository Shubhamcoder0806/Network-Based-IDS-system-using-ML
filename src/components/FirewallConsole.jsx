import React, { useState } from 'react';
import { Flame, ShieldCheck, ShieldAlert, Plus, Trash2, Code } from 'lucide-react';

export default function FirewallConsole({ blockedIPs, onBlockIP, onUnblockIP }) {
  const [customIP, setCustomIP] = useState('');

  const handleAddCustomIP = (e) => {
    e.preventDefault();
    if (customIP.trim()) {
      onBlockIP(customIP.trim());
      setCustomIP('');
    }
  };

  return (
    <div className="glass-panel p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#1b2742] pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" /> Active SOC Firewall Blacklist & Rule Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time IP blacklist enforcement. Dropped packets are prevented from reaching internal assets.
          </p>
        </div>

        {/* Add Rule Form */}
        <form onSubmit={handleAddCustomIP} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter IP (e.g. 192.168.1.150)"
            value={customIP}
            onChange={(e) => setCustomIP(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#090e1a] border border-[#1b2742] text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 w-56"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-semibold hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Block IP
          </button>
        </form>
      </div>

      {/* FIREWALL RULE TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-[#1b2742] text-slate-400 uppercase text-[10px] tracking-wider bg-black/30">
              <th className="p-3">Blocked IP Address</th>
              <th className="p-3">Status</th>
              <th className="p-3">Enforcement Engine</th>
              <th className="p-3">Linux IPTables Rule</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1b2742]/50 text-slate-300">
            {blockedIPs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 text-xs font-mono">
                  No active firewall blocks registered. Add custom IP or click "Block" on any threat packet.
                </td>
              </tr>
            ) : (
              blockedIPs.map((ip) => (
                <tr key={ip} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 font-bold text-rose-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> {ip}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[10px]">
                      BLOCKED
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">SOC Active Zero-Trust Firewall</td>
                  <td className="p-3">
                    <code className="text-cyan-400 text-[11px] bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded">
                      iptables -A INPUT -s {ip} -j DROP
                    </code>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onUnblockIP(ip)}
                      className="px-3 py-1 rounded bg-slate-800 border border-[#1b2742] text-slate-300 text-[11px] hover:text-white hover:border-slate-500 transition-colors inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3 text-slate-400" /> Unblock
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
