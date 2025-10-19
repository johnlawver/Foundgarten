/**
 * Letter Match Game Type Definitions
 */

/**
 * Letter object used during gameplay
 */
export interface Letter {
  character: string; // The actual letter character
  caseType: 'uppercase' | 'lowercase';
  weight?: number; // For adaptive selection algorithm
}

/**
 * Game configuration/settings
 */
export interface LetterMatchConfig {
  difficulty: 'easy' | 'auto' | 'hard';
  letterCase: 'both' | 'uppercase' | 'lowercase';
  roundSize: number; // 10-26 letters per round
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

/**
 * Default configuration values
 */
export const DEFAULT_LETTER_MATCH_CONFIG: LetterMatchConfig = {
  difficulty: 'auto',
  letterCase: 'both',
  roundSize: 15,
  soundEnabled: true,
  hapticEnabled: true,
};

/**
 * Game state interface (for Zustand store)
 */
export interface LetterMatchState {
  // Current session state
  currentRound: number;
  sessionLetters: Letter[]; // Letters for current round
  currentIndex: number; // Index in sessionLetters
  currentScore: number; // Correct answers in this round
  roundComplete: boolean;
  config: LetterMatchConfig;

  // Actions
  startNewRound: () => Promise<void>;
  recordAnswer: (correct: boolean) => Promise<void>;
  nextLetter: () => void;
  resetGame: () => void;
  updateConfig: (config: Partial<LetterMatchConfig>) => void;
}

/**
 * Swipe direction for card animations
 */
export type SwipeDirection = 'left' | 'right' | null;

/**
 * Round summary statistics
 */
export interface RoundSummary {
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  successRate: number;
  roundNumber: number;
}
