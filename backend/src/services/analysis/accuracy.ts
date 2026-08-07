export interface AccuracyConfig {
  cplDecayConstant: number;
  classificationWeights: Record<string, number>;
}

export const DEFAULT_ACCURACY_CONFIG: AccuracyConfig = {
  cplDecayConstant: 0.004, // e^(-0.004 * CPL) decay curve
  classificationWeights: {
    Brilliant: 100,
    Great: 100,
    Best: 100,
    Excellent: 95,
    Good: 80,
    Inaccuracy: 50,
    Mistake: 20,
    Blunder: 0,
  },
};

export interface AccuracyResult {
  whiteAccuracy: number;
  blackAccuracy: number;
}

/**
 * Calculates White and Black accuracy percentages based on a game's list of moves,
 * using an exponential CPL decay function modified by tactical classifications.
 * 
 * @param moves The list of evaluated moves
 * @param config Optional decay settings and classification weights
 */
export function calculateAccuracy(
  moves: any[],
  config: AccuracyConfig = DEFAULT_ACCURACY_CONFIG
): AccuracyResult {
  let whiteSum = 0;
  let whiteCount = 0;
  let blackSum = 0;
  let blackCount = 0;

  moves.forEach((move) => {
    const isWhite = move.turn === 'w';
    const cpl = move.centipawnLoss || 0;
    const label = move.classification?.classification;

    // 1. Calculate accuracy based on centipawn loss decay
    const cplAccuracy = 100 * Math.exp(-config.cplDecayConstant * cpl);

    // 2. Calculate accuracy based on classification weights
    let classAccuracy = 100;
    if (label && config.classificationWeights[label] !== undefined) {
      classAccuracy = config.classificationWeights[label];
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

    if (isWhite) {
      whiteSum += moveAccuracy;
      whiteCount++;
    } else {
      blackSum += moveAccuracy;
      blackCount++;
    }
  });

  // Default to 100% accuracy if no moves were recorded for a side
  const whiteAccuracy = whiteCount > 0 ? Math.round((whiteSum / whiteCount) * 10) / 10 : 100;
  const blackAccuracy = blackCount > 0 ? Math.round((blackSum / blackCount) * 10) / 10 : 100;

  return {
    whiteAccuracy,
    blackAccuracy,
  };
}
export default calculateAccuracy;
