import { OPENINGS_DB, OpeningDefinition } from './openingsDb';

export interface OpeningResult {
  eco: string;
  opening: string;
  variation: string;
}

export class OpeningService {
  /**
   * Detects the ECO code, opening name, and variation from a list of SAN algebraic moves.
   * Walks the moves list to find the longest matching prefix key inside OPENINGS_DB.
   * 
   * @param moves The algebraic SAN move strings played in the game, e.g. ["e4", "c5", "Nf3"]
   */
  public detectOpening(moves: string[]): OpeningResult {
    if (!moves || moves.length === 0) {
      return {
        eco: "A00",
        opening: "Start Position",
        variation: "",
      };
    }

    let longestMatch: OpeningDefinition | null = null;
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
        eco: longestMatch.eco,
        opening: longestMatch.name,
        variation: longestMatch.variation || "",
      };
    }

    return {
      eco: "A00",
      opening: "Custom/Unknown Opening",
      variation: "",
    };
  }
}

export const openingService = new OpeningService();
export default openingService;
