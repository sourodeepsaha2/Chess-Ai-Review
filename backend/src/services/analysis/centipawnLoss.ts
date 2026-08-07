export interface CplResult {
  playedEvaluation: number;
  bestEvaluation: number;
  centipawnLoss: number;
}

/**
 * Calculates the Centipawn Loss (CPL) for a move.
 * Normalizes calculations to the active player's perspective.
 * 
 * @param bestEvaluation Evaluation of the position before the move (White's perspective)
 * @param playedEvaluation Evaluation of the position after the move (White's perspective)
 * @param turn The color of the player who made the move ('w' or 'b')
 */
export function calculateCentipawnLoss(
  bestEvaluation: number,
  playedEvaluation: number,
  turn: 'w' | 'b'
): CplResult {
  // Graceful fallback for invalid/NaN engine responses
  if (
    typeof bestEvaluation !== 'number' ||
    typeof playedEvaluation !== 'number' ||
    isNaN(bestEvaluation) ||
    isNaN(playedEvaluation)
  ) {
    return {
      playedEvaluation: playedEvaluation || 0,
      bestEvaluation: bestEvaluation || 0,
      centipawnLoss: 0,
    };
  }

  const isWhite = turn === 'w';

  // White wants to maximize evaluation; Black wants to minimize evaluation.
  // Loss = (best score - played score) from player's perspective.
  const loss = isWhite
    ? bestEvaluation - playedEvaluation
    : playedEvaluation - bestEvaluation;

  // Centipawn loss is non-negative (can't gain advantage over the engine's best move)
  const centipawnLoss = Math.max(0, loss);

  return {
    playedEvaluation,
    bestEvaluation,
    centipawnLoss,
  };
}
