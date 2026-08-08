import React from 'react';
import type { ParsedMove } from '../types/analysis';

interface TacticalSummaryProps {
  moves: ParsedMove[];
  onSelectMove: (index: number) => void;
}

export const TacticalSummary: React.FC<TacticalSummaryProps> = ({
  moves,
  onSelectMove,
}) => {
  // Find all moves that have a missed tactical opportunity
  const tacticalMoves = moves
    .map((move, index) => ({ move, index }))
    .filter(({ move }) => !!move.tactic);

  const missedMatesCount = tacticalMoves.filter(({ move }) => move.tactic?.type === 'MISSED_MATE').length;
  const missedWinsCount = tacticalMoves.filter(({ move }) => move.tactic?.type === 'MISSED_WIN').length;
  const evalSwingsCount = tacticalMoves.filter(({ move }) => move.tactic?.type === 'EVAL_SWING').length;

  return (
    <div className="border-t border-slate-850/60 pt-3.5 flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Tactical Opportunities</span>
        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[9px] font-bold text-rose-400">
          {tacticalMoves.length} missed
        </span>
      </div>

      {/* Aggregate Counts */}
      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
        <div className="rounded-lg border border-slate-850 bg-slate-950/40 p-2 flex flex-col justify-between hover:border-slate-800 transition-all">
          <span className="text-[8px] text-slate-500 uppercase">Mates</span>
          <span className="text-sm text-rose-400 mt-1 font-mono">{missedMatesCount}</span>
        </div>
        <div className="rounded-lg border border-slate-850 bg-slate-950/40 p-2 flex flex-col justify-between hover:border-slate-800 transition-all">
          <span className="text-[8px] text-slate-500 uppercase">Wins</span>
          <span className="text-sm text-amber-400 mt-1 font-mono">{missedWinsCount}</span>
        </div>
        <div className="rounded-lg border border-slate-850 bg-slate-950/40 p-2 flex flex-col justify-between hover:border-slate-800 transition-all">
          <span className="text-[8px] text-slate-500 uppercase">Swings</span>
          <span className="text-sm text-yellow-500 mt-1 font-mono">{evalSwingsCount}</span>
        </div>
      </div>

      {/* Clickable List of Missed Opportunities */}
      {tacticalMoves.length > 0 ? (
        <div className="flex flex-col space-y-1.5 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {tacticalMoves.map(({ move, index }) => {
            const isWhite = move.turn === 'w';
            const tacticText = move.tactic?.type === 'MISSED_MATE'
              ? 'Missed Mate'
              : move.tactic?.type === 'MISSED_WIN'
              ? 'Missed Win'
              : 'Eval Swing';
            const badgeColor = move.tactic?.type === 'MISSED_MATE'
              ? 'text-rose-400 border-rose-500/20 bg-rose-500/5'
              : move.tactic?.type === 'MISSED_WIN'
              ? 'text-amber-400 border-amber-500/20 bg-amber-500/5'
              : 'text-yellow-500 border-yellow-600/20 bg-yellow-600/5';

            return (
              <button
                key={`${move.moveNumber}-${index}`}
                onClick={() => onSelectMove(index)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold flex items-center justify-between hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer ${badgeColor}`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-bold opacity-80 min-w-[28px]">
                    {move.moveNumber}.{isWhite ? '' : '..'}
                  </span>
                  <span className="font-extrabold font-mono tracking-wide">{move.san}</span>
                  <span className="opacity-60">({isWhite ? 'White' : 'Black'})</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider">{tacticText}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-2.5 text-[10px] text-slate-500 italic bg-slate-900/10 border border-slate-900 rounded-lg">
          No missed tactical opportunities detected. Good job!
        </div>
      )}
    </div>
  );
};

export default TacticalSummary;
