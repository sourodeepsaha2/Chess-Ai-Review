import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { messagingService } from '../services/messagingService';
import type { AnalysisResponse } from '../services/analysisService';

export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

interface AnalysisContextType {
  status: AnalysisStatus;
  response: AnalysisResponse | null;
  error: string | null;
  phaseMessage: string;
  startAnalysis: () => Promise<void>;
  resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phaseMessage, setPhaseMessage] = useState<string>('');

  // Synchronize state with events broadcast from the background routing hub
  useEffect(() => {
    const unsubscribeStatus = messagingService.on('ANALYSIS_STATUS', (payload) => {
      console.log('[AnalysisContext] Received background status sync:', payload);
      setStatus(payload.status);
      if (payload.phaseMessage) {
        setPhaseMessage(payload.phaseMessage);
      }
      if (payload.response !== undefined) {
        setResponse(payload.response);
      }
      if (payload.error !== undefined) {
        setError(payload.error);
      }
    });

    return () => {
      unsubscribeStatus();
    };
  }, []);

  const startAnalysis = useCallback(async () => {
    setStatus('loading');
    setError(null);
    setResponse(null);
    setPhaseMessage('Extracting PGN...');
    try {
      // Dispatch REQUEST_ANALYSIS. Background worker coordinates extraction and API calls.
      await messagingService.sendMessage('REQUEST_ANALYSIS', { timestamp: Date.now() });
    } catch (err: any) {
      console.error('[AnalysisContext] Failed to dispatch analysis request:', err);
      setStatus('error');
      setError(err.message || 'Failed to dispatch analysis trigger.');
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setStatus('idle');
    setResponse(null);
    setError(null);
    setPhaseMessage('');
  }, []);

  const value = useMemo(
    () => ({
      status,
      response,
      error,
      phaseMessage,
      startAnalysis,
      resetAnalysis,
    }),
    [status, response, error, phaseMessage, startAnalysis, resetAnalysis]
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

