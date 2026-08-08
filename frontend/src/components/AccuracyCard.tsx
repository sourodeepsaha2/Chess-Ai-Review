import React from 'react';

interface AccuracyCardProps {
  whiteAccuracy: number;
  blackAccuracy: number;
}

export const AccuracyCard: React.FC<AccuracyCardProps> = ({
  whiteAccuracy,
  blackAccuracy,
}) => {
  const getAccuracyColor = (val: number) => {
    if (val >= 85) return 'text-emerald-450';
    if (val >= 70) return 'text-yellow-500';
    return 'text-rose-455';
  };

  const getGaugeColor = (val: number) => {
    if (val >= 85) return 'bg-emerald-500';
    if (val >= 70) return 'bg-yellow-500';
    return 'bg-rose-500';
  };

  return (
    <div className="grid grid-cols-2 gap-3.5">
      {/* White Accuracy */}
      <div className="rounded-xl border border-slate-850 bg-slate-950/45 p-3.5 flex flex-col justify-between relative overflow-hidden transition-all hover:border-slate-800">
        <div className="absolute -left-6 -bottom-6 w-12 h-12 rounded-full bg-white/5 blur-xl" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-100 shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">White Acc</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">100% max</span>
        </div>

        <div className="mt-2 flex items-baseline gap-1">
          <span className={`text-xl font-extrabold font-mono tracking-tighter ${getAccuracyColor(whiteAccuracy)}`}>
            {whiteAccuracy.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-500 font-bold">%</span>
        </div>

        {/* Small premium progress gauge line */}
        <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-3">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getGaugeColor(whiteAccuracy)}`}
            style={{ width: `${whiteAccuracy}%` }}
          />
        </div>
      </div>

      {/* Black Accuracy */}
      <div className="rounded-xl border border-slate-850 bg-slate-950/45 p-3.5 flex flex-col justify-between relative overflow-hidden transition-all hover:border-slate-800">
        <div className="absolute -right-6 -bottom-6 w-12 h-12 rounded-full bg-indigo-500/5 blur-xl" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-950 border border-slate-750" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Black Acc</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">100% max</span>
        </div>

        <div className="mt-2 flex items-baseline gap-1">
          <span className={`text-xl font-extrabold font-mono tracking-tighter ${getAccuracyColor(blackAccuracy)}`}>
            {blackAccuracy.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-500 font-bold">%</span>
        </div>

        {/* Small premium progress gauge line */}
        <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-3">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getGaugeColor(blackAccuracy)}`}
            style={{ width: `${blackAccuracy}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AccuracyCard;
