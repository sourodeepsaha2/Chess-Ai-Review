function App() {
  return (
    <div className="flex h-[320px] w-[280px] flex-col bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Glow Effect */}
      <div className="absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

      {/* Main Container */}
      <main className="relative flex flex-1 flex-col items-center justify-center p-6 text-center">
        {/* Logo Icon */}
        <div className="animate-fade-in mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-lg font-bold tracking-wide text-transparent">
          Chess AI Review
        </h1>

        {/* Divider */}
        <div className="my-3 h-[1px] w-12 bg-slate-800" />

        {/* Load Status */}
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Extension Loaded
        </div>

        {/* Version info */}
        <p className="mt-8 text-[10px] font-medium tracking-wider text-slate-500 uppercase">
          Manifest v3 • React 19
        </p>
      </main>
    </div>
  )
}

export default App
