import React from 'react';

interface GameStatsProps {
  totalMoves: number;
  averageCentipawnLoss: number;
  classificationCounts: {
    Brilliant: number;
    Great: number;
    Best: number;
    Excellent: number;
    Good: number;
    Inaccuracy: number;
    Mistake: number;
    Blunder: number;
  };
}

export const GameStats: React.FC<GameStatsProps> = ({
  totalMoves,
  averageCentipawnLoss,
  classificationCounts,
}) => {
  // Determine CPL styling color relative to performance
  let avgCplColor = 'text-slate-350';
  if (averageCentipawnLoss <= 25) avgCplColor = 'text-emerald-400';
  else if (averageCentipawnLoss <= 55) avgCplColor = 'text-blue-400';
  else if (averageCentipawnLoss <= 100) avgCplColor = 'text-yellow-500';
  else avgCplColor = 'text-rose-455';

  const classMappings = [
    { label: 'Brilliant', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5', count: classificationCounts.Brilliant },
    { label: 'Great', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', count: classificationCounts.Great },
    { label: 'Best', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', count: classificationCounts.Best },
    { label: 'Excellent', color: 'text-teal-400 border-teal-500/20 bg-teal-500/5', count: classificationCounts.Excellent },
    { label: 'Good', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5', count: classificationCounts.Good },
    { label: 'Inaccuracy', color: 'text-yellow-500 border-yellow-600/20 bg-yellow-600/5', count: classificationCounts.Inaccuracy },
    { label: 'Mistake', color: 'text-rose-400 border-rose-500/20 bg-rose-500/5', count: classificationCounts.Mistake },
    { label: 'Blunder', color: 'text-red-500 border-red-700/20 bg-red-700/5', count: classificationCounts.Blunder },
  ];

  return (
    <div className="flex flex-col space-y-3.5">
      {/* Total moves + CPL splits */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-850 bg-slate-950/40 p-3.5 flex flex-col justify-between transition-all hover:border-slate-800">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Total Moves</span>
          <span className="text-sm font-extrabold text-indigo-400 mt-1">{totalMoves} plies</span>
        </div>
        <div className="rounded-lg border border-slate-850 bg-slate-950/40 p-3.5 flex flex-col justify-between transition-all hover:border-slate-800">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Avg. CP Loss</span>
          <span className={`text-sm font-extrabold mt-1 ${avgCplColor}`}>{averageCentipawnLoss} CP</span>
        </div>
      </div>

      {/* Grid of Classification Counts */}
      <div className="flex flex-col space-y-2.5">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-850/40 pb-1">Move Quality Breakdown</span>
        <div className="grid grid-cols-2 gap-2">
          {classMappings.map((item) => (
            <div 
              key={item.label}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-[10px] font-semibold transition-all hover:brightness-110 ${item.color}`}
            >
              <span>{item.label}</span>
              <span className="font-mono text-[11px] font-extrabold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameStats;
