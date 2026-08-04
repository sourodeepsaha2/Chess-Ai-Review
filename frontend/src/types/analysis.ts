export interface ParsedMove {
  moveNumber: number;
  san: string;
  fenAfterMove: string;
  turn: 'w' | 'b';
}
