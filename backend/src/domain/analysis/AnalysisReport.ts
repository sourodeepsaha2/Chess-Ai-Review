import { MoveAnalysis } from './MoveAnalysis';
import { Summary } from './Summary';

export interface GameOpening {
  eco: string | null;
  name: string | null;
  variation: string | null;
}

export interface GameInfo {
  opening: GameOpening;
}

export class AnalysisReport {
  constructor(
    public readonly totalMoves: number,
    public readonly analyzedMoves: MoveAnalysis[],
    public readonly analysisDuration: number,
    public readonly summary: Summary,
    public readonly game?: GameInfo
  ) {}
}
export default AnalysisReport;
