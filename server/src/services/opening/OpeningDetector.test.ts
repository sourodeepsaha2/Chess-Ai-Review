import { test } from 'node:test';
import assert from 'node:assert';
import { openingDetector } from './OpeningDetector';

test('Opening Detector Unit Tests', async (t) => {

  await t.test('Italian Game: Giuoco Piano detection (e4 e5 Nf3 Nc6 Bc4 Bc5)', () => {
    const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'];
    const result = openingDetector.detectOpening(moves);
    assert.strictEqual(result.eco, 'C50');
    assert.strictEqual(result.opening, 'Italian Game');
    assert.strictEqual(result.variation, 'Giuoco Piano');
  });

  await t.test('Sicilian Defense detection (e4 c5)', () => {
    const moves = ['e4', 'c5', 'Nf3', 'd6'];
    const result = openingDetector.detectOpening(moves);
    // Should match e4 c5 Nf3 (Open Sicilian) or e4 c5 (Sicilian Defense)
    assert.strictEqual(result.eco, 'B27');
    assert.strictEqual(result.opening, 'Sicilian Defense');
    assert.strictEqual(result.variation, 'Open Sicilian');
  });

  await t.test('Queen\'s Gambit detection (d4 d5 c4)', () => {
    const moves = ['d4', 'd5', 'c4'];
    const result = openingDetector.detectOpening(moves);
    assert.strictEqual(result.eco, 'D06');
    assert.strictEqual(result.opening, 'Queen\'s Gambit');
    assert.strictEqual(result.variation, null);
  });

  await t.test('Unknown/custom sequence should return null values gracefully', () => {
    const moves = ['h4', 'a6', 'g4', 'b5'];
    const result = openingDetector.detectOpening(moves);
    assert.strictEqual(result.eco, null);
    assert.strictEqual(result.opening, null);
    assert.strictEqual(result.variation, null);
  });

  await t.test('Empty game or non-matching moves should return null values gracefully', () => {
    const result = openingDetector.detectOpening([]);
    assert.strictEqual(result.eco, null);
    assert.strictEqual(result.opening, null);
    assert.strictEqual(result.variation, null);
  });
});
