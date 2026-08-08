import { test } from 'node:test';
import assert from 'node:assert';
import { calculateAccuracy } from './accuracy';

test('Accuracy Calculator Unit Tests', async (t) => {

  await t.test('Perfect play / zero CPL should return 100% accuracy', () => {
    const moves = [
      { turn: 'w', centipawnLoss: 0, classification: { classification: 'Best' } },
      { turn: 'b', centipawnLoss: 0, classification: { classification: 'Best' } },
      { turn: 'w', centipawnLoss: 0, classification: { classification: 'Brilliant' } },
      { turn: 'b', centipawnLoss: 0, classification: { classification: 'Great' } },
    ];

    const result = calculateAccuracy(moves);
    assert.strictEqual(result.whiteAccuracy, 100);
    assert.strictEqual(result.blackAccuracy, 100);
  });

  await t.test('Small mistakes should reduce accuracy slightly', () => {
    const moves = [
      // White CPL = 20 (Excellent). e^(-0.004 * 20) = 92.3% CPL, Excellent weight = 95% -> avg 93.65%
      { turn: 'w', centipawnLoss: 20, classification: { classification: 'Excellent' } },
      // Black CPL = 50 (Good). e^(-0.004 * 50) = 81.87% CPL, Good weight = 80% -> avg 80.9%
      { turn: 'b', centipawnLoss: 50, classification: { classification: 'Good' } },
    ];

    const result = calculateAccuracy(moves);
    assert.ok(result.whiteAccuracy < 100 && result.whiteAccuracy > 90);
    assert.ok(result.blackAccuracy < 90 && result.blackAccuracy > 75);
  });

  await t.test('Large mistakes should penalize accuracy heavily', () => {
    const moves = [
      // White CPL = 150 (Mistake). e^(-0.004 * 150) = 54.88% CPL, Mistake weight = 20% -> avg 37.4%
      { turn: 'w', centipawnLoss: 150, classification: { classification: 'Mistake' } },
      // Black CPL = 350 (Blunder). e^(-0.004 * 350) = 24.6% CPL, Blunder caps at 20% -> 20.0%
      { turn: 'b', centipawnLoss: 350, classification: { classification: 'Blunder' } },
    ];

    const result = calculateAccuracy(moves);
    assert.ok(result.whiteAccuracy < 45 && result.whiteAccuracy > 30);
    assert.strictEqual(result.blackAccuracy, 20); // Blunder cap forces exactly 20.0% or less
  });

  await t.test('Multiple mistakes should calculate correct average', () => {
    const moves = [
      { turn: 'w', centipawnLoss: 20, classification: { classification: 'Excellent' } }, // ~93.6%
      { turn: 'w', centipawnLoss: 150, classification: { classification: 'Mistake' } }, // ~37.4%
    ];

    const result = calculateAccuracy(moves);
    // Average should be around (93.6 + 37.4) / 2 = 65.5%
    assert.ok(result.whiteAccuracy < 70 && result.whiteAccuracy > 60);
    assert.strictEqual(result.blackAccuracy, 100); // Defaults to 100 for no moves
  });

  await t.test('Different numbers of moves for each player should be handled correctly', () => {
    const moves = [
      { turn: 'w', centipawnLoss: 0, classification: { classification: 'Best' } },
      { turn: 'b', centipawnLoss: 200, classification: { classification: 'Blunder' } }, // Blunder cap -> 20%
      { turn: 'w', centipawnLoss: 0, classification: { classification: 'Best' } },
    ];

    const result = calculateAccuracy(moves);
    assert.strictEqual(result.whiteAccuracy, 100); // Two perfect moves
    assert.strictEqual(result.blackAccuracy, 20); // One blunder
  });

  await t.test('Mate positions should be computed safely without NaN', () => {
    const moves = [
      // Blunder mate for the opponent (CPL = 99800)
      { turn: 'w', centipawnLoss: 99800, classification: { classification: 'Blunder' } },
      // Forced mate played correctly (CPL = 0)
      { turn: 'b', centipawnLoss: 0, classification: { classification: 'Best' } },
    ];

    const result = calculateAccuracy(moves);
    // Blunder cap sets White accuracy to 20% or less, e^(-0.004 * 99800) approaches 0 -> 0%
    assert.strictEqual(result.whiteAccuracy, 0); 
    assert.strictEqual(result.blackAccuracy, 100);
  });

  await t.test('Empty game / few moves should default safely to 100% accuracy', () => {
    const result = calculateAccuracy([]);
    assert.strictEqual(result.whiteAccuracy, 100);
    assert.strictEqual(result.blackAccuracy, 100);
  });
});
