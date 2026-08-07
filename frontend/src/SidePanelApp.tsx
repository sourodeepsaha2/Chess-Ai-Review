import { useEffect, useState } from 'react'
import { messagingService } from './services/messagingService'
import type { MessagePayloads } from './types/messaging'
import { analysisService } from './services/analysisService'
import { AnalysisProvider, useAnalysis } from './context/AnalysisContext'
import SummaryCard from './components/SummaryCard'
import MoveList from './components/MoveList'

function SidePanelDashboard() {
  const [activePage, setActivePage] = useState<MessagePayloads['PAGE_READY'] | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle')
  const [extraction, setExtraction] = useState<MessagePayloads['PGN_EXTRACTED'] | null>(null)

  const { status, response, error, phaseMessage, progress, currentMove, totalMoves, startAnalysis, resetAnalysis } = useAnalysis()

  const handleTestConnection = async () => {
    setConnectionStatus('testing')
    try {
      const result = await analysisService.analyseGame()
      if (result && result.success) {
        setConnectionStatus('success')
      } else {
        setConnectionStatus('failed')
      }
    } catch (err) {
      console.error('[SidePanel] Connection test failed:', err)
      setConnectionStatus('failed')
    }
  }

  const handleStartAnalysis = () => {
    setExtraction(null)
    startAnalysis()
  }

  const handleResetAnalysis = () => {
    setExtraction(null)
    resetAnalysis()
  }

  useEffect(() => {
    // Notify Background that the Side Panel is loaded and ready
    messagingService.sendMessage('EXTENSION_READY', { timestamp: Date.now() })

    // Listen for page status updates (tab navigation / load)
    const unsubscribePageReady = messagingService.on('PAGE_READY', (payload) => {
      console.log('[SidePanel] Active page detected:', payload)
      setActivePage(payload)
    })

    // Listen for PGN extraction completion
    const unsubscribePgnExtracted = messagingService.on('PGN_EXTRACTED', (payload) => {
      console.log('[SidePanel] PGN extraction received:', payload)
      setExtraction(payload)
    })

    return () => {
      unsubscribePageReady()
      unsubscribePgnExtracted()
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-900 bg-slate-900/50 px-4 py-3 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20">
            <svg
              className="h-5 w-5 text-white animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-sm font-semibold tracking-wide text-transparent">
              Chess AI Review
            </h1>
            <p className="text-[10px] font-medium text-indigo-400">ACTIVE MESSAGING CHANNEL</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950 px-2.5 py-0.5 text-[10px] font-semibold text-slate-400">
          <span className={`h-1.5 w-1.5 rounded-full ${activePage ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          {activePage ? 'Connected' : 'Offline'}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-1 flex-col p-4 space-y-4 overflow-y-auto">
        {/* Active Page Badge */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3 backdrop-blur-xl transition-all duration-300 hover:border-slate-800">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Tab</div>
          {activePage ? (
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200 truncate">{activePage.title}</span>
              <span className="text-[10px] text-slate-400 truncate mt-0.5">{activePage.url}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">No Chess.com page active. Waiting for page connections...</div>
          )}
        </div>

        {/* API Connection Tester */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3 backdrop-blur-xl transition-all duration-300 hover:border-slate-800/50 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Backend API Connection</div>
            <div className="flex items-center gap-1.5">
              {connectionStatus === 'testing' && (
                <span className="text-[10px] text-indigo-455 font-semibold animate-pulse flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
                  Testing...
                </span>
              )}
              {connectionStatus === 'success' && (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Connected successfully
                </span>
              )}
              {connectionStatus === 'failed' && (
                <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Connection failed
                </span>
              )}
              {connectionStatus === 'idle' && (
                <span className="text-[10px] text-slate-500 font-semibold">Not Tested</span>
              )}
            </div>
          </div>
          <button
            onClick={handleTestConnection}
            disabled={connectionStatus === 'testing'}
            className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all duration-200 border cursor-pointer ${
              connectionStatus === 'testing'
                ? 'bg-slate-900 border-slate-850 text-slate-555 cursor-not-allowed'
                : 'bg-indigo-500/10 border-indigo-555/20 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/30 active:scale-95'
            }`}
          >
            Test Connection
          </button>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col items-center justify-center p-6 border border-slate-800 bg-slate-900/20 rounded-2xl relative overflow-hidden">
          <div className="absolute -top-12 left-1/2 -z-10 h-24 w-24 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-2xl" />

          {/* Idle State */}
          {status === 'idle' && (
            <div className="text-center w-full">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800/40 text-slate-400 border border-slate-800">
                <svg className="h-8 w-8 text-indigo-400 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-1 text-sm font-semibold text-slate-200">Start Workflow Analysis</h3>
              <p className="text-[11px] leading-relaxed text-slate-400 mb-4 max-w-[200px] mx-auto">
                Initiate the backend analysis request via the centralized state management context.
              </p>
              <button
                onClick={handleStartAnalysis}
                disabled={!activePage}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 shadow-md ${
                  activePage
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 active:scale-95 shadow-indigo-500/20 cursor-pointer'
                    : 'bg-slate-850 text-slate-500 cursor-not-allowed border border-slate-800'
                }`}
              >
                {!activePage ? 'Waiting for Active Chess Page' : 'Start AI Analysis'}
              </button>
            </div>
          )}

          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center w-full space-y-4 py-3">
              <div className="relative mx-auto h-16 w-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
                <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 animate-spin" />
                <svg className="h-6 w-6 text-indigo-455 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1" />
                </svg>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-200 animate-pulse">
                  {progress > 0 ? 'Analyzing...' : 'Running Backend Query'}
                </h3>
                {progress > 0 && currentMove > 0 && totalMoves > 0 ? (
                  <p className="text-[11px] text-indigo-400 font-bold">
                    Move {currentMove} / {totalMoves}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400">Status: {phaseMessage || 'Sending game...'}</p>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden border border-slate-900">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${Math.min(100, Math.max(0, progress || (progress === 0 && phaseMessage ? 0 : 33)))}%` }} 
                />
              </div>
              {progress > 0 && (
                <div className="text-[9px] font-bold text-indigo-400 font-mono tracking-wider">
                  {progress}% Complete
                </div>
              )}
            </div>
          )}

          {/* Success State */}
          {status === 'success' && response && (
            <div className="w-full space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-200">Analysis Workflow Complete</h3>
                <p className="text-[11px] text-emerald-400 font-semibold">{response.message}</p>
                <p className="text-[9px] text-slate-500">Timestamp: {new Date(response.timestamp || Date.now()).toLocaleTimeString()}</p>
              </div>
              <button
                onClick={handleResetAnalysis}
                className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition-colors duration-200 cursor-pointer"
              >
                Reset Analysis
              </button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="w-full space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-200">Analysis Failed</h3>
                <p className="text-[11px] text-rose-450 leading-relaxed max-w-[220px] mx-auto break-words">{error}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleStartAnalysis}
                  className="flex-1 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  Retry
                </button>
                <button
                  onClick={handleResetAnalysis}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition-colors duration-200 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary and Move List panels when success */}
        {status === 'success' && response && (
          <>
            <SummaryCard response={response} />
            {response.moves && response.moves.length > 0 ? (
              <MoveList moves={response.moves} />
            ) : (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-center text-xs text-amber-400">
                Empty Response: No move history was returned by the parser.
              </div>
            )}
          </>
        )}

        {/* Skeleton Placeholders during Loading */}
        {status === 'loading' && (
          <div className="flex flex-col space-y-3.5 animate-pulse">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Move History</span>
              <span className="text-[10px] font-bold text-slate-700 font-mono">Analyzing...</span>
            </div>
            
            <div className="flex flex-col space-y-2.5">
              {[1, 2, 3].map((val) => (
                <div key={val} className="rounded-xl border border-slate-900/40 bg-slate-900/10 p-3.5 flex flex-col space-y-3">
                  {/* Header: Move Number, SAN, Classification, evaluation */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-5 bg-slate-900/40 rounded" />
                      <div className="h-4 w-8 bg-slate-900/40 rounded" />
                      <div className="h-4 w-12 bg-slate-900/40 rounded-full" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-8 bg-slate-900/40 rounded" />
                      <div className="h-4 w-8 bg-slate-900/40 rounded" />
                      <div className="h-3.5 w-10 bg-slate-950/45 rounded border border-slate-900/60" />
                    </div>
                  </div>
                  {/* Advantage Gauge skeleton */}
                  <div className="h-9 bg-slate-950/20 rounded-lg border border-slate-900/40 p-2 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="h-2 w-16 bg-slate-900/40 rounded" />
                      <div className="h-2.5 w-12 bg-slate-900/40 rounded" />
                    </div>
                    <div className="h-1 bg-slate-950/40 rounded-full" />
                  </div>
                  {/* Board Position FEN skeleton */}
                  <div className="h-10 bg-slate-950/45 rounded-lg border border-slate-900/65" />
                  {/* Best Move skeleton */}
                  <div className="h-5 bg-slate-900/30 rounded" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PGN Extraction Result Panel */}

        {extraction && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 backdrop-blur-xl transition-all duration-300 hover:border-slate-800/50 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">PGN Extraction</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${extraction.success ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className={`text-[9px] font-semibold uppercase tracking-wider ${extraction.success ? 'text-emerald-400' : 'text-rose-455'}`}>
                  {extraction.success ? 'Success' : 'Failed'}
                </span>
              </div>
            </div>

            {extraction.success && extraction.pgn ? (
              <div className="flex flex-col space-y-2">
                <div className="text-[9px] text-slate-400">
                  Source: <span className="font-semibold text-slate-350">{extraction.source}</span>
                </div>
                <textarea
                  readOnly
                  value={extraction.pgn}
                  className="w-full h-24 p-2 bg-slate-950 border border-slate-850 rounded-lg text-[10px] font-mono text-slate-300 focus:outline-none focus:border-indigo-500/50 resize-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(extraction.pgn || '')
                  }}
                  className="self-end py-1 px-2.5 bg-slate-850 hover:bg-slate-800 text-[9px] font-bold text-indigo-400 rounded border border-slate-800 transition-colors duration-200 cursor-pointer"
                >
                  Copy PGN
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-1">
                <div className="text-[10px] text-rose-400 leading-relaxed bg-rose-500/5 border border-rose-500/10 rounded-lg p-2.5">
                  {extraction.error}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default function SidePanelApp() {
  return (
    <AnalysisProvider>
      <SidePanelDashboard />
    </AnalysisProvider>
  )
}

