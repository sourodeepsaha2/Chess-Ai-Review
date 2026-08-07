export interface SummaryResult {
  totalMoves: number;
  averageCentipawnLoss: number;
  classificationCounts: {
    Brilliant: number;
    Great: number;
    Best: number;
    Excellent: number;
    Good: number;
    Inaccuracy: number;
    Mistake: number;
    Blunder: number;
  };
  // Open index signature for future extension (e.g. accuracy, opening theory)
  [key: string]: any;
}

export class SummaryService {
  /**
   * Computes aggregate game statistics over all analyzed moves.
   */
  public calculateSummary(moves: any[]): SummaryResult {
    const totalMoves = moves.length;
    let totalCpl = 0;

    const classificationCounts = {
      Brilliant: 0,
      Great: 0,
      Best: 0,
      Excellent: 0,
      Good: 0,
      Inaccuracy: 0,
      Mistake: 0,
      Blunder: 0,
    };

    if (totalMoves === 0) {
      return {
        totalMoves: 0,
        averageCentipawnLoss: 0,
        classificationCounts,
      };
    }

    moves.forEach((move) => {
      // Aggregate centipawn loss
      totalCpl += move.centipawnLoss || 0;

      // Increment classification count
      const label = move.classification?.classification as keyof typeof classificationCounts;
      if (label && classificationCounts[label] !== undefined) {
        classificationCounts[label]++;
      }
    });

    const averageCentipawnLoss = Math.round((totalCpl / totalMoves) * 10) / 10; // 1 decimal precision

    return {
      totalMoves,
      averageCentipawnLoss,
      classificationCounts,
    };
  }
}

export const summaryService = new SummaryService();
export default summaryService;
