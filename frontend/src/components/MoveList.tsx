import React from 'react';
import type { ParsedMove } from '../types/analysis';
import MoveCard from './MoveCard';

interface MoveListProps {
  moves: ParsedMove[];
}

export const MoveList: React.FC<MoveListProps> = ({ moves }) => {
  if (!moves || moves.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-500 italic bg-slate-900/10 border border-slate-900 rounded-xl">
        No moves parsed. Make sure to load a valid game.
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3.5">
      {/* Header index info */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Move History</span>
        <span className="text-[10px] font-bold text-slate-500 font-mono">{moves.length} plies</span>
      </div>

      {/* Scrollable moves container */}
      <div className="flex flex-col space-y-2.5 max-h-[360px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {moves.map((move, index) => (
          <MoveCard 
            key={`${move.moveNumber}-${move.turn}-${index}`} 
            move={move} 
          />
        ))}
      </div>
    </div>
  );
};
export default MoveList;
