import { ACCURACY_CONFIG } from '../../config/analysisConfig';

export interface AccuracyResult {
  whiteAccuracy: number;
  blackAccuracy: number;
}

/**
 * Calculates White and Black accuracy percentages based on a game's list of moves,
 * using an exponential CPL decay function modified by tactical classifications.
 * 
 * @param moveAnalyses The list of evaluated moves
 */
export function calculateAccuracy(moveAnalyses: any[]): AccuracyResult {
  let whiteSum = 0;
  let whiteCount = 0;
  let blackSum = 0;
  let blackCount = 0;

  if (!Array.isArray(moveAnalyses)) {
    return { whiteAccuracy: 100, blackAccuracy: 100 };
  }

  moveAnalyses.forEach((move) => {
    if (!move) return;
    
    const isWhite = move.turn === 'w';
    let cpl = move.centipawnLoss;

    // Handle invalid / negative / NaN CPL values safely
    if (typeof cpl !== 'number' || isNaN(cpl) || cpl < 0) {
      cpl = 0;
    }

    const label = move.classification?.classification;

    // 1. Calculate accuracy based on centipawn loss decay
    const cplAccuracy = 100 * Math.exp(-ACCURACY_CONFIG.cplDecayConstant * cpl);

    // 2. Calculate accuracy based on classification weights
    let classAccuracy = 100;
    if (label && (ACCURACY_CONFIG.classificationWeights as any)[label] !== undefined) {
      classAccuracy = (ACCURACY_CONFIG.classificationWeights as any)[label];
    }

    // 3. Combine both systems:
    let moveAccuracy = cplAccuracy;
    
    if (label === 'Brilliant' || label === 'Great' || label === 'Best') {
      // Optimal moves are locked to 100% accuracy
      moveAccuracy = 100;
    } else if (label === 'Blunder') {
      // Blunders cap the accuracy rating at 20%
      moveAccuracy = Math.min(cplAccuracy, 20);
    } else {
      // For intermediate moves, average both centipawn decay and classification levels
      moveAccuracy = (cplAccuracy + classAccuracy) / 2;
    }

    // Keep individual move accuracy strictly bound between 0 and 100
    moveAccuracy = Math.min(100, Math.max(0, moveAccuracy));

    if (isWhite) {
      whiteSum += moveAccuracy;
      whiteCount++;
    } else {
      blackSum += moveAccuracy;
      blackCount++;
    }
  });

  // Default to 100% accuracy if no moves were recorded for a side
  const whiteAccuracy = whiteCount > 0 
    ? Math.min(100, Math.max(0, Math.round((whiteSum / whiteCount) * 10) / 10)) 
    : 100;
    
  const blackAccuracy = blackCount > 0 
    ? Math.min(100, Math.max(0, Math.round((blackSum / blackCount) * 10) / 10)) 
    : 100;

  return {
    whiteAccuracy,
    blackAccuracy,
  };
}

export default calculateAccuracy;
