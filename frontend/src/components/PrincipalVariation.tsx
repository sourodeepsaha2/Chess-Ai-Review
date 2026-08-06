import React from 'react';

interface PrincipalVariationProps {
  pv?: string[];
}

export const PrincipalVariation: React.FC<PrincipalVariationProps> = ({ pv }) => {
  if (!pv || pv.length === 0) return null;

  // Limit display to the first 5 plies of principal variation for space efficiency
  const displayedPlies = pv.slice(0, 5);

  return (
    <div className="flex flex-col space-y-1 mt-1 bg-slate-950/20 rounded-lg p-2 border border-slate-900/40">
      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Line Continuation (PV)</span>
      <div className="flex flex-wrap gap-1.5 mt-0.5">
        {displayedPlies.map((move, idx) => (
          <span 
            key={`${move}-${idx}`} 
            className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/80 text-[9px] font-mono text-slate-300 font-semibold"
          >
            {idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}.` : ''} {move}
          </span>
        ))}
        {pv.length > 5 && (
          <span className="text-[9px] text-slate-500 flex items-center font-mono pl-0.5">...</span>
        )}
      </div>
    </div>
  );
};
export default PrincipalVariation;
