import React from 'react';

interface OpeningCardProps {
  openingName?: string | null;
  ecoCode?: string | null;
  openingVariation?: string | null;
}

export const OpeningCard: React.FC<OpeningCardProps> = ({
  openingName,
  ecoCode,
  openingVariation,
}) => {
  const hasOpening = !!openingName;

  return (
    <div className="border-t border-slate-850/60 pt-3.5 flex flex-col space-y-2.5">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Opening & Theory</span>
      
      {hasOpening ? (
        <div className="grid grid-cols-3 gap-2">
          {/* Opening Name Card (occupies 2 columns) */}
          <div className="col-span-2 rounded-lg border border-slate-850 bg-slate-950/45 p-2.5 flex flex-col justify-between transition-all hover:border-slate-800">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Opening</span>
            <span className="text-[11px] font-extrabold text-indigo-400 mt-1 truncate">
              {openingName}
            </span>
            {openingVariation && (
              <span className="text-[9px] text-slate-400 italic mt-0.5 truncate">
                {openingVariation}
              </span>
            )}
          </div>

          {/* ECO Code Card (occupies 1 column) */}
          <div className="rounded-lg border border-slate-850 bg-slate-950/45 p-2.5 flex flex-col justify-between items-center text-center transition-all hover:border-slate-800">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">ECO</span>
            <span className="text-xs font-black text-amber-400 mt-1 font-mono">
              {ecoCode || '--'}
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-850 bg-slate-950/45 p-3 flex flex-col justify-between transition-all hover:border-slate-800">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Opening</span>
          <span className="text-[11px] font-extrabold text-indigo-400 mt-1">Unknown</span>
        </div>
      )}
    </div>
  );
};

export default OpeningCard;
