import { ClassificationResult } from './types';

export interface TacticalOpportunity {
  moveNumber: number;
  tactic: 'Missed Win' | 'Missed Mate' | 'Missed Fork' | 'Missed Skewer' | 'Missed Pin';
  severity: 'medium' | 'high' | 'critical';
}

export class MoveAnalysis {
  constructor(
    public readonly moveNumber: number,
    public readonly player: 'w' | 'b',
    public readonly san: string,
    public readonly fen: string,
    public readonly evaluation: number,
    public readonly bestMove: string,
    public readonly principalVariation: string[],
    public readonly centipawnLoss: number,
    public readonly classification: ClassificationResult,
    public readonly tactic?: TacticalOpportunity
  ) {}
}
export default MoveAnalysis;

