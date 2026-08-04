import { Chess } from 'chess.js';

export interface ParsedMove {
  moveNumber: number;
  san: string;
  fenAfterMove: string;
  turn: 'w' | 'b';
}

export interface ParsedGame {
  moveCount: number;
  moves: ParsedMove[];
}

export class ParserService {
  /**
   * Loads a PGN string, validates its format, and replays each move
   * to construct FEN positions, move numbers, and algebraic SAN strings.
   */
  parsePgn(pgn: string): ParsedGame {
    const chess = new Chess();
    
    try {
      // Load target PGN history (throws error on syntax anomalies)
      chess.loadPgn(pgn);
    } catch (err: any) {
      throw new Error(`PGN Parsing Failure: ${err.message || err}`);
    }


    // Get move list details from loaded game
    const moveHistory = chess.history({ verbose: true });
    
    // Create new Board instance to replay moves sequentially to generate accurate FENs
    const replayChess = new Chess();
    const parsedMoves: ParsedMove[] = [];

    for (let i = 0; i < moveHistory.length; i++) {
      const moveObj = moveHistory[i];

      try {
        replayChess.move({
          from: moveObj.from,
          to: moveObj.to,
          promotion: moveObj.promotion,
        });
      } catch (err: any) {
        throw new Error(`PGN Replay Error at move index ${i} (${moveObj.san}): ${err.message}`);
      }

      // Calculate move index: e.g. 1st ply = move 1 (w), 2nd ply = move 1 (b), 3rd ply = move 2 (w)...
      const moveNumber = Math.floor(i / 2) + 1;

      parsedMoves.push({
        moveNumber,
        san: moveObj.san,
        fenAfterMove: replayChess.fen(),
        turn: moveObj.color,
      });
    }

    return {
      moveCount: parsedMoves.length,
      moves: parsedMoves,
    };
  }
}

export const parserService = new ParserService();
