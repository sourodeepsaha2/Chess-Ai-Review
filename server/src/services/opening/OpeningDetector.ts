import { OPENINGS_DB } from './OpeningDatabase';
import { OpeningResult } from './types';

export class OpeningDetector {
  /**
   * Detects the ECO code, opening name, and variation from a list of SAN algebraic moves.
   * Walks the moves list to find the longest matching prefix key inside OPENINGS_DB.
   * 
   * @param moves The algebraic SAN move strings played in the game, e.g. ["e4", "c5", "Nf3"]
   */
  public detectOpening(moves: string[]): OpeningResult {
    if (!Array.isArray(moves) || moves.length === 0) {
      return {
        eco: null,
        opening: null,
        variation: null,
      };
    }

    let longestMatch: any = null;
    let currentSequence = "";

    // Limit searching up to the first 16 plies (8 moves) for performance and standard theory bounds
    const searchLimit = Math.min(moves.length, 16);

    for (let i = 0; i < searchLimit; i++) {
      currentSequence = currentSequence
        ? `${currentSequence} ${moves[i]}`
        : moves[i];

      const match = OPENINGS_DB[currentSequence];
      if (match) {
        longestMatch = match;
      }
    }

    if (longestMatch) {
      return {
        eco: longestMatch.eco || null,
        opening: longestMatch.name || null,
        variation: longestMatch.variation || null,
      };
    }

    return {
      eco: null,
      opening: null,
      variation: null,
    };
  }
}

export const openingDetector = new OpeningDetector();
export default openingDetector;
