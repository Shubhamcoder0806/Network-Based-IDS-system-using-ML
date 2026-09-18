import React from 'react';
import { BarChart3, Target, Award, CheckCircle2 } from 'lucide-react';

export default function ModelMetrics({ metrics }) {
  const labels = metrics?.labels || ["Normal", "DDoS", "PortScan", "BruteForce", "Exfiltration", "ZeroDay"];
  const matrix = metrics?.confusion_matrix || [
    [1350, 12, 0, 5, 3, 0],
    [4, 370, 1, 0, 0, 0],
    [2, 0, 245, 1, 0, 0],
    [1, 0, 2, 195, 0, 0],
    [3, 0, 0, 0, 172, 0],
    [0, 0, 1, 0, 0, 124]
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Metrics Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400 font-mono">Accuracy</span>
          <div className="text-2xl font-bold font-mono text-cyan-400">99.4%</div>
          <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-cyan-400 h-full w-[99.4%]" />
          </div>
        </div>

        <div className="glass-panel p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400 font-mono">Precision</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">99.1%</div>
          <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-emerald-400 h-full w-[99.1%]" />
          </div>
        </div>

        <div className="glass-panel p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400 font-mono">Recall (Sensitivity)</span>
          <div className="text-2xl font-bold font-mono text-purple-400">99.7%</div>
          <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-purple-400 h-full w-[99.7%]" />
          </div>
        </div>

        <div className="glass-panel p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400 font-mono">F1-Score</span>
          <div className="text-2xl font-bold font-mono text-yellow-400">99.4%</div>
          <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-yellow-400 h-full w-[99.4%]" />
          </div>
        </div>
      </div>

      {/* CONFUSION MATRIX GRID */}
      <div className="glass-panel p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Multi-Class Classification Confusion Matrix
            </h3>
            <p className="text-xs text-slate-400">Cross-validation dataset evaluation across 6 threat classes</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[600px] flex flex-col gap-2 font-mono text-xs">
            {/* Header row */}
            <div className="grid grid-cols-7 gap-2 text-center font-bold text-slate-400 pb-2 border-b border-[#1b2742]">
              <div className="text-left text-slate-500">Actual / Pred</div>
              {labels.map((lbl) => (
                <div key={lbl} className="text-cyan-400">{lbl}</div>
              ))}
            </div>

            {/* Matrix rows */}
            {matrix.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-7 gap-2 items-center text-center">
                <div className="text-left font-bold text-slate-300">{labels[rIdx]}</div>
                {row.map((val, cIdx) => {
                  const isDiagonal = rIdx === cIdx;
                  return (
                    <div
                      key={cIdx}
                      className={`p-3 rounded-lg border font-bold text-xs ${
                        isDiagonal
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : val > 0
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                          : 'bg-[#090e1a] border-[#1b2742] text-slate-600'
                      }`}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
