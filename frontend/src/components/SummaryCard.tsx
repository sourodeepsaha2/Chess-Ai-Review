import React from 'react';
import type { AnalysisResponse } from '../services/analysisService';

interface SummaryCardProps {
  response: AnalysisResponse;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ response }) => {
  const totalMoves = response.summary?.totalMoves || response.moveCount || 0;
  const avgCpl = response.summary?.averageCentipawnLoss ?? 0;
  const counts = response.summary?.classificationCounts || {
    Brilliant: 0,
    Great: 0,
    Best: 0,
    Excellent: 0,
    Good: 0,
    Inaccuracy: 0,
    Mistake: 0,
    Blunder: 0,
  };

  // Determine CPL styling color relative to performance
  let avgCplColor = 'text-slate-350';
  if (response.summary) {
    if (avgCpl <= 25) avgCplColor = 'text-emerald-400';
    else if (avgCpl <= 55) avgCplColor = 'text-blue-400';
    else if (avgCpl <= 100) avgCplColor = 'text-yellow-500';
    else avgCplColor = 'text-rose-455';
  }

  // Classification styling mappings
  const classMappings = [
    { label: 'Brilliant', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5', count: counts.Brilliant },
    { label: 'Great', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', count: counts.Great },
    { label: 'Best', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', count: counts.Best },
    { label: 'Excellent', color: 'text-teal-400 border-teal-500/20 bg-teal-500/5', count: counts.Excellent },
    { label: 'Good', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5', count: counts.Good },
    { label: 'Inaccuracy', color: 'text-yellow-500 border-yellow-600/20 bg-yellow-600/5', count: counts.Inaccuracy },
    { label: 'Mistake', color: 'text-rose-400 border-rose-500/20 bg-rose-500/5', count: counts.Mistake },
    { label: 'Blunder', color: 'text-red-500 border-red-700/20 bg-red-700/5', count: counts.Blunder },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 backdrop-blur-xl transition-all duration-300 hover:border-slate-800/80 flex flex-col space-y-4 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute -right-8 -top-8 -z-10 h-16 w-16 rounded-full bg-indigo-500/5 blur-2xl" />

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div>
          <h4 className="text-xs font-bold text-slate-200">Review Summary</h4>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Analysis Complete</p>
        </div>
        <div className="px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold text-emerald-400">
          {response.message || 'Game reviewed successfully'}
        </div>
      </div>

      {/* Primary Aggregate Statistics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-850 bg-slate-950/40 p-3 flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Total Moves</span>
          <span className="text-sm font-extrabold text-indigo-400 mt-1">{totalMoves} plies</span>
        </div>
        <div className="rounded-lg border border-slate-850 bg-slate-950/40 p-3 flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Avg. CP Loss</span>
          <span className={`text-sm font-extrabold mt-1 ${avgCplColor}`}>{response.summary ? `${avgCpl} CP` : '--'}</span>
        </div>
      </div>

      {/* Grid of Classification Counts */}
      <div className="flex flex-col space-y-2">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-855/40 pb-1">Move Quality Breakdown</span>
        <div className="grid grid-cols-2 gap-2">
          {classMappings.map((item) => (
            <div 
              key={item.label}
              className={`flex items-center justify-between p-2 rounded-lg border text-[10px] font-semibold ${item.color}`}
            >
              <span>{item.label}</span>
              <span className="font-mono text-[11px] font-extrabold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Future Upgrades: Open Index slots for Accuracy / Opening Detection */}
      <div className="border-t border-slate-850/60 pt-3 flex flex-col space-y-2">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Performance Metrics</span>
        <div className="grid grid-cols-2 gap-2">
          {/* Accuracy Placeholder */}
          <div className="flex items-center justify-between p-2 rounded bg-slate-950/20 border border-dashed border-slate-800 opacity-60">
            <span className="text-[9px] text-slate-400 font-medium">Accuracy</span>
            <span className="text-[9px] text-slate-500 font-mono italic">--%</span>
          </div>

          {/* Opening Detection Placeholder */}
          <div className="flex items-center justify-between p-2 rounded bg-slate-950/20 border border-dashed border-slate-800 opacity-60">
            <span className="text-[9px] text-slate-400 font-medium">Opening</span>
            <span className="text-[9px] text-slate-500 font-mono italic">--</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SummaryCard;

