export interface ExplanationContext {
  moveNumber: number;
  player: 'white' | 'black';
  playedMove: string;
  bestMove: string;
  evaluationBefore: number | null;
  evaluationAfter: number | null;
  centipawnLoss: number | null;
  classification: string;
  principalVariation: string[];
  fen: string;
}

export interface ExplanationResult {
  summary: string;
  explanation: string;
  betterMove: string;
  lesson: string;
}
