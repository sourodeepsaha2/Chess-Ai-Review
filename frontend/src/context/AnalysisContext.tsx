import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { analysisService } from '../services/analysisService';
import type { AnalysisResponse } from '../services/analysisService';

export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

interface AnalysisContextType {
  status: AnalysisStatus;
  response: AnalysisResponse | null;
  error: string | null;
  startAnalysis: () => Promise<void>;
  resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = useCallback(async () => {
    setStatus('loading');
    setError(null);
    setResponse(null);
    try {
      // Execute the POST /analyse connection/game analysis call
      const result = await analysisService.analyseGame();
      if (result && result.success) {
        setResponse(result);
        setStatus('success');
      } else {
        setStatus('error');
        setError(result?.message || 'Server returned an unsuccessful status indicator.');
      }
    } catch (err: any) {
      console.error('[AnalysisContext] Analysis request failed:', err);
      setStatus('error');
      setError(err.message || 'An unexpected error occurred during analysis.');
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setStatus('idle');
    setResponse(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      status,
      response,
      error,
      startAnalysis,
      resetAnalysis,
    }),
    [status, response, error, startAnalysis, resetAnalysis]
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
export default AnalysisContext;
