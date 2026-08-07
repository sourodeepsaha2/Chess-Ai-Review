import { Chess, Square } from 'chess.js';

export interface TacticalOpportunity {
  moveNumber: number;
  tactic: 'Missed Win' | 'Missed Mate' | 'Missed Fork' | 'Missed Skewer' | 'Missed Pin';
  severity: 'medium' | 'high' | 'critical';
}

/**
 * Checks if a piece on fromSquare is attacking toSquare in the current board state.
 */
/**
 * Checks if a piece on fromSquare is attacking toSquare in a given board state.
 * Swaps FEN turn color if checking off-turn attacks to generate valid moves.
 */
function isAttacking(fen: string, fromSquare: Square, toSquare: Square): boolean {
  try {
    const chess = new Chess(fen);
    const piece = chess.get(fromSquare);
    if (!piece) return false;

    if (chess.turn() !== piece.color) {
      const parts = fen.split(' ');
      parts[1] = piece.color;
      chess.load(parts.join(' '));
    }

    const moves = chess.moves({ square: fromSquare, verbose: true });
    return moves.some((m) => m.to === toSquare);
  } catch {
    return false;
  }
}

/**
 * Helper to determine if a move would be a fork.
 * A fork attacks two or more opponent pieces (excluding the King) simultaneously.
 */
function isForkMove(fenBefore: string, uciMove: string): boolean {
  try {
    const chess = new Chess(fenBefore);
    const fromSquare = uciMove.substring(0, 2) as Square;
    const toSquare = uciMove.substring(2, 4) as Square;

    const piece = chess.get(fromSquare);
    if (!piece) return false;

    // Simulate the move
    const promotion = uciMove.length === 5 ? uciMove[4] : undefined;
    chess.move({ from: fromSquare, to: toSquare, promotion });

    let attackCount = 0;
    const opponentColor = piece.color === 'w' ? 'b' : 'w';

    const squares: Square[] = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (let r = 1; r <= 8; r++) {
      for (const f of files) {
        squares.push(`${f}${r}` as Square);
      }
    }

    const nextFen = chess.fen();
    for (const sq of squares) {
      const target = chess.get(sq);
      if (target && target.color === opponentColor) {
        if (isAttacking(nextFen, toSquare, sq)) {
          attackCount++;
        }
      }
    }

    return attackCount >= 2;
  } catch {
    return false;
  }
}

/**
 * Helper to check if a move creates a pin.
 * An absolute pin occurs when an opponent piece cannot move because doing so exposes their King.
 */
