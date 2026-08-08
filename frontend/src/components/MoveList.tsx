import React, { useState, useEffect, useRef } from 'react';
import type { ParsedMove } from '../types/analysis';
import MoveCard from './MoveCard';
import { messagingService } from '../services/messagingService';

interface MoveListProps {
  moves: ParsedMove[];
  selectedIndex: number | null;
  onSelectMove: (index: number) => void;
}

export const MoveList: React.FC<MoveListProps> = ({
  moves,
  selectedIndex,
  onSelectMove,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [masterCollapsed, setMasterCollapsed] = useState(true);
  const [collapsedMap, setCollapsedMap] = useState<Record<number, boolean>>({});
  
  const listRef = useRef<HTMLDivElement>(null);

  // Initialize all moves to masterCollapsed state when moves load or masterCollapsed toggles
  useEffect(() => {
    const nextMap: Record<number, boolean> = {};
    moves.forEach((_, idx) => {
      nextMap[idx] = masterCollapsed;
    });
    setCollapsedMap(nextMap);
  }, [moves, masterCollapsed]);

  // Sync board position and scroll card into view when index changes
  useEffect(() => {
    if (selectedIndex !== null && moves[selectedIndex]) {
      const selectedMove = moves[selectedIndex];
      const fenString = selectedMove.fen || selectedMove.fenAfterMove || '';
      
      // Broadcast to active page content script to load this FEN
      messagingService.sendMessage('LOAD_BOARD_POSITION', { fen: fenString, timestamp: Date.now() });

      // Smooth scroll selected card into view
      const cardEl = document.getElementById(`move-card-${selectedIndex}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedIndex, moves]);

  if (!moves || moves.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-500 italic bg-slate-900/10 border border-slate-900 rounded-xl">
        No moves parsed. Make sure to load a valid game.
      </div>
    );
  }

  // Filter moves based on search query (by move number or SAN moves)
  const filteredMoves = moves
    .map((move, originalIndex) => ({ move, originalIndex }))
    .filter(({ move }) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase().trim();
      const numMatch = move.moveNumber.toString() === query;
      const sanMatch = move.san.toLowerCase().includes(query);
      return numMatch || sanMatch;
    });

  // Navigation handlers
  const handleFirst = () => {
    if (moves.length > 0) onSelectMove(0);
  };

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      onSelectMove(selectedIndex - 1);
    } else if (selectedIndex === null && moves.length > 0) {
      onSelectMove(0);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < moves.length - 1) {
      onSelectMove(selectedIndex + 1);
    } else if (selectedIndex === null && moves.length > 0) {
      onSelectMove(0);
    }
  };

  const handleLast = () => {
    if (moves.length > 0) onSelectMove(moves.length - 1);
  };

  // Toggle individual card collapse
  const toggleCardCollapse = (idx: number) => {
    setCollapsedMap((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* Search & Navigation Bar */}
      <div className="rounded-xl border border-slate-850 bg-slate-950/40 p-3.5 space-y-3">
        {/* Search move input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search move (e.g. 18, Nf3)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
          />
          <div className="absolute left-2.5 top-2.5 text-slate-500">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-[10px]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Step replay navigation + expand/collapse controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleFirst}
              disabled={moves.length === 0}
              className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="First Move"
            >
              ⇤
            </button>
            <button
              onClick={handlePrev}
              disabled={selectedIndex === 0 || moves.length === 0}
              className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Previous Move"
            >
              ←
            </button>
            
            {/* Status ply bubble */}
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-indigo-400 font-mono min-w-[70px] text-center">
              {selectedIndex !== null ? `Ply ${selectedIndex + 1}/${moves.length}` : `0 / ${moves.length} plies`}
            </span>

            <button
              onClick={handleNext}
              disabled={selectedIndex === moves.length - 1 || moves.length === 0}
              className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Next Move"
            >
              →
            </button>
            <button
              onClick={handleLast}
              disabled={moves.length === 0}
              className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Last Move"
            >
              ⇥
            </button>
          </div>

          {/* Master Collapse Toggle */}
          <button
            onClick={() => setMasterCollapsed(!masterCollapsed)}
            className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900 text-[9px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{masterCollapsed ? 'Expand All' : 'Collapse All'}</span>
          </button>
        </div>
      </div>

      {/* Move list */}
      <div className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Move History</span>
          <span className="text-[10px] font-bold text-slate-500 font-mono">
            {filteredMoves.length} moves found
          </span>
        </div>

        <div 
          ref={listRef}
          className="flex flex-col space-y-2 max-h-[420px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
        >
          {filteredMoves.map(({ move, originalIndex }) => (
            <div 
              key={`${move.moveNumber}-${move.turn}-${originalIndex}`}
              id={`move-card-${originalIndex}`}
            >
              <MoveCard
                move={move}
                isCollapsed={collapsedMap[originalIndex] ?? masterCollapsed}
                isSelected={selectedIndex === originalIndex}
                onSelect={() => onSelectMove(originalIndex)}
                onToggleCollapse={() => toggleCardCollapse(originalIndex)}
              />
            </div>
          ))}

          {filteredMoves.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-500 italic bg-slate-900/10 border border-slate-900 rounded-xl">
              No matching moves found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoveList;
