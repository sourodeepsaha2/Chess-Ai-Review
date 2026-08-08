export interface TacticalOpportunity {
  moveNumber: number;
  player: 'white' | 'black';
  type: 'MISSED_MATE' | 'MISSED_WIN' | 'EVAL_SWING';
  severity: 'high' | 'medium' | 'low';
  bestMove: string;
  evaluationBefore: number;
  evaluationAfter: number;
}

export interface ParsedMove {
  moveNumber: number;
  san: string;
  fen: string;
  fenAfterMove?: string;
  turn?: 'w' | 'b';
  evaluation?: number;
  bestMove?: string;
  principalVariation?: string[];
  playedEvaluation?: number;
  bestEvaluation?: number;
  centipawnLoss?: number;
  classification?: {
    classification: string;
    color: string;
    icon: string;
  };
  tactic?: TacticalOpportunity;
}


