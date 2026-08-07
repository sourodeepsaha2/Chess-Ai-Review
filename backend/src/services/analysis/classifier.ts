export type MoveClassification =
  | 'Brilliant'
  | 'Great'
  | 'Best'
  | 'Excellent'
  | 'Good'
  | 'Inaccuracy'
  | 'Mistake'
  | 'Blunder';

export interface ClassificationResult {
  classification: MoveClassification;
  color: string;
  icon: string;
}

export interface MoveContext {
  centipawnLoss: number;
  bestEvaluation: number;
  playedEvaluation: number;
  turn: 'w' | 'b';
  playedMoveUci: string;
  bestMoveUci: string;
  isForced: boolean;
  hadMateOpportunity: boolean;
  createdMateOpportunity: boolean;
}

export interface ClassifierConfig {
  cplExcellent: number;
  cplGood: number;
  cplInaccuracy: number;
  cplMistake: number;
  winningThreshold: number; // score threshold above which a position is considered totally winning (e.g. 400 CP)
}

export const DEFAULT_CLASSIFIER_THRESHOLDS: ClassifierConfig = {
  cplExcellent: 25,
  cplGood: 55,
  cplInaccuracy: 100,
  cplMistake: 200,
  winningThreshold: 450, // +4.50 pawns
};

/**
 * Classifies a played move based on tactical context, CPL, forced status, and mate swings.
 */
export function classifyMove(
  context: MoveContext,
  config: ClassifierConfig = DEFAULT_CLASSIFIER_THRESHOLDS
): ClassificationResult {
  const {
    centipawnLoss,
    bestEvaluation,
    playedEvaluation,
    turn,
    playedMoveUci,
    bestMoveUci,
    isForced,
    hadMateOpportunity,
    createdMateOpportunity,
  } = context;

  const isWhite = turn === 'w';

  // 1. Forced Move Check:
  // If the player only had one legal move option, it's categorized as Best.
  if (isForced) {
    return {
      classification: 'Best',
      color: '#9bdf54',
      icon: 'best',
    };
  }

  // 2. Exact Match or Zero Loss (optimal moves):
  // Check if player played the engine's absolute best recommended UCI square move or has no CPL
  const isOptimal = centipawnLoss === 0 || playedMoveUci === bestMoveUci;

  if (isOptimal) {
    // Brilliant Move Check:
    // User found the best move which created a mate opportunity, but did not have a mate previously
    if (createdMateOpportunity && !hadMateOpportunity) {
      return {
        classification: 'Brilliant',
        color: '#00ebc7',
        icon: 'brilliant',
      };
    }

    // Great Move Check:
    // User found the best move which preserves a mate sequence, or finds the only winning tactical shot.
    if (createdMateOpportunity && hadMateOpportunity) {
      return {
        classification: 'Great',
        color: '#ffb900',
        icon: 'great',
      };
    }

    // Otherwise standard Best Move
    return {
      classification: 'Best',
      color: '#9bdf54',
      icon: 'best',
    };
  }

  // 3. Suboptimal Move checks:
  // Determine if the player remains completely winning even after this suboptimal move.
  // E.g. White played a move with CPL > 100, but evaluation is still +5.5.
  // We downgrade the penalty (e.g. Blunder becomes Inaccuracy, Mistake becomes Good).
  const isCurrentlyWinning = isWhite
    ? playedEvaluation >= config.winningThreshold
    : playedEvaluation <= -config.winningThreshold;

  let finalCpl = centipawnLoss;

  if (isCurrentlyWinning) {
    // Halve the effective CPL penalty if we remain completely winning to avoid over-penalizing
    finalCpl = centipawnLoss * 0.4;
  }

  // 4. Centipawn Loss Range Classifications:
  if (finalCpl <= config.cplExcellent) {
    return {
      classification: 'Excellent',
      color: '#95bb72',
      icon: 'excellent',
    };
  }

  if (finalCpl <= config.cplGood) {
    return {
      classification: 'Good',
      color: '#3b82f6',
      icon: 'good',
    };
  }

  if (finalCpl <= config.cplInaccuracy) {
    return {
      classification: 'Inaccuracy',
      color: '#f59e0b',
      icon: 'inaccuracy',
    };
  }

  if (finalCpl <= config.cplMistake) {
    return {
      classification: 'Mistake',
      color: '#ef4444',
      icon: 'mistake',
    };
  }

  // If loss is greater than Mistake threshold, it is a Blunder
  return {
    classification: 'Blunder',
    color: '#b91c1c',
    icon: 'blunder',
  };
}
export default classifyMove;
