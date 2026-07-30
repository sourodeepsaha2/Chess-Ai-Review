function SidePanelApp() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20">
            <svg
              className="h-5 w-5 text-white"
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
            <p className="text-[10px] font-medium text-indigo-400">SIDE PANEL v1.0</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Ready
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="relative flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-800 bg-slate-900/30 p-8 backdrop-blur-xl transition-all duration-300 hover:border-slate-700/50">
          {/* Decorative glow */}
          <div className="absolute -top-12 left-1/2 -z-10 h-24 w-24 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-2xl" />

          {/* SVG Chess Board Illustration */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-800/40 text-slate-400">
            <svg
              className="h-10 w-10 opacity-70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>

          <h2 className="mb-2 text-sm font-medium tracking-wide text-slate-200">Game Analysis</h2>
          <p className="text-xs leading-relaxed text-slate-400">Analysis will appear here.</p>
        </div>
      </main>
    </div>
  )
}

export default SidePanelApp
