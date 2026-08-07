import { AnalysisReport } from './AnalysisReport';
import { MoveAnalysis } from './MoveAnalysis';
import { Summary } from './Summary';
import { JobState } from '../../services/analysisQueue.service';

export class AnalysisReportMapper {
  /**
   * Transforms raw background worker job states and evaluations into a unified domain AnalysisReport.
   * 
   * @param job The background worker JobState
   * @param durationMs Execution duration in milliseconds
   */
  public static toDomain(job: JobState, durationMs: number): AnalysisReport {
    const totalMoves = job.totalMoves;
    const moves = job.moves || [];

    // 1. Map raw moves array into strongly typed MoveAnalysis instances
    const analyzedMoves = moves.map((move) => {
      return new MoveAnalysis(
        move.moveNumber,
        move.turn, // 'w' or 'b'
        move.san,
        move.fen, // FEN after move
        move.evaluation,
        move.bestMove,
        move.principalVariation || [],
        move.centipawnLoss,
        {
          classification: move.classification.classification,
          color: move.classification.color,
          icon: move.classification.icon,
        }
      );
    });

    // 2. Compute final board evaluation (or default to 0 if no moves were played)
    const overallEvaluation = analyzedMoves.length > 0
      ? analyzedMoves[analyzedMoves.length - 1].evaluation
      : 0;

    // 3. Construct the Summary domain entity
    const summary = new Summary(
      job.summary?.averageCentipawnLoss || 0,
      job.summary?.classificationCounts || {},
      overallEvaluation
    );

    return new AnalysisReport(
      totalMoves,
      analyzedMoves,
      durationMs,
      summary
    );
  }
}
export default AnalysisReportMapper;
