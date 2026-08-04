import React from 'react';
import type { AnalysisResponse } from '../services/analysisService';

interface SummaryCardProps {
  response: AnalysisResponse;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ response }) => {
  const totalPlies = response.moveCount || 0;
  const fullMovesCount = Math.ceil(totalPlies / 2);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 backdrop-blur-xl transition-all duration-300 hover:border-slate-800/80 flex flex-col space-y-4 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute -right-8 -top-8 -z-10 h-16 w-16 rounded-full bg-indigo-500/5 blur-2xl" />

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div>
          <h4 className="text-xs font-bold text-slate-200">Review Summary</h4>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Workflow Complete</p>
        </div>
        <div className="px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold text-emerald-400">
          {response.message || 'Game uploaded successfully.'}
        </div>
      </div>

      {/* Basic Metrics (Move Counts) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-850 bg-slate-950/40 p-3">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Total plies</div>
          <div className="text-sm font-extrabold text-indigo-400 mt-1">{totalPlies} plies</div>
        </div>
        <div className="rounded-lg border border-slate-850 bg-slate-950/40 p-3">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Full moves</div>
          <div className="text-sm font-extrabold text-slate-250 mt-1">{fullMovesCount} moves</div>
        </div>
      </div>

      {/* Future Engine Upgrades Placeholders (Skeletal layout) */}
      <div className="border-t border-slate-850/60 pt-3 flex flex-col space-y-2">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Upcoming AI Engine Features</div>
        
        {/* Placeholder: Accuracy Gauge */}
        <div className="flex items-center justify-between p-2 rounded bg-slate-950/20 border border-dashed border-slate-800 opacity-60">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500/40" />
            <span className="text-[10px] text-slate-400 font-medium">Engine Accuracy</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono italic">Future Upgrade</span>
        </div>

        {/* Placeholder: Match Classification */}
        <div className="flex items-center justify-between p-2 rounded bg-slate-950/20 border border-dashed border-slate-800 opacity-60">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500/40" />
            <span className="text-[10px] text-slate-400 font-medium">Match Classification</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono italic">Future Upgrade</span>
        </div>
      </div>
    </div>
  );
};
export default SummaryCard;
