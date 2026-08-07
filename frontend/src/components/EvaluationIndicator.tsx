import React from 'react';

interface EvaluationIndicatorProps {
  evaluation?: number;
}

export const EvaluationIndicator: React.FC<EvaluationIndicatorProps> = ({ evaluation }) => {
  if (evaluation === undefined || evaluation === null) {
    return (
      <div className="flex flex-col space-y-1 w-full bg-slate-950/20 p-2 rounded-lg border border-slate-900/40">
        <div className="flex justify-between items-center">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Advantage Gauge</span>
          <span className="text-[9px] font-bold text-slate-500 font-mono italic">Unknown</span>
        </div>
        <div className="relative h-1.5 w-full bg-slate-950 rounded-full border border-slate-900/60" />
      </div>
    );
  }

  const MATE_THRESHOLD = 90000;
  const isMate = Math.abs(evaluation) >= MATE_THRESHOLD;

  // Determine text representation
  let labelText = '';
  if (isMate) {
    labelText = evaluation > 0 ? 'White Forced Mate' : 'Black Forced Mate';
  } else {
    labelText = evaluation >= 0 
      ? `White +${(evaluation / 100).toFixed(2)}` 
      : `Black +${(Math.abs(evaluation) / 100).toFixed(2)}`;
  }

  // Normalize score between -5.00 and +5.00 for the visual bar (capping at -500 and +500)
  // If it is mate, fill completely in the winning direction.
  let percentage = 50;
  if (isMate) {
    percentage = evaluation > 0 ? 100 : 0;
  } else {
    const clamped = Math.min(500, Math.max(-500, evaluation));
    // Map -500 to +500 onto 0% to 100% width
    percentage = ((clamped + 500) / 1000) * 100;
  }

  return (
    <div className="flex flex-col space-y-1 w-full bg-slate-950/20 p-2 rounded-lg border border-slate-900/40">
      <div className="flex justify-between items-center">
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Advantage Gauge</span>
        <span className={`text-[9px] font-bold font-mono ${evaluation >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {labelText}
        </span>
      </div>
      <div className="relative h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900/60">
        {/* Center line marker */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 z-10" />
        
        {/* Visual score bar */}
        <div 
          className={`absolute top-0 bottom-0 rounded-full transition-all duration-300 ${
            evaluation >= 0 ? 'left-1/2 bg-emerald-500/70' : 'right-1/2 bg-rose-500/70'
          }`}
          style={
            evaluation >= 0 
              ? { right: `${100 - percentage}%` } 
              : { left: `${percentage}%` }
          }
        />
      </div>
    </div>
  );
};
export default EvaluationIndicator;
