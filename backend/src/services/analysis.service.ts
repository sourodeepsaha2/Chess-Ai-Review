import { parserService } from './parser.service';
import { stockfishUCI } from './stockfish';
import logger from '../utils/logger';

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
      const analyzedMoves: any[] = [];

      for (const move of parsedGame.moves) {
        let evaluation = 0;
        let bestMove = '';
        let pv: string[] = [];

        try {
          // Analyze position FEN immediately after this move was made
          const analysis = await stockfishUCI.analysePosition(move.fenAfterMove);
          evaluation = analysis.evaluation;
          bestMove = analysis.bestMove;
          pv = analysis.pv;
        } catch (err: any) {
          logger.error(`[AnalysisService] Stockfish failed for FEN [${move.fenAfterMove}]: ${err.message}`);
        }

        analyzedMoves.push({
          moveNumber: move.moveNumber,
          san: move.san,
          fen: move.fenAfterMove,
          fenAfterMove: move.fenAfterMove, // Backwards compatibility for UI
          turn: move.turn,                 // Backwards compatibility for UI
          evaluation,
          bestMove,
          principalVariation: pv,
        });
      }
      
      return {
        success: true,
        message: 'Game uploaded successfully',
        pgnProcessed: true,
        moveCount: parsedGame.moveCount,
        moves: analyzedMoves,
      };
    }

    throw new Error('Analysis Service Error: Neither test flag nor PGN was provided.');
  }
}

export const analysisService = new AnalysisService();


