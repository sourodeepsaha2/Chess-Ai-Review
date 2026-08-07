import { calculateAccuracy } from './accuracy';
import { openingService } from '../opening/OpeningService';

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
  whiteAccuracy?: number;
  blackAccuracy?: number;
  openingName?: string;
  ecoCode?: string;
  openingVariation?: string;
  // Open index signature for future extension (e.g. opening theory)
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
        whiteAccuracy: 100,
        blackAccuracy: 100,
        openingName: "Start Position",
        ecoCode: "A00",
        openingVariation: "",
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
    
    // Calculate player accuracies based on CPL & Classifications
    const accuracy = calculateAccuracy(moves);

    // Detect opening name and ECO code from SAN sequences
    const sanMoves = moves.map((m) => m.san || "");
    const opening = openingService.detectOpening(sanMoves);

    return {
      totalMoves,
      averageCentipawnLoss,
      classificationCounts,
      whiteAccuracy: accuracy.whiteAccuracy,
      blackAccuracy: accuracy.blackAccuracy,
      openingName: opening.opening,
      ecoCode: opening.eco,
      openingVariation: opening.variation,
    };
  }
}

export const summaryService = new SummaryService();
export default summaryService;


