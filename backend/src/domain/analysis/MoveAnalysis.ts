import { ClassificationResult } from './types';

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
    public readonly classification: ClassificationResult
  ) {}
}
export default MoveAnalysis;
