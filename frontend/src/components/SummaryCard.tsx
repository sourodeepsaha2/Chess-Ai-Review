import React from 'react';
import type { AnalysisResponse } from '../services/analysisService';
import AccuracyCard from './AccuracyCard';
import GameStats from './GameStats';
import OpeningCard from './OpeningCard';
import TacticalSummary from './TacticalSummary';

interface SummaryCardProps {
  response: AnalysisResponse;
  onSelectMove: (index: number) => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ response, onSelectMove }) => {
  const totalMoves = response.summary?.totalMoves || response.moveCount || 0;
  const avgCpl = response.summary?.averageCentipawnLoss ?? 0;
  const whiteAcc = response.summary?.whiteAccuracy ?? 100;
  const blackAcc = response.summary?.blackAccuracy ?? 100;
  const counts = response.summary?.classificationCounts || {
    Brilliant: 0,
    Great: 0,
    Best: 0,
    Excellent: 0,
    Good: 0,
    Inaccuracy: 0,
    Mistake: 0,
    Blunder: 0,
  };

  const openingName = response.summary?.openingName || response.game?.opening?.name;
  const ecoCode = response.summary?.ecoCode || response.game?.opening?.eco;
  const openingVariation = response.summary?.openingVariation || response.game?.opening?.variation;

  return (
    <div className="rounded-xl border border-slate-850 bg-slate-900/10 p-4 backdrop-blur-xl transition-all duration-300 hover:border-slate-800 flex flex-col space-y-4 relative overflow-hidden">
      {/* Subtle Indigo Glow background */}
      <div className="absolute -right-8 -top-8 -z-10 h-16 w-16 rounded-full bg-indigo-500/5 blur-2xl" />

      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-850/60 pb-3">
        <div>
          <h4 className="text-xs font-bold text-slate-200">Review Summary</h4>
          <p className="text-[9px] text-slate-500 uppercase tracking-wide">Analysis Complete</p>
        </div>
        <div className="px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold text-emerald-400">
          {response.message || 'Game reviewed successfully'}
        </div>
      </div>

      {/* 1. Accuracy Section */}
      <AccuracyCard 
        whiteAccuracy={whiteAcc} 
        blackAccuracy={blackAcc} 
      />

      {/* 2. Statistics Section */}
      <GameStats 
        totalMoves={totalMoves} 
        averageCentipawnLoss={avgCpl} 
        classificationCounts={counts} 
      />

      {/* 3. Opening Section */}
      <OpeningCard 
        openingName={openingName} 
        ecoCode={ecoCode} 
        openingVariation={openingVariation} 
      />

      {/* 4. Tactical Opportunities Section */}
      <TacticalSummary 
        moves={response.moves || []} 
        onSelectMove={onSelectMove} 
      />
    </div>
  );
};

export default SummaryCard;