function createsAbsolutePin(fenBefore: string, uciMove: string): boolean {
  try {
    const chess = new Chess(fenBefore);
    const fromSquare = uciMove.substring(0, 2) as Square;
    const toSquare = uciMove.substring(2, 4) as Square;

    const piece = chess.get(fromSquare);
    if (!piece) return false;

    // Simulate the move
    const promotion = uciMove.length === 5 ? uciMove[4] : undefined;
    chess.move({ from: fromSquare, to: toSquare, promotion });

    // The King must not be in check already before removing pinned candidates
    if (chess.inCheck()) {
      return false;
    }

    const opponentColor = piece.color === 'w' ? 'b' : 'w';

    const squares: Square[] = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (let r = 1; r <= 8; r++) {
      for (const f of files) {
        squares.push(`${f}${r}` as Square);
      }
    }

    for (const sq of squares) {
      const target = chess.get(sq);
      if (target && target.color === opponentColor && target.type !== 'k') {
        // If removing the opponent's piece puts their King in check, it is absolutely pinned
        const tempChess = new Chess(chess.fen());
        tempChess.remove(sq);

        if (tempChess.inCheck()) {
          return true;
        }
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Helper to check if a move creates a skewer.
 * A skewer is when a slider attacks a valuable piece which must move, exposing a less valuable piece.
 */
function createsSkewer(fenBefore: string, uciMove: string): boolean {
  try {
    const chess = new Chess(fenBefore);
    const fromSquare = uciMove.substring(0, 2) as Square;
    const toSquare = uciMove.substring(2, 4) as Square;

    const piece = chess.get(fromSquare);
    if (!piece || (piece.type !== 'q' && piece.type !== 'r' && piece.type !== 'b')) return false;

    // Simulate the move
    const promotion = uciMove.length === 5 ? uciMove[4] : undefined;
    chess.move({ from: fromSquare, to: toSquare, promotion });

    const opponentColor = piece.color === 'w' ? 'b' : 'w';

    const squares: Square[] = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (let r = 1; r <= 8; r++) {
      for (const f of files) {
        squares.push(`${f}${r}` as Square);
      }
    }

    const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 10 };
    const nextFen = chess.fen();

    for (const sqA of squares) {
      const targetA = chess.get(sqA);
      if (targetA && targetA.color === opponentColor && isAttacking(nextFen, toSquare, sqA)) {
        // Create a temporary board removing A to check line of sight
        const tempChess = new Chess(chess.fen());
        tempChess.remove(sqA);
        const tempFen = tempChess.fen();

        for (const sqB of squares) {
          if (sqB === sqA) continue;
          const targetB = tempChess.get(sqB);
          if (targetB && targetB.color === opponentColor && isAttacking(tempFen, toSquare, sqB)) {
            const valA = pieceValues[targetA.type] || 0;
            const valB = pieceValues[targetB.type] || 0;
            if (valA > valB) {
              return true;
            }
          }
        }
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Detects tactical opportunities that the player missed in a given move,
 * based on evaluation swings and board state calculations of the best move.
 */
export function detectTacticalOpportunity(
  moveNumber: number,
  fenBefore: string,
  playedMoveUci: string,
  bestMoveUci: string,
  playedEvaluation: number,
  bestEvaluation: number,
  turn: 'w' | 'b',
  centipawnLoss: number
): TacticalOpportunity | null {
  // If the player played the best move or didn't lose substantial material, skip
  if (playedMoveUci === bestMoveUci || centipawnLoss < 80) {
    return null;
  }

  const MATE_THRESHOLD = 90000;
  const isWhite = turn === 'w';

  // 1. Missed Mate: Best move leads to mate, but played move does not
  const bestIsMate = Math.abs(bestEvaluation) >= MATE_THRESHOLD;
  const playedIsMate = Math.abs(playedEvaluation) >= MATE_THRESHOLD;
  if (bestIsMate && !playedIsMate) {
    const isActiveSideMate = isWhite ? bestEvaluation > 0 : bestEvaluation < 0;
    if (isActiveSideMate) {
      return {
        moveNumber,
        tactic: 'Missed Mate',
        severity: 'critical',
      };
    }
  }

  // 2. Missed Win: Best move was winning (>=3.0 / <=-3.0), but played move drops evaluation below win threshold
  const bestIsWinning = isWhite ? bestEvaluation >= 3.0 : bestEvaluation <= -3.0;
  const playedIsWinning = isWhite ? playedEvaluation >= 1.5 : playedEvaluation <= -1.5;
  if (bestIsWinning && !playedIsWinning && centipawnLoss >= 150) {
    return {
      moveNumber,
      tactic: 'Missed Win',
      severity: 'high',
    };
  }

  // 3. Missed Fork
  if (isForkMove(fenBefore, bestMoveUci)) {
    return {
      moveNumber,
      tactic: 'Missed Fork',
      severity: 'medium',
    };
  }

  // 4. Missed Pin
  if (createsAbsolutePin(fenBefore, bestMoveUci)) {
    return {
      moveNumber,
      tactic: 'Missed Pin',
      severity: 'medium',
    };
  }

  // 5. Missed Skewer
  if (createsSkewer(fenBefore, bestMoveUci)) {
    return {
      moveNumber,
      tactic: 'Missed Skewer',
      severity: 'medium',
    };
  }

  return null;
}
export default detectTacticalOpportunity;
