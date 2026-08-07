export class Summary {
  constructor(
    public readonly averageCentipawnLoss: number,
    public readonly moveClassificationCounts: Record<string, number>,
    public readonly overallEvaluation: number
  ) {}
}
export default Summary;
