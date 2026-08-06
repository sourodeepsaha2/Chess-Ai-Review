import React from 'react';

interface BestMoveCardProps {
  bestMove?: string;
}

export const BestMoveCard: React.FC<BestMoveCardProps> = ({ bestMove }) => {
  if (!bestMove) {
    return (
      <div className="flex items-center gap-1.5 p-1 px-2 rounded bg-slate-950/20 border border-slate-900/60 opacity-60">
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wide">Best Move:</span>
        <span className="text-[10px] font-mono text-slate-500 italic">None</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 p-1 px-2 rounded bg-indigo-500/5 border border-indigo-500/20">
      <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-wide">Best Move:</span>
      <span className="text-[10px] font-bold text-indigo-300 font-mono select-all cursor-pointer hover:text-white" title="Click to select move">
        {bestMove}
      </span>
    </div>
  );
};
export default BestMoveCard;
