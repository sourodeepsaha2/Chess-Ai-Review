import { Chess } from 'chess.js';
import logger from '../utils/logger';
import { parserService } from './parser.service';
import { stockfishUCI } from './stockfish';
import { calculateCentipawnLoss } from './analysis/centipawnLoss';
import { classifyMove } from './analysis/classifier';
import { summaryService, SummaryResult } from './analysis/summary.service';

export interface JobState {
  id: string;
  status: 'loading' | 'analyzing' | 'success' | 'error';
  progress: number;
  currentMove: number;
  totalMoves: number;
  moves: any[];
  summary?: SummaryResult;
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

    // Extract starting position FEN (before the first move)
    let initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    try {
      const chessObj = new Chess();
      chessObj.loadPgn(pgn);
      const fenHeader = chessObj.header().FEN;
      if (fenHeader) {
        initialFen = fenHeader;
      }
    } catch (err: any) {
      logger.warn(`[AnalysisQueue] Failed to determine starting FEN header. Defaulting to standard: ${err.message}`);
    }

    // 2. Perform Stockfish analysis on the initial FEN position
    let initialEval = 0;
    try {
      const initialAnalysis = await stockfishUCI.analysePosition(initialFen);
      initialEval = initialAnalysis.evaluation;
    } catch (err: any) {
      logger.error(`[AnalysisQueue] Failed to analyze initial FEN [${initialFen}] for job ${job.id}: ${err.message}`);
    }

    const analyzedMoves: any[] = [];
    let currentBestEval = initialEval;

    for (let i = 0; i < total; i++) {
      const move = parsedGame.moves[i];
      job.currentMove = i + 1;
      
      // Calculate progress percentage (0-100)
      job.progress = Math.round((i / total) * 100);
      
      let evaluation = 0;
      let bestMove = '';
      let pv: string[] = [];

      try {
        // Send FEN position to Stockfish (after the move has been played)
        const analysis = await stockfishUCI.analysePosition(move.fenAfterMove);
        evaluation = analysis.evaluation;
        bestMove = analysis.bestMove;
        pv = analysis.pv;
      } catch (err: any) {
        logger.error(`[AnalysisQueue] Stockfish failed for FEN [${move.fenAfterMove}] in job ${job.id}: ${err.message}`);
      }

      // Calculate Centipawn Loss comparing pre-move vs post-move evaluations
      const cplResult = calculateCentipawnLoss(currentBestEval, evaluation, move.turn);

      // Determine mate opportunity parameters
      const MATE_THRESHOLD = 90000;
      const hadMateOpportunity = Math.abs(currentBestEval) >= MATE_THRESHOLD;
      const createdMateOpportunity = Math.abs(evaluation) >= MATE_THRESHOLD;

      // Perform move quality classification
      const classificationResult = classifyMove({
        centipawnLoss: cplResult.centipawnLoss,
        bestEvaluation: currentBestEval,
        playedEvaluation: evaluation,
        turn: move.turn,
        playedMoveUci: move.uci,
        bestMoveUci: bestMove,
        isForced: move.legalMovesCount === 1,
        hadMateOpportunity,
        createdMateOpportunity,
      });

      analyzedMoves.push({
        moveNumber: move.moveNumber,
        san: move.san,
        fen: move.fenAfterMove,
        fenAfterMove: move.fenAfterMove, // backwards compatibility
        turn: move.turn,                 // backwards compatibility
        evaluation,
        bestMove,
        principalVariation: pv,
        playedEvaluation: cplResult.playedEvaluation,
        bestEvaluation: cplResult.bestEvaluation,
        centipawnLoss: cplResult.centipawnLoss,
        classification: classificationResult,
      });

      // Update currentBestEval to the played evaluation for the next move's baseline
      currentBestEval = evaluation;
    }

    job.moves = analyzedMoves;
    job.summary = summaryService.calculateSummary(analyzedMoves);
    job.progress = 100;
    job.status = 'success';
    logger.info(`[AnalysisQueue] Job ${job.id} completed successfully`);
  }
}

export const analysisQueueService = new AnalysisQueueService();


