import { TACTICAL_THRESHOLDS } from './constants';
import { TacticalOpportunity, TacticSeverity, TacticType } from './types';

export class TacticalDetector {
  /**
   * Identifies tactical opportunities missed by the player using evaluation differences.
   * Normalizes perspectives based on player color.
   * 
   * @param moveNumber The ply move index
   * @param turn Color of active player ('w' or 'b')
   * @param bestMove UCI format best recommended move (e.g. 'e2e4')
   * @param bestEvaluation Position evaluation before move (White perspective)
   * @param playedEvaluation Position evaluation after move (White perspective)
   */
  public detectOpportunity(
    moveNumber: number,
    turn: 'w' | 'b',
    bestMove: string,
    bestEvaluation: number,
    playedEvaluation: number
  ): TacticalOpportunity | null {
    const isWhite = turn === 'w';
    const player: 'white' | 'black' = isWhite ? 'white' : 'black';

    // 1. Calculate CPL (centipawn loss) from active player's perspective
    const rawLoss = isWhite
      ? bestEvaluation - playedEvaluation
      : playedEvaluation - bestEvaluation;
    
    const centipawnLoss = Math.max(0, rawLoss);

    // 2. Check for Missed Mate:
    // User had a forced mate sequence, but played evaluation drops below mate threshold
    let isMissedMate = false;
    if (isWhite) {
      const hadMate = bestEvaluation >= TACTICAL_THRESHOLDS.mateThreshold;
      const keptMate = playedEvaluation >= TACTICAL_THRESHOLDS.mateThreshold;
      isMissedMate = hadMate && !keptMate;
    } else {
      const hadMate = bestEvaluation <= -TACTICAL_THRESHOLDS.mateThreshold;
      const keptMate = playedEvaluation <= -TACTICAL_THRESHOLDS.mateThreshold;
      isMissedMate = hadMate && !keptMate;
    }

    if (isMissedMate) {
      return {
        moveNumber,
        player,
        type: 'MISSED_MATE',
        severity: 'high',
        bestMove,
        evaluationBefore: bestEvaluation,
        evaluationAfter: playedEvaluation,
      };
    }

    // 3. Check for Missed Winning Opportunity:
    // Player had a winning position (>= winningThreshold) but evaluation drops to drawish/equal range
    let isMissedWin = false;
    if (isWhite) {
      const isWinningBefore = bestEvaluation >= TACTICAL_THRESHOLDS.winningThreshold;
      const isWinningAfter = playedEvaluation >= TACTICAL_THRESHOLDS.winningThreshold - 150;
      isMissedWin = isWinningBefore && !isWinningAfter && centipawnLoss >= 150;
    } else {
      const isWinningBefore = bestEvaluation <= -TACTICAL_THRESHOLDS.winningThreshold;
      const isWinningAfter = playedEvaluation <= -TACTICAL_THRESHOLDS.winningThreshold + 150;
      isMissedWin = isWinningBefore && !isWinningAfter && centipawnLoss >= 150;
    }

    if (isMissedWin) {
      const severity: TacticSeverity = centipawnLoss >= TACTICAL_THRESHOLDS.highSeverityThreshold
        ? 'high'
        : 'medium';
      return {
        moveNumber,
        player,
        type: 'MISSED_WIN',
        severity,
        bestMove,
        evaluationBefore: bestEvaluation,
        evaluationAfter: playedEvaluation,
      };
    }

    // 4. Check for general Evaluation Swing:
    if (centipawnLoss >= TACTICAL_THRESHOLDS.evalSwingThreshold) {
      const severity: TacticSeverity = centipawnLoss >= TACTICAL_THRESHOLDS.highSeverityThreshold
        ? 'high'
        : 'medium';
      return {
        moveNumber,
        player,
        type: 'EVAL_SWING',
        severity,
        bestMove,
        evaluationBefore: bestEvaluation,
        evaluationAfter: playedEvaluation,
      };
    }

    return null;
  }
}

export const tacticalDetector = new TacticalDetector();
export default tacticalDetector;
