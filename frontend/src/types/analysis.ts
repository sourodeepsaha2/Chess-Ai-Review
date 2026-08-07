export interface TacticalOpportunity {
  moveNumber: number;
  tactic: 'Missed Win' | 'Missed Mate' | 'Missed Fork' | 'Missed Skewer' | 'Missed Pin';
  severity: 'medium' | 'high' | 'critical';
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


