import React from 'react';

interface AnalysisHeaderProps {
  activePage: { url: string; title: string } | null;
  connectionStatus: 'idle' | 'testing' | 'success' | 'failed';
  onTestConnection: () => void;
}

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  activePage,
  connectionStatus,
  onTestConnection,
}) => {
  return (
    <div className="flex flex-col space-y-3.5">
      {/* Top Banner */}
      <header className="flex items-center justify-between border-b border-slate-900 bg-slate-900/40 px-4 py-3 backdrop-blur-md sticky top-0 z-50 rounded-b-xl">
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
            <p className="text-[9px] font-medium text-indigo-400">ACTIVE MESSAGING CHANNEL</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950 px-2.5 py-0.5 text-[9px] font-semibold text-slate-400">
          <span className={`h-1.5 w-1.5 rounded-full ${activePage ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          {activePage ? 'Connected' : 'Offline'}
        </div>
      </header>

      {/* Target Tab Container */}
      <div className="rounded-xl border border-slate-850 bg-slate-900/10 p-3.5 backdrop-blur-xl transition-all duration-300">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Chess Page</div>
        {activePage ? (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-200 truncate">{activePage.title}</span>
            <span className="text-[9px] text-slate-400 truncate mt-0.5">{activePage.url}</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">No Chess.com page active. Waiting for page connections...</div>
        )}
      </div>

      {/* API Connection Tester */}
      <div className="rounded-xl border border-slate-850 bg-slate-900/10 p-3.5 backdrop-blur-xl transition-all duration-300 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Backend API Status</div>
          <div className="flex items-center gap-1.5">
            {connectionStatus === 'testing' && (
              <span className="text-[9px] text-indigo-400 font-semibold animate-pulse flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
                Testing...
              </span>
            )}
            {connectionStatus === 'success' && (
              <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Connected
              </span>
            )}
            {connectionStatus === 'failed' && (
              <span className="text-[9px] text-rose-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Disconnected
              </span>
            )}
            {connectionStatus === 'idle' && (
              <span className="text-[9px] text-slate-500 font-semibold">Not Tested</span>
            )}
          </div>
        </div>
        <button
          onClick={onTestConnection}
          disabled={connectionStatus === 'testing'}
          className={`w-full py-1.5 px-3 rounded-lg text-[9px] font-bold transition-all duration-200 border cursor-pointer ${
            connectionStatus === 'testing'
              ? 'bg-slate-900 border-slate-850 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/30 active:scale-95'
          }`}
        >
          Verify Server Connection
        </button>
      </div>
    </div>
  );
};

export default AnalysisHeader;
