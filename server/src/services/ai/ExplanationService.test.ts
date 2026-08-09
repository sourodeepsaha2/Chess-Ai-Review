import { test } from 'node:test';
import assert from 'node:assert';
import { explanationService } from './ExplanationService';
import { generateMoveExplanationPrompt } from './prompts/moveExplanation';

test('AI Explanation Service Unit Tests', async (t) => {

  const dummyContext = {
    moveNumber: 12,
    player: 'white' as const,
    playedMove: 'd2d4',
    bestMove: 'e2e4',
    evaluationBefore: 120,
    evaluationAfter: -10,
    centipawnLoss: 130,
    classification: 'Mistake',
    principalVariation: ['e2e4', 'e7e5', 'g1f3'],
    fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
  };

  await t.test('generateMoveExplanationPrompt returns expected text', () => {
    const prompt = generateMoveExplanationPrompt(dummyContext);
    assert.ok(prompt.includes('Mistake'));
    assert.ok(prompt.includes('d2d4'));
    assert.ok(prompt.includes('e2e4'));
  });

  await t.test('explainMove returns expected mock structure and headers', async () => {
    const result = await explanationService.explainMove(dummyContext);
    
    assert.strictEqual(typeof result.summary, 'string');
    assert.strictEqual(typeof result.explanation, 'string');
    assert.strictEqual(typeof result.betterMove, 'string');
    assert.strictEqual(typeof result.lesson, 'string');

    // Confirm that the values clearly indicate they are mocks
    assert.ok(result.summary.includes('[Mock AI'));
    assert.ok(result.explanation.includes('[Mock AI'));
    assert.ok(result.betterMove.includes('[Mock AI'));
    assert.ok(result.lesson.includes('[Mock AI'));
  });
});
