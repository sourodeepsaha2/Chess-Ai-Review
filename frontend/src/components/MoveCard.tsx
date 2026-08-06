import React from 'react';
import type { ParsedMove } from '../types/analysis';
import EvaluationBadge from './EvaluationBadge';
import BestMoveCard from './BestMoveCard';
import PrincipalVariation from './PrincipalVariation';

interface MoveCardProps {
  move: ParsedMove;
}

export const MoveCard: React.FC<MoveCardProps> = ({ move }) => {
  const fenString = move.fen || move.fenAfterMove || '';
  
  // Calculate player label: FEN after White's move has 'b' as side to move
  const isWhite = move.turn ? move.turn === 'w' : fenString.includes(' b ');
  const playerLabel = isWhite ? 'White' : 'Black';
  
  // Extract just the board layout part of the FEN (first space-delimited substring)
  const shortenedFen = fenString.split(' ')[0] || '';

  return (
    <div className="rounded-xl border border-slate-850 bg-slate-900/10 p-3.5 flex flex-col space-y-3 transition-all duration-300 hover:bg-slate-900/20 hover:border-slate-800">
      
      {/* Top Header: Move Number, SAN, Player Badge, and Evaluation */}
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

        {/* Right side: Turn indicator, evaluation and future classification badges */}
        <div className="flex items-center gap-2">
          {/* Engine Evaluation Badge */}
          <EvaluationBadge evaluation={move.evaluation} />

          {/* Reserved slot for future ClassificationBadge */}
          {/* <ClassificationBadge classification={move.classification} /> */}

          {/* Player Turn Indicator */}
          <div className="flex items-center gap-1.5 ml-1">
            <span className={`h-1.5 w-1.5 rounded-full ${isWhite ? 'bg-slate-100 shadow-[0_0_4px_rgba(255,255,255,0.4)]' : 'bg-slate-950 border border-slate-750'}`} />
            <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">{playerLabel}</span>
          </div>
        </div>
      </div>

      {/* Board position FEN layout */}
      <div className="flex flex-col space-y-1 bg-slate-950/40 rounded-lg p-2 border border-slate-900">
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Board Position (FEN)</span>
        <span className="text-[10px] font-mono text-slate-350 truncate hover:text-white select-all cursor-pointer" title={fenString}>
          {shortenedFen}
        </span>
      </div>

      {/* Engine Best Move and PV tags */}
      <div className="flex flex-col space-y-2">
        {/* Best Move suggestion */}
        <BestMoveCard bestMove={move.bestMove} />

        {/* Principal Variation (PV) tag cloud */}
        <PrincipalVariation pv={move.principalVariation} />
      </div>
    </div>
  );
};
export default MoveCard;

