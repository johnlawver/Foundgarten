/**
 * Letter Match Game Utilities
 * Helper functions for round generation, adaptive learning, and statistics
 */

import { db } from '@/lib/storage/db';
import { weightedRandomSelection } from '@/lib/learning/weighted-selection';
import type { LetterMatchStatistics, LetterMatchConfig, WeightedItem } from '@/types/game';
import type { Letter } from '@/types/letter-match';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Generate the first round with all 26 letters
 * Random mix of uppercase and lowercase
 */
export function generateFirstRound(config: LetterMatchConfig): Letter[] {
  const letters: Letter[] = [];

  for (const char of ALPHABET) {
    let caseType: 'uppercase' | 'lowercase';

    if (config.letterCase === 'both') {
      // Randomly choose uppercase or lowercase
      caseType = Math.random() > 0.5 ? 'uppercase' : 'lowercase';
    } else if (config.letterCase === 'uppercase') {
      caseType = 'uppercase';
    } else {
      caseType = 'lowercase';
    }

    const character =
      caseType === 'uppercase' ? char : char.toLowerCase();

    letters.push({ character, caseType });
  }

  // Shuffle the array
  return shuffleArray(letters);
}

/**
 * Generate an adaptive round based on statistics
 * Uses weighted selection to prioritize struggling letters
 */
export async function generateAdaptiveRound(
  config: LetterMatchConfig,
  profileId: number
): Promise<Letter[]> {
  // Fetch statistics for this profile only
  const allStats = await db.letterMatchStatistics
    .where('profileId')
    .equals(profileId)
    .toArray();

  // Calculate weights for each letter
  const weightedLetters: Array<Letter & { weight: number }> = [];

  for (const char of ALPHABET) {
    const casesToConsider: Array<'uppercase' | 'lowercase'> = [];

    if (config.letterCase === 'both') {
      casesToConsider.push('uppercase', 'lowercase');
    } else if (config.letterCase === 'uppercase') {
      casesToConsider.push('uppercase');
    } else {
      casesToConsider.push('lowercase');
    }

    for (const caseType of casesToConsider) {
      const stat = allStats.find(
        (s) => s.letter === char && s.caseType === caseType
      );

      const weight = calculateWeight(stat, config.difficulty);
      const character =
        caseType === 'uppercase' ? char : char.toLowerCase();

      weightedLetters.push({
        character,
        caseType,
        weight,
      });
    }
  }

  // Convert to WeightedItem format for selection
  const weightedItems: WeightedItem[] = weightedLetters.map((item, idx) => ({
    itemId: `${item.character}-${item.caseType}-${idx}`,
    weight: item.weight,
  }));

  // Use weighted selection to pick letters
  const selectedIds = weightedRandomSelection(weightedItems, config.roundSize, false);

  // Map back to Letter objects
  const selectedLetters = selectedIds.map(id => {
    const parts = id.split('-');
    const char = parts[0];
    const caseType = parts[1] as 'uppercase' | 'lowercase';
    return weightedLetters.find(l => l.character === char && l.caseType === caseType)!;
  }).filter(Boolean).map(({ character, caseType }) => ({ character, caseType }));

  return shuffleArray(selectedLetters);
}

/**
 * Calculate weight for a letter based on statistics and difficulty
 * Higher weight = more likely to appear
 */
function calculateWeight(
  stat: LetterMatchStatistics | undefined,
  difficulty: LetterMatchConfig['difficulty']
): number {
  if (!stat || stat.totalAttempts === 0) {
    // Never seen before, high priority
    return 1.0;
  }

  // Base error weight (1 - successRate)
  // 0% success = weight 1.0
  // 100% success = weight 0.0
  const errorWeight = 1 - stat.successRate;

  // Recency boost: show recently attempted letters
  const daysSinceLastAttempt =
    (Date.now() - new Date(stat.lastAttempt).getTime()) /
    (1000 * 60 * 60 * 24);
  const recencyBoost = daysSinceLastAttempt > 7 ? 1.2 : 1.0;

  let finalWeight = errorWeight * recencyBoost;

  // Apply difficulty modifiers
  if (difficulty === 'easy') {
    // Flatten weights - more even distribution
    finalWeight = 0.5 + finalWeight * 0.5;
  } else if (difficulty === 'hard') {
    // Amplify weights - focus heavily on struggling letters
    finalWeight = Math.pow(finalWeight, 0.7);
  }

  // Ensure minimum weight so all letters can appear
  return Math.max(0.1, finalWeight);
}

/**
 * Record an answer to the database
 */
export async function recordAnswer(
  letter: Letter,
  correct: boolean,
  profileId: number
): Promise<void> {
  const upperLetter = letter.character.toUpperCase();

  // Find existing stat for this profile
  let stat = await db.letterMatchStatistics
    .where('[profileId+letter+caseType]')
    .equals([profileId, upperLetter, letter.caseType])
    .first();

  if (!stat) {
    // Create new stat entry
    stat = {
      gameId: 'letter-match',
      profileId,
      itemId: `${upperLetter}-${letter.caseType}`,
      letter: upperLetter,
      caseType: letter.caseType as any, // Type assertion for 'both' | 'n/a' compatibility
      totalAttempts: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastAttempt: new Date(),
      successRate: 0,
    };
  }

  // Update counts
  stat.totalAttempts++;
  if (correct) {
    stat.correctCount++;
  } else {
    stat.incorrectCount++;
  }

  // Recalculate success rate
  stat.successRate = stat.correctCount / stat.totalAttempts;
  stat.lastAttempt = new Date();

  // Save to database
  await db.letterMatchStatistics.put(stat);
}

/**
 * Initialize default statistics for all letters for a specific profile
 */
export async function initializeLetterStatistics(profileId: number): Promise<void> {
  // Check if stats already exist for this profile
  const existingStats = await db.letterMatchStatistics
    .where('profileId')
    .equals(profileId)
    .count();

  // Only initialize if no stats exist for this profile
  if (existingStats > 0) return;

  const stats: LetterMatchStatistics[] = [];

  for (const letter of ALPHABET) {
    for (const caseType of ['uppercase', 'lowercase'] as const) {
      stats.push({
        gameId: 'letter-match',
        profileId,
        itemId: `${letter}-${caseType}`,
        letter,
        caseType: caseType as any, // Type assertion for CaseType compatibility
        totalAttempts: 0,
        correctCount: 0,
        incorrectCount: 0,
        lastAttempt: new Date(),
        successRate: 0,
      });
    }
  }

  await db.letterMatchStatistics.bulkAdd(stats);
}

/**
 * Reset all letter statistics for a specific profile
 */
export async function resetAllStatistics(profileId: number): Promise<void> {
  await db.letterMatchStatistics
    .where('profileId')
    .equals(profileId)
    .delete();
  await initializeLetterStatistics(profileId);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
