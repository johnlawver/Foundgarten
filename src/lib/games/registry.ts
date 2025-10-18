/**
 * Game Registry
 * Central system for managing available games
 */

import type { GameConfig, GameId } from '@/types/game';

/**
 * Game module interface
 * Each game must implement this structure
 */
export interface GameModule {
  config: GameConfig;
  Component: React.ComponentType;
}

/**
 * Registry of all available games
 */
class GameRegistry {
  private games: Map<GameId, GameModule> = new Map();

  /**
   * Register a game
   */
  register(game: GameModule): void {
    if (this.games.has(game.config.id)) {
      console.warn(`Game ${game.config.id} is already registered`);
      return;
    }

    this.games.set(game.config.id, game);
  }

  /**
   * Get a specific game by ID
   */
  getGame(id: GameId): GameModule | undefined {
    return this.games.get(id);
  }

  /**
   * Get all registered games
   */
  getAllGames(): GameModule[] {
    return Array.from(this.games.values());
  }

  /**
   * Get all game configs (for navigation/listing)
   */
  getAllGameConfigs(): GameConfig[] {
    return Array.from(this.games.values()).map((game) => game.config);
  }

  /**
   * Check if a game is registered
   */
  hasGame(id: GameId): boolean {
    return this.games.has(id);
  }

  /**
   * Get number of registered games
   */
  getGameCount(): number {
    return this.games.size;
  }

  /**
   * Unregister a game (mainly for testing)
   */
  unregister(id: GameId): boolean {
    return this.games.delete(id);
  }

  /**
   * Clear all games (mainly for testing)
   */
  clear(): void {
    this.games.clear();
  }
}

// Export singleton instance
export const gameRegistry = new GameRegistry();

/**
 * Helper function to register a game
 */
export function registerGame(game: GameModule): void {
  gameRegistry.register(game);
}

/**
 * Helper function to get a game
 */
export function getGame(id: GameId): GameModule | undefined {
  return gameRegistry.getGame(id);
}

/**
 * Helper function to get all games
 */
export function getAllGames(): GameModule[] {
  return gameRegistry.getAllGames();
}

/**
 * Helper function to get all game configs
 */
export function getAllGameConfigs(): GameConfig[] {
  return gameRegistry.getAllGameConfigs();
}
