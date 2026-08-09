import { ExplanationContext as IExplanationContext } from './types';

export class ExplanationContext implements IExplanationContext {
  constructor(
    public readonly moveNumber: number,
    public readonly player: 'white' | 'black',
    public readonly playedMove: string,
    public readonly bestMove: string,
    public readonly evaluationBefore: number | null,
    public readonly evaluationAfter: number | null,
    public readonly centipawnLoss: number | null,
    public readonly classification: string,
    public readonly principalVariation: string[],
    public readonly fen: string
  ) {}
}

export default ExplanationContext;
