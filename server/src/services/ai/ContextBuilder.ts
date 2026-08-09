import { ExplanationContext } from './types';

export interface AnalyzedMoveInput {
  moveNumber: number;
  turn?: 'w' | 'b';
  player?: 'w' | 'b' | 'white' | 'black';
  san: string;
  bestMove: string;
  bestEvaluation?: number | null;
  playedEvaluation?: number | null;
  evaluation?: number | null;
  centipawnLoss?: number | null;
  classification: string | { classification: string };
  principalVariation?: string[];
  fen: string;
}

export class ContextBuilder {
  /**
   * Translates an analyzed engine move into a clean AI ExplanationContext block.
   * Handles missing values, mate scores, and perspective normalization safely.
   */
  public buildContext(input: AnalyzedMoveInput): ExplanationContext {
    // 1. Normalize Player turn
    let player: 'white' | 'black' = 'white';
    const turnVal = input.turn || input.player;
    if (turnVal) {
      const turnLower = turnVal.toLowerCase();
      if (turnLower === 'b' || turnLower === 'black') {
        player = 'black';
      }
    }

    // 2. Extract classification string
    let classification = 'Good';
    if (input.classification) {
      if (typeof input.classification === 'string') {
        classification = input.classification;
      } else if (typeof input.classification.classification === 'string') {
        classification = input.classification.classification;
      }
    }

    // 3. Extract evaluations safely checking for NaN
    const bestEval = input.bestEvaluation !== undefined && input.bestEvaluation !== null
      ? input.bestEvaluation
      : null;

    const playedEval = input.playedEvaluation !== undefined && input.playedEvaluation !== null
      ? input.playedEvaluation
      : (input.evaluation !== undefined && input.evaluation !== null ? input.evaluation : null);

    const evaluationBefore = (bestEval !== null && !isNaN(bestEval)) ? bestEval : null;
    const evaluationAfter = (playedEval !== null && !isNaN(playedEval)) ? playedEval : null;

    // 4. Extract CPL safely
    const centipawnLoss = (input.centipawnLoss !== undefined && input.centipawnLoss !== null && !isNaN(input.centipawnLoss))
      ? input.centipawnLoss
      : null;

    return {
      moveNumber: input.moveNumber,
      player,
      playedMove: input.san || '',
      bestMove: input.bestMove || '',
      evaluationBefore,
      evaluationAfter,
      centipawnLoss,
      classification,
      principalVariation: input.principalVariation || [],
      fen: input.fen || '',
    };
  }
}

export const contextBuilder = new ContextBuilder();
export default contextBuilder;
