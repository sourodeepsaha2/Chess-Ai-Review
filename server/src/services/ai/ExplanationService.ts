import { ExplanationContext, ExplanationResult } from './types';

export interface IExplanationService {
  explainMove(context: ExplanationContext): Promise<ExplanationResult>;
}

export class MockExplanationService implements IExplanationService {
  /**
   * Generates a temporary mock explanation indicating that LLM integrations are coming in a future step.
   * Keeps calculations isolated from the engine pipelines.
   */
  public async explainMove(context: ExplanationContext): Promise<ExplanationResult> {
    const isLossy = (context.centipawnLoss || 0) > 0;
    
    return {
      summary: `[Mock AI Summary] Move ${context.moveNumber} (${context.playedMove}) played by ${context.player} is classified as a ${context.classification}.`,
      explanation: `[Mock AI Explanation] This is a temporary placeholder. In a future update, this explanation will analyze FEN [${context.fen}] to describe how ${context.playedMove} affects the board state compared to Stockfish's suggestion of ${context.bestMove}.`,
      betterMove: isLossy
        ? `[Mock AI Advice] Playing ${context.bestMove} would have been better, retaining a superior position. The recommended path was: ${context.principalVariation.slice(0, 3).join(' ')}.`
        : `[Mock AI Advice] You played the optimal recommended move ${context.bestMove}, maintaining the position.`,
      lesson: `[Mock AI Lesson] Focus on reducing tactical oversights. Keep an eye on centipawn loss (current loss: ${context.centipawnLoss !== null ? context.centipawnLoss : 0} CP).`,
    };
  }
}

export const explanationService = new MockExplanationService();
export default explanationService;
