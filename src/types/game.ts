/**
 * Core game type definitions
 */

export type GameId = 'letter-match' | 'orientation-game';

export type ItemType = 'letter' | 'number' | 'word' | 'custom';

export type Difficulty = 'easy' | 'auto' | 'hard';

export type CaseType = 'uppercase' | 'lowercase' | 'both' | 'n/a';

export type CharacterType = 'letter' | 'number' | 'both';

/**
 * Base game configuration interface
 */
export interface GameConfig {
  id: GameId;
  name: string;
  description: string;
  icon: string;
  itemType: ItemType;
  defaultDifficulty: Difficulty;
}

/**
 * Game statistics base interface
 */
export interface GameStatistics {
  id?: number;
  gameId: GameId;
  itemId: string;
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  lastAttempt: Date;
  successRate: number;
}

/**
 * Letter Match specific types
 */
export interface LetterMatchStatistics extends GameStatistics {
  letter: string;
  caseType: CaseType;
}

export interface LetterMatchConfig {
  difficulty: Difficulty;
  letterCase: CaseType;
  roundSize: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

/**
 * Orientation Game specific types
 */
export interface OrientationGameStatistics extends GameStatistics {
  character: string;
  characterType: CharacterType;
  caseType: CaseType;
  confusionScore: number;
}

export interface OrientationGameConfig {
  difficulty: Difficulty;
  characterType: CharacterType;
  letterCase: CaseType;
  roundSize: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  showHints: boolean;
}

/**
 * Game session state (temporary, not persisted)
 */
export interface GameSession {
  gameId: GameId;
  currentRound: number;
  totalRounds: number;
  currentScore: number;
  startTime: Date;
}

/**
 * Weighted item for adaptive learning
 */
export interface WeightedItem {
  itemId: string;
  weight: number;
}
