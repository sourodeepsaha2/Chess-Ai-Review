export const TACTICAL_THRESHOLDS = {
  mateThreshold: 90000,          // Score above which we have a mate sequence
  winningThreshold: 300,        // Score above which a player is considered completely winning (+3.00)
  evalSwingThreshold: 200,      // Minimum swing in CP to register an EVAL_SWING (+2.00)
  highSeverityThreshold: 300,   // Swing in CP to label severity as 'high' (+3.00)
};
