import { ExplanationContext } from '../types';

/**
 * Generates a system prompt mapping the current move context into an instruction string for tutor models.
 */
export function generateMoveExplanationPrompt(context: ExplanationContext): string {
  const scoreBefore = context.evaluationBefore !== null ? (context.evaluationBefore / 100).toFixed(2) : 'N/A';
  const scoreAfter = context.evaluationAfter !== null ? (context.evaluationAfter / 100).toFixed(2) : 'N/A';
  
  return `You are a chess grandmaster and tutor. Analyze the following chess position and explain the move.

Move Info:
- Move Number: ${context.moveNumber}
- Player: ${context.player}
- Played Move: ${context.playedMove}
- Engine's Recommended Best Move: ${context.bestMove}
- Position FEN: ${context.fen}
- Move Classification: ${context.classification}
- Centipawn Loss: ${context.centipawnLoss !== null ? context.centipawnLoss : 'N/A'}
- Evaluation Before: ${scoreBefore}
- Evaluation After: ${scoreAfter}
- Best Line Continuation (PV): ${context.principalVariation.join(' ')}

Provide a structured response containing:
1. Summary: A 1-sentence description of what happened.
2. Explanation: A detailed explanation of why the played move is classified as ${context.classification}, highlighting the tactical or positional themes.
3. Better Move: Why the best move (${context.bestMove}) is superior in this position.
4. Lesson: A key takeaway/lesson for the player to improve their game in similar positions.`;
}
