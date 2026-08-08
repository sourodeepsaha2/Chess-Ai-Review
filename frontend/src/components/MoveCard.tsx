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
  isCollapsed: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggleCollapse: () => void;
}

export const MoveCard: React.FC<MoveCardProps> = ({
  move,
  isCollapsed,
  isSelected,
  onSelect,
  onToggleCollapse,
}) => {
  const fenString = move.fen || move.fenAfterMove || '';
  const isWhite = move.turn ? move.turn === 'w' : fenString.includes(' b ');
  const shortenedFen = fenString.split(' ')[0] || '';

  // Handle row click
  const handleHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCollapse();
  };

  // Border and shadow states based on selection
  const cardBorderClass = isSelected
    ? 'border-indigo-500 bg-indigo-950/10 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
    : 'border-slate-850 bg-slate-900/10 hover:border-slate-800 hover:bg-slate-900/20';

  if (isCollapsed) {
    return (
      <div
        onClick={handleHeaderClick}
        className={`rounded-lg border px-3 py-2 flex items-center justify-between cursor-pointer transition-all duration-200 ${cardBorderClass}`}
      >
        {/* Left Section: Number, SAN, Badges */}
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          <span className="text-[10px] font-bold text-slate-500 font-mono min-w-[20px]">
            {move.moveNumber}.{isWhite ? '' : '..'}
          </span>
          <span className="text-xs font-extrabold text-indigo-400 font-mono tracking-wide">
            {move.san}
          </span>
          
          <ClassificationBadge classification={move.classification} />

          {move.tactic && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold truncate max-w-[120px] ${
              move.tactic.type === 'MISSED_MATE'
                ? 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                : move.tactic.type === 'MISSED_WIN'
                ? 'border-amber-500/20 bg-amber-500/5 text-amber-400'
                : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-450'
            }`}>
              {move.tactic.type === 'MISSED_MATE' ? '⚡ Mate' : move.tactic.type === 'MISSED_WIN' ? '⚠ Win' : '⚠ Swing'}
            </span>
          )}
        </div>

        {/* Right Section: CPL, Eval, dropdown arrow */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <CentipawnBadge centipawnLoss={move.centipawnLoss} />
          <EvaluationBadge evaluation={move.evaluation} />
          
          <button
            onClick={handleArrowClick}
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-colors"
          >
            <svg
              className="h-3.5 w-3.5 transform transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Expanded card layout
  return (
    <div
      onClick={onSelect}
      className={`rounded-xl border p-3.5 flex flex-col space-y-3 transition-all duration-300 cursor-pointer ${cardBorderClass}`}
    >
      {/* Top Header: Move Number, SAN, Classification Badge, and Evaluation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-xs font-bold text-slate-500 font-mono">
            {move.moveNumber}.{isWhite ? '' : '..'}
          </span>
          <span className="text-sm font-extrabold text-indigo-400 tracking-wide font-mono">
            {move.san}
          </span>

          <ClassificationBadge classification={move.classification} />

          {move.tactic && (
            <div className={`px-2 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 ${
              move.tactic.type === 'MISSED_MATE'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : move.tactic.type === 'MISSED_WIN'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-450'
            }`}>
              <span>{move.tactic.type === 'MISSED_MATE' ? '⚡' : '⚠'}</span>
              <span>
                {move.tactic.type === 'MISSED_MATE' 
                  ? 'Missed Mate' 
                  : move.tactic.type === 'MISSED_WIN' 
                  ? 'Missed Winning Opportunity' 
                  : 'Missed Opportunity (Eval Swing)'}
              </span>
            </div>
          )}
        </div>

        {/* Right side: Turn indicator & evaluation badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <CentipawnBadge centipawnLoss={move.centipawnLoss} />
          <EvaluationBadge evaluation={move.evaluation} />

          <button
            onClick={handleArrowClick}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
          >
            <svg
              className="h-3.5 w-3.5 transform rotate-180 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
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
        <BestMoveCard bestMove={move.bestMove} />
        <PrincipalVariation pv={move.principalVariation} />
      </div>
    </div>
  );
};

export default MoveCard;
