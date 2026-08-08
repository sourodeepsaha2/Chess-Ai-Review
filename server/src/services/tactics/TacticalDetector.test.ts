import { test } from 'node:test';
import assert from 'node:assert';
import { tacticalDetector } from './TacticalDetector';

test('Tactical Detector Unit Tests', async (t) => {

  await t.test('Missed Mate (White mate in 1 -> drawish)', () => {
    // White had a forced mate sequence (e.g. +99999), but blundered it into equal (0)
    const result = tacticalDetector.detectOpportunity(
      5,
      'w',
      'b1b8',
      99999,
      0
    );

    assert.ok(result);
    assert.strictEqual(result.type, 'MISSED_MATE');
    assert.strictEqual(result.severity, 'high');
    assert.strictEqual(result.player, 'white');
  });

  await t.test('Missed Win (Black completely winning -> drawish)', () => {
    // Black had a completely winning position (e.g. -450 CP), but dropped to equal (0)
    const result = tacticalDetector.detectOpportunity(
      10,
      'b',
      'd5c3',
      -450,
      0
    );

    assert.ok(result);
    assert.strictEqual(result.type, 'MISSED_WIN');
    assert.strictEqual(result.severity, 'high');
    assert.strictEqual(result.player, 'black');
  });

  await t.test('Large Evaluation Swing (White blunders 2.50 CP, not winning before)', () => {
    // White went from +50 CP to -200 CP (CPL = 250 CP)
    const result = tacticalDetector.detectOpportunity(
      15,
      'w',
      'e2e4',
      50,
      -200
    );

    assert.ok(result);
    assert.strictEqual(result.type, 'EVAL_SWING');
    assert.strictEqual(result.severity, 'medium');
  });

  await t.test('Normal Positional Move (White plays best recommended move, CPL = 0)', () => {
    const result = tacticalDetector.detectOpportunity(
      20,
      'w',
      'g1f3',
      40,
      40
    );

    assert.strictEqual(result, null);
  });

  await t.test('Normal Positional Move (Small loss, CPL = 20)', () => {
    const result = tacticalDetector.detectOpportunity(
      22,
      'w',
      'g1f3',
      40,
      20
    );

    assert.strictEqual(result, null);
  });

  await t.test('Mate Score Handling (White had mate in 3, played move kept mate in 5)', () => {
    // White kept the mate (both evaluations above mate threshold 90000)
    const result = tacticalDetector.detectOpportunity(
      25,
      'w',
      'f3f7',
      99997,
      99995
    );

    assert.strictEqual(result, null);
  });
});
