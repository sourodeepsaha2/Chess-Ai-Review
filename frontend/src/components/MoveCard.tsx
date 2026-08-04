import React from 'react';
import type { ParsedMove } from '../types/analysis';

interface MoveCardProps {
  move: ParsedMove;
}

export const MoveCard: React.FC<MoveCardProps> = ({ move }) => {

  const isWhite = move.turn === 'w';
  const playerLabel = isWhite ? 'White' : 'Black';
  
  // Extract just the board layout part of the FEN (first space-delimited substring)
  const shortenedFen = move.fenAfterMove.split(' ')[0];

  return (
    <div className="rounded-xl border border-slate-850 bg-slate-900/10 p-3.5 flex flex-col space-y-3 transition-all duration-300 hover:bg-slate-900/20 hover:border-slate-800">
      
      {/* Top Header: Move Number, SAN, Player Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Move indicator (e.g. "1. e4" or "1... c5") */}
          <span className="text-xs font-bold text-slate-500 font-mono">
            {move.moveNumber}.{isWhite ? '' : '..'}
          </span>
          <span className="text-sm font-extrabold text-indigo-400 tracking-wide font-mono">
            {move.san}
          </span>
        </div>

        {/* Player Badge */}
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${isWhite ? 'bg-slate-100 shadow-[0_0_4px_rgba(255,255,255,0.4)]' : 'bg-slate-950 border border-slate-750'}`} />
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{playerLabel}</span>
        </div>
      </div>

      {/* Board position FEN layout */}
      <div className="flex flex-col space-y-1 bg-slate-950/40 rounded-lg p-2 border border-slate-900">
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Board Position (FEN)</span>
        <span className="text-[10px] font-mono text-slate-350 truncate hover:text-white select-all cursor-pointer" title={move.fenAfterMove}>
          {shortenedFen}
        </span>
      </div>

      {/* Future Engine Extension Slots (Hidden or skeletal layout) */}
      <div className="border-t border-slate-850/40 pt-2 grid grid-cols-2 gap-2 opacity-50">
        {/* Placeholder: Best Move & Evaluation */}
        <div className="text-[9px] text-slate-500 flex flex-col">
          <span className="font-semibold text-slate-550 uppercase tracking-wider text-[7px]">Future Evaluation</span>
          <span className="italic mt-0.5">Best Move: --</span>
        </div>
        
        {/* Placeholder: Classification badge */}
        <div className="text-[9px] text-slate-500 flex flex-col items-end justify-center">
          <span className="px-1.5 py-0.5 rounded border border-dashed border-slate-800 text-[8px] italic">
            No Eval
          </span>
        </div>
      </div>
    </div>
  );
};
export default MoveCard;
