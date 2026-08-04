import { parserService } from './parser.service';

export interface AnalysisRequest {
  test?: boolean;
  pgn?: string;
}

export interface AnalysisResult {
  success: boolean;
  message: string;
  pgnProcessed?: boolean;
  moveCount?: number;
  moves?: any[];
}

export class AnalysisService {
  /**
   * Run chess board/PGN analysis or test connectivity checks.
   * Isolates Express HTTP layer from core business logic.
   */
  async runAnalysis(data: AnalysisRequest): Promise<AnalysisResult> {
    if (data.test) {
      return {
        success: true,
        message: 'Backend connected successfully',
      };
    }

    if (data.pgn) {
      const parsedGame = parserService.parsePgn(data.pgn);
      
      return {
        success: true,
        message: 'Game uploaded successfully',
        pgnProcessed: true,
        moveCount: parsedGame.moveCount,
        moves: parsedGame.moves,
      };
    }

    throw new Error('Analysis Service Error: Neither test flag nor PGN was provided.');
  }
}

export const analysisService = new AnalysisService();

