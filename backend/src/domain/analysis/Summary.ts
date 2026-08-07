export class Summary {
  constructor(
    public readonly averageCentipawnLoss: number,
    public readonly moveClassificationCounts: Record<string, number>,
    public readonly overallEvaluation: number,
    public readonly whiteAccuracy: number,
    public readonly blackAccuracy: number
  ) {}
}
export default Summary;

