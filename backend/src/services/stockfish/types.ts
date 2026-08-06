export interface StockfishAnalysisResult {
  evaluation: number;
  bestMove: string;
  pv: string[];
  depth: number;
}

export interface StockfishEngineConfig {
  path: string;
  defaultDepth: number;
}
