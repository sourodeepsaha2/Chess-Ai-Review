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
}


