import { useEffect, useState } from 'react'
import { messagingService } from './services/messagingService'
import type { MessagePayloads } from './types/messaging'
import { analysisService } from './services/analysisService'

function SidePanelApp() {
  const [activePage, setActivePage] = useState<MessagePayloads['PAGE_READY'] | null>(null)
  const [analysis, setAnalysis] = useState<MessagePayloads['ANALYSIS_RECEIVED'] | null>(null)
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'completed'>('idle')
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle')

  const handleTestConnection = async () => {
    setConnectionStatus('testing')
    try {
      const response = await analysisService.analyseGame()
      if (response && response.success) {
        setConnectionStatus('success')
      } else {
        setConnectionStatus('failed')
      }
    } catch (err) {
      console.error('[SidePanel] Connection test failed:', err)
      setConnectionStatus('failed')
    }
  }

  useEffect(() => {
    // Notify Background that the Side Panel is loaded and ready
    messagingService.sendMessage('EXTENSION_READY', { timestamp: Date.now() })

    // Listen for page status updates (tab navigation / load)
    const unsubscribePageReady = messagingService.on('PAGE_READY', (payload) => {
      console.log('[SidePanel] Active page detected:', payload)
      setActivePage(payload)
    })

    // Listen for simulated analysis completion
    const unsubscribeAnalysisReceived = messagingService.on('ANALYSIS_RECEIVED', (payload) => {
      console.log('[SidePanel] Analysis received:', payload)
      setAnalysis(payload)
      setStatus('completed')
    })

    return () => {
      unsubscribePageReady()
      unsubscribeAnalysisReceived()
    }
  }, [])

  const handleRequestAnalysis = async () => {
    setStatus('analyzing')
    setAnalysis(null)
    try {
      await messagingService.sendMessage('REQUEST_ANALYSIS', { timestamp: Date.now() })
    } catch (err) {
      console.error('[SidePanel] Failed to request analysis:', err)
      setStatus('idle')
    }
  }

  // Helper to determine accuracy badge styling
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'from-emerald-500 to-teal-400 text-emerald-400'
    if (accuracy >= 75) return 'from-blue-500 to-indigo-400 text-blue-400'
    return 'from-amber-500 to-orange-400 text-amber-400'
  }

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
                <span className="text-[10px] text-indigo-450 font-semibold animate-pulse flex items-center gap-1">
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
                ? 'bg-slate-900 border-slate-850 text-slate-550 cursor-not-allowed'
                : 'bg-indigo-500/10 border-indigo-550/20 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/30 active:scale-95'
            }`}
          >
            Test Connection
          </button>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col items-center justify-center p-6 border border-slate-800 bg-slate-900/20 rounded-2xl relative overflow-hidden">

          <div className="absolute -top-12 left-1/2 -z-10 h-24 w-24 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-2xl" />

          {status === 'idle' && !analysis && (
            <div className="text-center w-full">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800/40 text-slate-400 border border-slate-800">
                <svg className="h-8 w-8 text-indigo-400 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-1 text-sm font-semibold text-slate-200">Start Review Engine</h3>
              <p className="text-[11px] leading-relaxed text-slate-400 mb-4 max-w-[200px] mx-auto">
                Trigger mock messaging analysis loop across background, sidepanel, and content script.
              </p>
              <button
                onClick={handleRequestAnalysis}
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

          {/* Analyzing Simulation View */}
          {status === 'analyzing' && (
            <div className="text-center w-full space-y-4 py-3">
              <div className="relative mx-auto h-16 w-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
                <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 animate-spin" />
                <svg className="h-6 w-6 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-200 animate-pulse">Running Extension Loop</h3>
                <p className="text-[11px] text-slate-400">Content script is simulating move metrics...</p>
              </div>
              <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-2/3 rounded-full animate-[shimmer_1.5s_infinite]" style={{
                  backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                  backgroundSize: '200% 100%'
                }} />
              </div>
            </div>
          )}

          {/* Analysis Received Dashboard */}
          {status === 'completed' && analysis && (
            <div className="w-full space-y-5">
              {/* Accuracy Circle Header */}
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full border-2 flex items-center justify-center bg-slate-900/50 shadow-inner ${
                    analysis.accuracy >= 90 ? 'border-emerald-500/40 shadow-emerald-950/20' : 'border-blue-500/40 shadow-blue-950/20'
                  }`}>
                    <span className="text-xs font-bold tracking-tight text-white">{analysis.accuracy}%</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Engine Accuracy</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Color: <span className="font-semibold text-slate-300">{analysis.playerColor}</span></p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r ${getAccuracyColor(analysis.accuracy)} bg-clip-text text-transparent border border-slate-800`}>
                  {analysis.accuracy >= 90 ? 'Excellent' : 'Great Play'}
                </div>
              </div>

              {/* Grid Statistics */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Suggested Move</div>
                  <div className="text-xs font-bold text-indigo-400 mt-0.5">{analysis.bestMove}</div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Total Moves</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">{analysis.totalMoves}</div>
                </div>
              </div>

              {/* Evaluation summary */}
              <div className="text-left bg-slate-900/50 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Key Summary</div>
                <p className="text-xs leading-relaxed text-slate-350">{analysis.summary}</p>
              </div>

              {/* Rerun analysis */}
              <button
                onClick={handleRequestAnalysis}
                className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition-colors duration-200 cursor-pointer"
              >
                Re-analyze Board Position
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SidePanelApp
