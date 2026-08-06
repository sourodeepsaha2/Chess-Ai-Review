import logger from '../utils/logger';
import { parserService } from './parser.service';
import { stockfishUCI } from './stockfish';

export interface JobState {
  id: string;
  status: 'loading' | 'analyzing' | 'success' | 'error';
  progress: number;
  currentMove: number;
  totalMoves: number;
  moves: any[];
  error: string | null;
  timestamp: number;
}

export class AnalysisQueueService {
  private jobs: Map<string, JobState> = new Map();
  private queue: { jobId: string; pgn: string }[] = [];
  private isProcessing: boolean = false;

  /**
   * Creates an analysis job, enqueues it, and immediately returns the job ID.
   */
  public createJob(pgn: string): string {
    const jobId = 'job_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    
    const job: JobState = {
      id: jobId,
      status: 'loading',
      progress: 0,
      currentMove: 0,
      totalMoves: 0,
      moves: [],
      error: null,
      timestamp: Date.now(),
    };

    this.jobs.set(jobId, job);
    this.queue.push({ jobId, pgn });
    
    // Trigger background queue execution
    this.processQueue();

    return jobId;
  }

  /**
   * Retrieves the current state of a job.
   */
  public getJob(id: string): JobState | undefined {
    return this.jobs.get(id);
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) continue;

      const job = this.jobs.get(task.jobId);
      if (!job) continue;

      try {
        await this.runJob(job, task.pgn);
      } catch (err: any) {
        logger.error(`[AnalysisQueue] Job ${job.id} failed: ${err.message}`);
        job.status = 'error';
        job.error = err.message || 'Unknown queue analysis failure.';
      }
    }

    this.isProcessing = false;
  }

  private async runJob(job: JobState, pgn: string): Promise<void> {
    logger.info(`[AnalysisQueue] Executing analysis job: ${job.id}`);
    
    // 1. Parse PGN using ParserService
    let parsedGame;
    try {
      parsedGame = parserService.parsePgn(pgn);
    } catch (err: any) {
      job.status = 'error';
      job.error = err.message || 'PGN parser failed.';
      logger.warn(`[AnalysisQueue] PGN parse failed for job ${job.id}: ${err.message}`);
      return;
    }

    const total = parsedGame.moves.length;
    job.totalMoves = total;
    job.status = 'analyzing';
    job.progress = 0;
    
    if (total === 0) {
      job.status = 'success';
      job.progress = 100;
      return;
    }

    const analyzedMoves: any[] = [];

    for (let i = 0; i < total; i++) {
      const move = parsedGame.moves[i];
      job.currentMove = i + 1;
      
      // Calculate progress percentage (0-100)
      job.progress = Math.round((i / total) * 100);
      
      let evaluation = 0;
      let bestMove = '';
      let pv: string[] = [];

      try {
        // Send FEN position to Stockfish
        const analysis = await stockfishUCI.analysePosition(move.fenAfterMove);
        evaluation = analysis.evaluation;
        bestMove = analysis.bestMove;
        pv = analysis.pv;
      } catch (err: any) {
        logger.error(`[AnalysisQueue] Stockfish failed for FEN [${move.fenAfterMove}] in job ${job.id}: ${err.message}`);
      }

      analyzedMoves.push({
        moveNumber: move.moveNumber,
        san: move.san,
        fen: move.fenAfterMove,
        fenAfterMove: move.fenAfterMove, // backwards compatibility
        turn: move.turn,                 // backwards compatibility
        evaluation,
        bestMove,
        principalVariation: pv,
      });
    }

    job.moves = analyzedMoves;
    job.progress = 100;
    job.status = 'success';
    logger.info(`[AnalysisQueue] Job ${job.id} completed successfully`);
  }
}

export const analysisQueueService = new AnalysisQueueService();
