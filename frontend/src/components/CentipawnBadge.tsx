import React from 'react';

interface CentipawnBadgeProps {
  centipawnLoss?: number;
}

export const CentipawnBadge: React.FC<CentipawnBadgeProps> = ({ centipawnLoss }) => {
  if (centipawnLoss === undefined || centipawnLoss === null) return null;

  if (centipawnLoss === 0) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider border bg-slate-900/10 border-slate-900 text-slate-500 uppercase">
        No Loss
      </span>
    );
  }

  const decimalLoss = (centipawnLoss / 100).toFixed(2);

  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider border bg-rose-500/5 border-rose-500/10 text-rose-400">
      Loss: -{decimalLoss}
    </span>
  );
};
export default CentipawnBadge;
