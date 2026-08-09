import { test } from 'node:test';
import assert from 'node:assert';
import { contextBuilder } from './ContextBuilder';

test('Context Builder Unit Tests', async (t) => {

  await t.test('Normal mistake mapping', () => {
    const input = {
      moveNumber: 15,
      turn: 'w' as const,
      san: 'Nf3',
      bestMove: 'e4',
      bestEvaluation: 150,
      playedEvaluation: 50,
      centipawnLoss: 100,
      classification: { classification: 'Mistake' },
      principalVariation: ['e4', 'e5'],
      fen: 'rnbq...',
    };

    const ctx = contextBuilder.buildContext(input);

    assert.strictEqual(ctx.moveNumber, 15);
    assert.strictEqual(ctx.player, 'white');
    assert.strictEqual(ctx.playedMove, 'Nf3');
    assert.strictEqual(ctx.bestMove, 'e4');
    assert.strictEqual(ctx.evaluationBefore, 150);
    assert.strictEqual(ctx.evaluationAfter, 50);
    assert.strictEqual(ctx.centipawnLoss, 100);
    assert.strictEqual(ctx.classification, 'Mistake');
    assert.deepStrictEqual(ctx.principalVariation, ['e4', 'e5']);
    assert.strictEqual(ctx.fen, 'rnbq...');
  });

  await t.test('Blunder mapping', () => {
    const input = {
      moveNumber: 22,
      turn: 'b' as const,
      san: 'Qxh2+',
      bestMove: 'd5',
      bestEvaluation: -100,
      playedEvaluation: 400, // Black blundered
      centipawnLoss: 500,
      classification: 'Blunder', // test string classification format
      principalVariation: ['d5', 'exd5'],
      fen: 'r3k2r...',
    };

    const ctx = contextBuilder.buildContext(input);

    assert.strictEqual(ctx.moveNumber, 22);
    assert.strictEqual(ctx.player, 'black');
    assert.strictEqual(ctx.playedMove, 'Qxh2+');
    assert.strictEqual(ctx.bestMove, 'd5');
    assert.strictEqual(ctx.evaluationBefore, -100);
    assert.strictEqual(ctx.evaluationAfter, 400);
    assert.strictEqual(ctx.centipawnLoss, 500);
    assert.strictEqual(ctx.classification, 'Blunder');
  });

  await t.test('Inaccuracy mapping', () => {
    const input = {
      moveNumber: 5,
      player: 'w' as const, // turn key not present, using player key instead
      san: 'a3',
      bestMove: 'd4',
      bestEvaluation: 40,
      playedEvaluation: 0,
      centipawnLoss: 40,
      classification: { classification: 'Inaccuracy' },
      principalVariation: [],
      fen: 'rnb...',
    };

    const ctx = contextBuilder.buildContext(input);

    assert.strictEqual(ctx.player, 'white');
    assert.strictEqual(ctx.classification, 'Inaccuracy');
    assert.strictEqual(ctx.centipawnLoss, 40);
  });

  await t.test('Missing evaluation handling', () => {
    const input = {
      moveNumber: 1,
      turn: 'w' as const,
      san: 'e4',
      bestMove: 'd4',
      bestEvaluation: undefined, // test missing/undefined evaluations
      playedEvaluation: null,
      centipawnLoss: undefined,
      classification: 'Best',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    };

    const ctx = contextBuilder.buildContext(input);

    assert.strictEqual(ctx.evaluationBefore, null);
    assert.strictEqual(ctx.evaluationAfter, null);
    assert.strictEqual(ctx.centipawnLoss, null);
    assert.strictEqual(ctx.playedMove, 'e4');
  });

  await t.test('Mate position mapping', () => {
    const input = {
      moveNumber: 35,
      turn: 'w' as const,
      san: 'Qxf7#',
      bestMove: 'Qxf7#',
      bestEvaluation: 99999, // Mate score
      playedEvaluation: 99999,
      centipawnLoss: 0,
      classification: 'Best',
      principalVariation: [],
      fen: '5rk1/...',
    };

    const ctx = contextBuilder.buildContext(input);

    assert.strictEqual(ctx.evaluationBefore, 99999);
    assert.strictEqual(ctx.evaluationAfter, 99999);
    assert.strictEqual(ctx.centipawnLoss, 0);
  });
});
