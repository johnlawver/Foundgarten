/**
 * Letter Match Game Module
 * Exports game configuration and component for registry
 */

import type { GameConfig } from '@/types/game';
import type { GameModule } from '@/lib/games/registry';
import { LetterMatchGame } from './LetterMatchGame';

export const letterMatchConfig: GameConfig = {
  id: 'letter-match',
  name: 'Letter Match',
  description: 'Swipe to identify uppercase and lowercase letters',
  icon: '🔤',
  itemType: 'letter',
  defaultDifficulty: 'auto',
};

export const letterMatchModule: GameModule = {
  config: letterMatchConfig,
  Component: LetterMatchGame,
};

// Re-export the game component
export { LetterMatchGame };
