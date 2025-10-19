/**
 * Dexie.js Database Setup
 * Manages IndexedDB for offline data persistence
 */

import Dexie, { Table } from 'dexie';
import type {
  LetterMatchStatistics,
  OrientationGameStatistics,
} from '@/types/game';

/**
 * App settings interface
 */
export interface AppSettings {
  id?: number;
  key: string;
  value: string;
}

/**
 * Main database class
 */
export class FoundgartenDatabase extends Dexie {
  // Tables
  letterMatchStatistics!: Table<LetterMatchStatistics, number>;
  orientationGameStatistics!: Table<OrientationGameStatistics, number>;
  appSettings!: Table<AppSettings, number>;

  constructor() {
    super('FoundgartenDB');

    // Define database schema
    // Version 1: Initial schema
    this.version(1).stores({
      letterMatchStatistics: '++id, gameId, letter, caseType, lastAttempt',
      orientationGameStatistics: '++id, gameId, character, characterType, caseType, lastAttempt',
      appSettings: '++id, &key',
    });

    // Version 2: Add compound indexes
    this.version(2).stores({
      letterMatchStatistics: '++id, gameId, letter, caseType, [letter+caseType], lastAttempt',
      orientationGameStatistics: '++id, gameId, character, characterType, caseType, [character+characterType+caseType], lastAttempt',
      appSettings: '++id, &key',
    });
  }

  /**
   * Initialize database with default data if needed
   */
  async initialize(): Promise<void> {
    // Check if this is first run
    const settingsCount = await this.appSettings.count();

    if (settingsCount === 0) {
      // First run - initialize with defaults
      await this.appSettings.bulkAdd([
        { key: 'app.initialized', value: new Date().toISOString() },
        { key: 'app.version', value: '0.1.0' },
      ]);
    }

    // Initialize letter match statistics if empty
    const letterStatsCount = await this.letterMatchStatistics.count();
    if (letterStatsCount === 0) {
      await this.initializeLetterMatchStats();
    }

    // Initialize orientation game statistics if empty
    const orientationStatsCount = await this.orientationGameStatistics.count();
    if (orientationStatsCount === 0) {
      await this.initializeOrientationGameStats();
    }
  }

  /**
   * Initialize Letter Match statistics for all letters
   */
  async initializeLetterMatchStats(): Promise<void> {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const initialStats: Omit<LetterMatchStatistics, 'id'>[] = [];

    for (const letter of alphabet) {
      // Uppercase
      initialStats.push({
        gameId: 'letter-match',
        itemId: `${letter}-uppercase`,
        letter,
        caseType: 'uppercase',
        totalAttempts: 0,
        correctCount: 0,
        incorrectCount: 0,
        lastAttempt: new Date(),
        successRate: 0,
      });

      // Lowercase
      initialStats.push({
        gameId: 'letter-match',
        itemId: `${letter.toLowerCase()}-lowercase`,
        letter: letter.toLowerCase(),
        caseType: 'lowercase',
        totalAttempts: 0,
        correctCount: 0,
        incorrectCount: 0,
        lastAttempt: new Date(),
        successRate: 0,
      });
    }

    await this.letterMatchStatistics.bulkAdd(initialStats);
  }

  /**
   * Initialize Orientation Game statistics for common characters
   */
  async initializeOrientationGameStats(): Promise<void> {
    const letters = {
      uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
      lowercase: 'abcdefghjklmnpqrstuvwxyz',
    };
    const numbers = '0123456789';

    const initialStats: Omit<OrientationGameStatistics, 'id'>[] = [];

    // Uppercase letters
    for (const char of letters.uppercase) {
      initialStats.push({
        gameId: 'orientation-game',
        itemId: `${char}-uppercase`,
        character: char,
        characterType: 'letter',
        caseType: 'uppercase',
        totalAttempts: 0,
        correctCount: 0,
        incorrectCount: 0,
        lastAttempt: new Date(),
        successRate: 0,
        confusionScore: 0,
      });
    }

    // Lowercase letters
    for (const char of letters.lowercase) {
      initialStats.push({
        gameId: 'orientation-game',
        itemId: `${char}-lowercase`,
        character: char,
        characterType: 'letter',
        caseType: 'lowercase',
        totalAttempts: 0,
        correctCount: 0,
        incorrectCount: 0,
        lastAttempt: new Date(),
        successRate: 0,
        confusionScore: 0,
      });
    }

    // Numbers
    for (const char of numbers) {
      initialStats.push({
        gameId: 'orientation-game',
        itemId: `${char}-number`,
        character: char,
        characterType: 'number',
        caseType: 'n/a',
        totalAttempts: 0,
        correctCount: 0,
        incorrectCount: 0,
        lastAttempt: new Date(),
        successRate: 0,
        confusionScore: 0,
      });
    }

    await this.orientationGameStatistics.bulkAdd(initialStats);
  }

  /**
   * Clear all game statistics (for reset functionality)
   */
  async clearAllStatistics(): Promise<void> {
    await this.letterMatchStatistics.clear();
    await this.orientationGameStatistics.clear();
    await this.initializeLetterMatchStats();
    await this.initializeOrientationGameStats();
  }

  /**
   * Get database size estimate (for debugging/analytics)
   */
  async getDatabaseSize(): Promise<{
    letterMatchStats: number;
    orientationGameStats: number;
    settings: number;
  }> {
    return {
      letterMatchStats: await this.letterMatchStatistics.count(),
      orientationGameStats: await this.orientationGameStatistics.count(),
      settings: await this.appSettings.count(),
    };
  }
}

// Export singleton database instance
export const db = new FoundgartenDatabase();

// Initialize database on module load
db.initialize().catch(console.error);
