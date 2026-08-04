import { apiClient } from './apiClient';

export interface AnalysisResponse {
  success: boolean;
  message: string;
  test?: boolean;
  timestamp?: number;
  pgnProcessed?: boolean;
}

class AnalysisService {
  /**
   * Calls backend analysis verification endpoint.
   * Sends either `{ pgn: string }` or `{ test: true }`.
   */
  async analyseGame(pgn?: string, timeout?: number): Promise<AnalysisResponse> {
    const payload = pgn ? { pgn } : { test: true };
    return apiClient.post<AnalysisResponse>('/analyse', payload, { timeout });
  }
}

export const analysisService = new AnalysisService();

