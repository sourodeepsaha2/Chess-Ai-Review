import { StockfishEngine } from './Engine';
import type { StockfishAnalysisResult } from './types';
import logger from '../../utils/logger';

class StockfishQueue {
  private queue: Promise<any> = Promise.resolve();

  /**
   * Enqueues an asynchronous Stockfish command task for sequential execution.
   */
  public enqueue<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task);
    this.queue = result.catch(() => {}); // prevent command errors from halting queue
    return result;
  }
}

export class StockfishUCI {
  private engine: StockfishEngine;
  private commandQueue: StockfishQueue;
  private activeReject: ((err: Error) => void) | null = null;
  private defaultDepth: number;

  constructor() {
    this.engine = StockfishEngine.getInstance();
    this.commandQueue = new StockfishQueue();
    this.defaultDepth = parseInt(process.env.DEFAULT_DEPTH || '12', 10);

    // Register process exit listener to catch engine crashes during active commands
    this.engine.onExit(() => {
      if (this.activeReject) {
        this.activeReject(new Error('Stockfish process terminated unexpectedly during command execution.'));
        this.activeReject = null;
      }
    });
  }

  /**
   * Requests Stockfish analysis for a specific FEN position.
   */
  public async analysePosition(fen: string, depth?: number): Promise<StockfishAnalysisResult> {
    const searchDepth = depth && depth > 0 ? depth : this.defaultDepth;

    return this.commandQueue.enqueue(async () => {
      // 1. Ensure engine process is running
      await this.engine.start();

      // 2. Wait for ready acknowledgement
      await this.waitForReady();

      // 3. Initiate FEN position and start search
      return new Promise<StockfishAnalysisResult>((resolve, reject) => {
        this.activeReject = reject;

        let lastDepth = 0;
        let lastEvaluation = 0;
        let lastPv: string[] = [];

        // Parse side-to-move to normalize scores to White's perspective
        const parts = fen.trim().split(/\s+/);
        const activeColor = parts[1] || 'w';
        const isWhite = activeColor === 'w';

        const unsubscribe = this.engine.onStdout((line) => {
          // Parse info updates
          if (line.startsWith('info ')) {
            // Depth check
            const depthMatch = line.match(/\bdepth\s+(\d+)\b/);
            if (depthMatch) {
              lastDepth = parseInt(depthMatch[1], 10);
            }

            // Score check (centipawns or mate)
            const scoreCpMatch = line.match(/\bscore\s+cp\s+(-?\d+)\b/);
            const scoreMateMatch = line.match(/\bscore\s+mate\s+(-?\d+)\b/);

            if (scoreCpMatch) {
              const relativeScore = parseInt(scoreCpMatch[1], 10);
              lastEvaluation = isWhite ? relativeScore : -relativeScore;
            } else if (scoreMateMatch) {
              const relativeMate = parseInt(scoreMateMatch[1], 10);
              // Encode mate in N as high/low evaluations depending on turn
              const mateScore = relativeMate > 0 ? 100000 - relativeMate : -100000 - relativeMate;
              lastEvaluation = isWhite ? mateScore : -mateScore;
            }

            // Principal Variation check
            const pvMatch = line.match(/\bpv\s+(.+)$/);
            if (pvMatch) {
              lastPv = pvMatch[1].trim().split(/\s+/);
            }
          }

          // Complete analysis trigger
          if (line.startsWith('bestmove ')) {
            const bestMoveMatch = line.match(/^bestmove\s+(\S+)/);
            let bestMove = bestMoveMatch ? bestMoveMatch[1] : '';
            if (bestMove === '(none)') {
              bestMove = '';
            }

            unsubscribe();
            this.activeReject = null;

            resolve({
              evaluation: lastEvaluation,
              bestMove,
              pv: lastPv,
              depth: lastDepth || searchDepth,
            });
          }
        });

        try {
          this.engine.write(`position fen ${fen}`);
          this.engine.write(`go depth ${searchDepth}`);
        } catch (err) {
          unsubscribe();
          this.activeReject = null;
          reject(err);
        }
      });
    });
  }

  /**
   * Helper that blocks until 'readyok' is returned by the engine.
   */
  private async waitForReady(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.activeReject = reject;

      const unsubscribe = this.engine.onStdout((line) => {
        if (line === 'readyok') {
          unsubscribe();
          this.activeReject = null;
          resolve();
        }
      });

      try {
        this.engine.write('isready');
      } catch (err) {
        unsubscribe();
        this.activeReject = null;
        reject(err);
      }
    });
  }
}

export const stockfishUCI = new StockfishUCI();
