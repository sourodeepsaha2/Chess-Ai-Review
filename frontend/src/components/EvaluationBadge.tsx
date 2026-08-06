import React from 'react';

interface EvaluationBadgeProps {
  evaluation?: number;
}

export const EvaluationBadge: React.FC<EvaluationBadgeProps> = ({ evaluation }) => {
  if (evaluation === undefined || evaluation === null) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-wide border bg-slate-800/40 border-slate-700/30 text-slate-400 uppercase">
        Unknown
      </span>
    );
  }

  const MATE_THRESHOLD = 90000;
  const isMate = Math.abs(evaluation) >= MATE_THRESHOLD;

  if (isMate) {
    const moves = evaluation > 0 ? (100000 - evaluation) : (-100000 - evaluation);
    const movesAbs = Math.abs(moves);
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-wide border bg-violet-500/10 border-violet-500/30 text-violet-400 animate-pulse">
        Mate in {movesAbs}
      </span>
    );
  }

  // Format as decimal centipawn (e.g. +1.25 or -0.80)
  const cpValue = evaluation / 100;
  const formatted = cpValue >= 0 ? `+${cpValue.toFixed(2)}` : cpValue.toFixed(2);
  
  const isPositive = cpValue >= 0;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-wide border font-mono ${
      isPositive 
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
    }`}>
      {formatted}
    </span>
  );
};
export default EvaluationBadge;
