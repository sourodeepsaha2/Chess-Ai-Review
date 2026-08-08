export type TacticType = 'MISSED_MATE' | 'MISSED_WIN' | 'EVAL_SWING';
export type TacticSeverity = 'high' | 'medium' | 'low';

export interface TacticalOpportunity {
  moveNumber: number;
  player: 'white' | 'black';
  type: TacticType;
  severity: TacticSeverity;
  bestMove: string;
  evaluationBefore: number;
  evaluationAfter: number;
}
