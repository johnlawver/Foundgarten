/**
 * Statistics utility functions
 * Helper functions for managing game statistics in IndexedDB
 */

import { db } from './db';
import type {
  GameId,
  LetterMatchStatistics,
  OrientationGameStatistics,
} from '@/types/game';

/**
 * Record an answer for Letter Match game
 */
export async function recordLetterMatchAnswer(
  letter: string,
  caseType: 'uppercase' | 'lowercase',
  correct: boolean
): Promise<void> {
  const itemId = `${letter}-${caseType}`;

  // Get existing statistics or create new
  let stat = await db.letterMatchStatistics
    .where({ letter, caseType })
    .first();

  if (!stat) {
    // Create new statistics entry
    stat = {
      gameId: 'letter-match',
      itemId,
      letter,
      caseType,
      totalAttempts: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastAttempt: new Date(),
      successRate: 0,
    };
  }

  // Update statistics
  stat.totalAttempts++;
  if (correct) {
    stat.correctCount++;
  } else {
    stat.incorrectCount++;
  }
  stat.successRate = stat.correctCount / stat.totalAttempts;
  stat.lastAttempt = new Date();

  // Save to database
  await db.letterMatchStatistics.put(stat);
}

/**
 * Record an answer for Orientation Game
 */
export async function recordOrientationGameAnswer(
  character: string,
  characterType: 'letter' | 'number',
  caseType: 'uppercase' | 'lowercase' | 'n/a',
  correct: boolean
): Promise<void> {
  const itemId = `${character}-${caseType === 'n/a' ? 'number' : caseType}`;

  // Get existing statistics or create new
  let stat = await db.orientationGameStatistics
    .where({ character, caseType })
    .first();

  if (!stat) {
    // Create new statistics entry
    stat = {
      gameId: 'orientation-game',
      itemId,
      character,
      characterType,
      caseType,
      totalAttempts: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastAttempt: new Date(),
      successRate: 0,
      confusionScore: 0,
    };
  }

  // Update statistics
  stat.totalAttempts++;
  if (correct) {
    stat.correctCount++;
  } else {
    stat.incorrectCount++;
  }
  stat.successRate = stat.correctCount / stat.totalAttempts;
  stat.lastAttempt = new Date();

  // Update confusion score (inverse of success rate)
  stat.confusionScore = 1 - stat.successRate;

  // Save to database
  await db.orientationGameStatistics.put(stat);
}

/**
 * Get all statistics for Letter Match
 */
export async function getLetterMatchStatistics(): Promise<LetterMatchStatistics[]> {
  return await db.letterMatchStatistics
    .where('gameId')
    .equals('letter-match')
    .toArray();
}

/**
 * Get all statistics for Orientation Game
 */
export async function getOrientationGameStatistics(): Promise<
  OrientationGameStatistics[]
> {
  return await db.orientationGameStatistics
    .where('gameId')
    .equals('orientation-game')
    .toArray();
}

/**
 * Get statistics for a specific letter (both cases)
 */
export async function getLetterStatistics(
  letter: string
): Promise<LetterMatchStatistics[]> {
  return await db.letterMatchStatistics
    .where('letter')
    .equalsIgnoreCase(letter)
    .toArray();
}

/**
 * Get statistics for a specific character
 */
export async function getCharacterStatistics(
  character: string
): Promise<OrientationGameStatistics[]> {
  return await db.orientationGameStatistics
    .where('character')
    .equals(character)
    .toArray();
}

/**
 * Get overall success rate for a game
 */
export async function getGameSuccessRate(gameId: GameId): Promise<number> {
  let stats: (LetterMatchStatistics | OrientationGameStatistics)[] = [];

  if (gameId === 'letter-match') {
    stats = await getLetterMatchStatistics();
  } else if (gameId === 'orientation-game') {
    stats = await getOrientationGameStatistics();
  }

  // Filter out items with no attempts
  const attempted = stats.filter((s) => s.totalAttempts > 0);

  if (attempted.length === 0) {
    return 0;
  }

  // Calculate average success rate
  const totalSuccess = attempted.reduce((sum, s) => sum + s.successRate, 0);
  return totalSuccess / attempted.length;
}

/**
 * Get items that need more practice (low success rate)
 */
export async function getItemsNeedingPractice(
  gameId: GameId,
  threshold: number = 0.7,
  limit: number = 10
): Promise<(LetterMatchStatistics | OrientationGameStatistics)[]> {
  let stats: (LetterMatchStatistics | OrientationGameStatistics)[] = [];

  if (gameId === 'letter-match') {
    stats = await getLetterMatchStatistics();
  } else if (gameId === 'orientation-game') {
    stats = await getOrientationGameStatistics();
  }

  // Filter items below threshold and sort by success rate (lowest first)
  return stats
    .filter((s) => s.totalAttempts > 0 && s.successRate < threshold)
    .sort((a, b) => a.successRate - b.successRate)
    .slice(0, limit);
}

/**
 * Reset statistics for a specific game
 */
export async function resetGameStatistics(gameId: GameId): Promise<void> {
  if (gameId === 'letter-match') {
    await db.letterMatchStatistics.clear();
    await db.initializeLetterMatchStats();
  } else if (gameId === 'orientation-game') {
    await db.orientationGameStatistics.clear();
    await db.initializeOrientationGameStats();
  }
}

/**
 * Export statistics as JSON (for backup/sharing)
 */
export async function exportStatistics(gameId: GameId): Promise<string> {
  let stats: unknown[];

  if (gameId === 'letter-match') {
    stats = await getLetterMatchStatistics();
  } else if (gameId === 'orientation-game') {
    stats = await getOrientationGameStatistics();
  } else {
    stats = [];
  }

  return JSON.stringify(
    {
      gameId,
      exportDate: new Date().toISOString(),
      statistics: stats,
    },
    null,
    2
  );
}
