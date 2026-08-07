import { MoveAnalysis } from './MoveAnalysis';
import { Summary } from './Summary';

export class AnalysisReport {
  constructor(
    public readonly totalMoves: number,
    public readonly analyzedMoves: MoveAnalysis[],
    public readonly analysisDuration: number,
    public readonly summary: Summary
  ) {}
}
export default AnalysisReport;
