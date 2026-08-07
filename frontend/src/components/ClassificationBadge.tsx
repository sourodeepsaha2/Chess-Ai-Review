import React from 'react';

interface ClassificationProps {
  classification?: {
    classification: string;
    color: string;
    icon: string;
  };
}

export const ClassificationBadge: React.FC<ClassificationProps> = ({ classification }) => {
  if (!classification) return null;

  const { classification: label } = classification;

  // Custom styling maps to match Chess.com/Lichess standards but using our premium dark-mode theme
  let styles = 'bg-slate-800/40 border-slate-700/30 text-slate-400';
  let svgIcon = (
    <svg className="h-2.5 w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4" />
    </svg>
  );

  switch (label) {
    case 'Brilliant':
      styles = 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold shadow-[0_0_10px_rgba(6,182,212,0.15)]';
      svgIcon = (
        <svg className="h-2.5 w-2.5 mr-1 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2l4.456 1.179a1 1 0 01.002 1.925l-4.458 1.18-1.179 4.456a1 1 0 01-1.925.002l-1.18-4.456-4.456-1.179a1 1 0 01-.002-1.925l4.458-1.18 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
        </svg>
      );
      break;
    case 'Great':
      styles = 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)]';
      svgIcon = (
        <svg className="h-2.5 w-2.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      );
      break;
    case 'Best':
      styles = 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400 font-extrabold';
      svgIcon = (
        <svg className="h-2.5 w-2.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6.267 3.455a.75.75 0 00-.708.522L3.54 10.72a.75.75 0 00.214.774l5.64 5.25a.75.75 0 001.06 0l5.64-5.25a.75.75 0 00.214-.774l-2.017-6.743a.75.75 0 00-.708-.522H6.267zm2.47 5.78a.75.75 0 10-1.06-1.06L6.72 9.12a.75.75 0 000 1.06l1.25 1.25a.75.75 0 101.06-1.06l-.72-.72.937-.938z" clipRule="evenodd" />
        </svg>
      );
      break;
    case 'Excellent':
      styles = 'bg-teal-500/10 border-teal-500/20 text-teal-400 font-semibold';
      svgIcon = (
        <svg className="h-2.5 w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      );
      break;
    case 'Good':
      styles = 'bg-blue-500/10 border-blue-500/20 text-blue-400 font-medium';
      svgIcon = (
        <svg className="h-2.5 w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163-.005-.347-.015-.55-.03a13.916 13.916 0 01-4.577-1.218 1 1 0 01-.482-.693l-.97-5.056a1 1 0 01.378-.948 7.03 7.03 0 002.544-4.887V4a1 1 0 011-1h1.5a1 1 0 011 1v3.586a1 1 0 00.293.707l3.194 3.194a1 1 0 01.206.513z" />
        </svg>
      );
      break;
    case 'Inaccuracy':
      styles = 'bg-yellow-600/10 border-yellow-600/20 text-yellow-500 font-medium';
      svgIcon = (
        <svg className="h-2.5 w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
      break;
    case 'Mistake':
      styles = 'bg-rose-500/10 border-rose-500/25 text-rose-450 font-semibold';
      svgIcon = (
        <svg className="h-2.5 w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
      break;
    case 'Blunder':
      styles = 'bg-red-700/15 border-red-700/30 text-red-500 font-bold uppercase tracking-wider animate-pulse';
      svgIcon = (
        <svg className="h-2.5 w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] border font-sans uppercase tracking-wide select-none ${styles}`}>
      {svgIcon}
      {label}
    </span>
  );
};
export default ClassificationBadge;
