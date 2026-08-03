import { apiClient } from './apiClient';

export interface AnalysisResponse {
  success: boolean;
  message: string;
  test: boolean;
  timestamp: number;
}

class AnalysisService {
  /**
   * Calls backend analysis verification endpoint.
   * Sends `{ test: true }` as a connectivity check.
   */
  async analyseGame(timeout?: number): Promise<AnalysisResponse> {
    return apiClient.post<AnalysisResponse>('/analyse', { test: true }, { timeout });
  }
}

export const analysisService = new AnalysisService();
