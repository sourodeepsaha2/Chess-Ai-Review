export const ACCURACY_CONFIG = {
  cplDecayConstant: 0.004,
  classificationWeights: {
    Brilliant: 100,
    Great: 100,
    Best: 100,
    Excellent: 95,
    Good: 80,
    Inaccuracy: 50,
    Mistake: 20,
    Blunder: 0,
  },
};

export const CLASSIFIER_CONFIG = {
  cplExcellent: 25,
  cplGood: 55,
  cplInaccuracy: 100,
  cplMistake: 200,
  winningThreshold: 450,
};

export const MATE_SCORE_THRESHOLD = 90000;
