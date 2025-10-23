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
 * Child profile interface
 */
export interface Profile {
  id?: number;
  name: string;
  emoji: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Main database class
 */
export class FoundgartenDatabase extends Dexie {
  // Tables
  letterMatchStatistics!: Table<LetterMatchStatistics, number>;
  orientationGameStatistics!: Table<OrientationGameStatistics, number>;
  appSettings!: Table<AppSettings, number>;
  profiles!: Table<Profile, number>;

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

    // Version 3: Add profiles and profileId to statistics
    this.version(3).stores({
      letterMatchStatistics: '++id, gameId, profileId, letter, caseType, [letter+caseType], [profileId+letter+caseType], lastAttempt',
      orientationGameStatistics: '++id, gameId, profileId, character, characterType, caseType, [character+characterType+caseType], [profileId+character+characterType+caseType], lastAttempt',
      appSettings: '++id, &key',
      profiles: '++id, name, createdAt',
    }).upgrade(async () => {
      // Migration: Add profileId to existing statistics
      // Note: User chose "start fresh" so we don't need to migrate old data
      // We'll just ensure new records have profileId
      console.log('Database upgraded to version 3 - profiles feature added');
    });

    // Version 4: Remove old compound indexes that don't include profileId
    this.version(4).stores({
      letterMatchStatistics: '++id, gameId, profileId, letter, caseType, [profileId+letter+caseType], lastAttempt',
      orientationGameStatistics: '++id, gameId, profileId, character, characterType, caseType, [profileId+character+characterType+caseType], lastAttempt',
      appSettings: '++id, &key',
      profiles: '++id, name, createdAt',
    }).upgrade(async () => {
      // Cleanup: Removed old compound indexes [letter+caseType] and [character+characterType+caseType]
      // All queries now properly scoped to profileId
      console.log('Database upgraded to version 4 - cleaned up compound indexes');
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
        { key: 'app.version', value: '0.2.0' }, // Updated version for profiles
      ]);
    }

    // Note: Statistics are now initialized per-profile by game utilities
    // when a new profile is created or a game starts
  }

  /**
   * Clear all game statistics for a specific profile (for reset functionality)
   */
  async clearProfileStatistics(profileId: number): Promise<void> {
    await this.letterMatchStatistics
      .where('profileId')
      .equals(profileId)
      .delete();
    await this.orientationGameStatistics
      .where('profileId')
      .equals(profileId)
      .delete();
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
