/**
 * Games Index
 * Registers all available games
 */

import { registerGame } from '@/lib/games/registry';
import { letterMatchModule } from './letter-match';

// Register all games
registerGame(letterMatchModule);

// Export game modules for direct access
export { letterMatchModule };
