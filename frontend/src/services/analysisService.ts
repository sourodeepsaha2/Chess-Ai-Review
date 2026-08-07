import { apiClient } from './apiClient';
import type { ParsedMove } from '../types/analysis';

export interface GameSummary {
  totalMoves: number;
  averageCentipawnLoss: number;
  classificationCounts: {
    Brilliant: number;
    Great: number;
    Best: number;
    Excellent: number;
    Good: number;
    Inaccuracy: number;
    Mistake: number;
    Blunder: number;
  };
  [key: string]: any;
}

export interface AnalysisResponse {
  success: boolean;
  message: string;
  test?: boolean;
  timestamp?: number;
  pgnProcessed?: boolean;
  moveCount?: number;
  moves?: ParsedMove[];
  summary?: GameSummary;
}

export interface AnalysisStartResponse {
  success: boolean;
  message: string;
  analysisId?: string;
}

export interface AnalysisStatusResponse {
  success: boolean;
  id: string;
  status: 'loading' | 'analyzing' | 'success' | 'error';
  progress: number;
  currentMove: number;
  totalMoves: number;
  moves?: ParsedMove[];
  summary?: GameSummary;
  report?: any;
  error: string | null;
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

  /**
   * Enqueues a PGN analysis job on the backend and returns the analysisId.
   */
  async startAnalysisJob(pgn: string, timeout?: number): Promise<AnalysisStartResponse> {
    return apiClient.post<AnalysisStartResponse>('/analyse', { pgn }, { timeout });
  }

  /**
   * Retrieves the current progress and results of a enqueued analysis job.
   */
  async getAnalysisJobStatus(id: string, timeout?: number): Promise<AnalysisStatusResponse> {
    return apiClient.get<AnalysisStatusResponse>(`/analyse/status/${id}`, { timeout });
  }
}

export const analysisService = new AnalysisService();


