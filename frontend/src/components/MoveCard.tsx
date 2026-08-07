import React from 'react';
import type { ParsedMove } from '../types/analysis';
import EvaluationBadge from './EvaluationBadge';
import BestMoveCard from './BestMoveCard';
import PrincipalVariation from './PrincipalVariation';
import ClassificationBadge from './ClassificationBadge';
import CentipawnBadge from './CentipawnBadge';
import EvaluationIndicator from './EvaluationIndicator';

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
      
      {/* Top Header: Move Number, SAN, Classification Badge, and Evaluation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Move indicator (e.g. "1. e4" or "1... c5") */}
          <span className="text-xs font-bold text-slate-500 font-mono">
            {move.moveNumber}.{isWhite ? '' : '..'}
          </span>
          <span className="text-sm font-extrabold text-indigo-400 tracking-wide font-mono">
            {move.san}
          </span>
          
          {/* Move Quality Classification Badge */}
          <ClassificationBadge classification={move.classification} />

          {/* Tactical Opportunity Badge */}
          {move.tactic && (
            <div className={`px-2 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 ${
              move.tactic.severity === 'critical'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : move.tactic.severity === 'high'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-450'
            }`}>
              <span className="text-[10px]">⚠️</span>
              <span>{move.tactic.tactic}</span>
            </div>
          )}
        </div>

        {/* Right side: Turn indicator & evaluation badge */}
        <div className="flex items-center gap-2">
          {/* Centipawn Loss Badge */}
          <CentipawnBadge centipawnLoss={move.centipawnLoss} />

          {/* Engine Evaluation Badge */}
          <EvaluationBadge evaluation={move.evaluation} />

          {/* Player Turn Indicator */}
          <div className="flex items-center gap-1.5 ml-1">
            <span className={`h-1.5 w-1.5 rounded-full ${isWhite ? 'bg-slate-100 shadow-[0_0_4px_rgba(255,255,255,0.4)]' : 'bg-slate-950 border border-slate-750'}`} />
            <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">{playerLabel}</span>
          </div>
        </div>
      </div>

      {/* Advantage Gauge indicator */}
      <EvaluationIndicator evaluation={move.evaluation} />

      {/* Board position FEN layout */}
      <div className="flex flex-col space-y-1 bg-slate-950/40 rounded-lg p-2 border border-slate-900/40">
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

      {/* Future AI Explanation Card Slot */}
      {/* 
      <div className="mt-1 pt-2.5 border-t border-slate-850/60 flex flex-col space-y-1 w-full">
        <div className="flex items-center gap-1.5">
          <svg className="h-3 w-3 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">AI Explanation</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed italic bg-indigo-500/5 border border-indigo-500/10 p-2 rounded-lg">
          "The engine evaluates {move.san} as a {move.classification?.classification || 'move'} because it..."
        </p>
      </div>
      */}
    </div>
  );
};
export default MoveCard;


