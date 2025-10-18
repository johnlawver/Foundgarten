/**
 * Adaptive Learning Algorithm: Weighted Random Selection
 *
 * Items with lower success rates appear more frequently
 * to reinforce learning through targeted repetition.
 */

import type { GameStatistics, WeightedItem, Difficulty } from '@/types/game';

/**
 * Calculate weight for an item based on its statistics
 * Lower success rate = higher weight = more likely to appear
 */
export function calculateWeight(stat: GameStatistics): number {
  // If never attempted, give high priority
  if (stat.totalAttempts === 0) {
    return 1.0;
  }

  // Base error weight: 1 - successRate
  // Items with 0% success = weight of 1.0
  // Items with 50% success = weight of 0.5
  // Items with 100% success = weight of 0.0
  const errorWeight = 1 - stat.successRate;

  // Recent attempts boost
  // Show recently missed items more frequently
  const daysSinceLastAttempt =
    (Date.now() - new Date(stat.lastAttempt).getTime()) / (1000 * 60 * 60 * 24);

  const recencyBoost = daysSinceLastAttempt > 7 ? 1.2 : 1.0;

  // Minimum weight to ensure even mastered items occasionally appear
  const minimumWeight = 0.1;

  return Math.max(errorWeight * recencyBoost, minimumWeight);
}

/**
 * Adjust weights based on difficulty setting
 */
export function adjustWeightsForDifficulty(
  weights: WeightedItem[],
  difficulty: Difficulty
): WeightedItem[] {
  switch (difficulty) {
    case 'easy':
      // Flatten weights for more even distribution
      return weights.map((w) => ({
        ...w,
        weight: 0.3 + w.weight * 0.7, // Brings all weights closer to 1.0
      }));

    case 'hard':
      // Amplify weights to focus heavily on struggling items
      return weights.map((w) => ({
        ...w,
        weight: Math.pow(w.weight, 1.5), // Squares weight differences
      }));

    case 'auto':
    default:
      // No adjustment
      return weights;
  }
}

/**
 * Normalize weights to sum to 1.0 (probability distribution)
 */
export function normalizeWeights(weights: WeightedItem[]): WeightedItem[] {
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);

  if (totalWeight === 0) {
    // If all weights are 0, distribute evenly
    const evenWeight = 1 / weights.length;
    return weights.map((w) => ({ ...w, weight: evenWeight }));
  }

  return weights.map((w) => ({
    ...w,
    weight: w.weight / totalWeight,
  }));
}

/**
 * Select items using weighted random selection
 *
 * @param weights - Array of items with weights
 * @param count - Number of items to select
 * @param allowDuplicates - Whether to allow same item multiple times
 * @returns Selected item IDs
 */
export function weightedRandomSelection(
  weights: WeightedItem[],
  count: number,
  allowDuplicates: boolean = false
): string[] {
  if (weights.length === 0) {
    return [];
  }

  // Normalize weights
  const normalized = normalizeWeights(weights);

  const selected: string[] = [];
  const available = [...normalized];

  for (let i = 0; i < count && available.length > 0; i++) {
    // Generate random number between 0 and 1
    let random = Math.random();

    // Select item based on cumulative probability
    let cumulativeWeight = 0;
    let selectedIndex = 0;

    for (let j = 0; j < available.length; j++) {
      cumulativeWeight += available[j].weight;
      if (random <= cumulativeWeight) {
        selectedIndex = j;
        break;
      }
    }

    // Add selected item
    selected.push(available[selectedIndex].itemId);

    // Remove from available pool if duplicates not allowed
    if (!allowDuplicates) {
      available.splice(selectedIndex, 1);
      // Re-normalize remaining weights
      const remaining = normalizeWeights(available);
      available.splice(0, available.length, ...remaining);
    }
  }

  return selected;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate round items based on statistics
 *
 * @param statistics - Game statistics array
 * @param roundSize - Number of items in round
 * @param difficulty - Difficulty setting
 * @returns Array of selected item IDs
 */
export function generateRoundItems(
  statistics: GameStatistics[],
  roundSize: number,
  difficulty: Difficulty = 'auto'
): string[] {
  // Calculate weights for all items
  let weights: WeightedItem[] = statistics.map((stat) => ({
    itemId: stat.itemId,
    weight: calculateWeight(stat),
  }));

  // Adjust for difficulty
  weights = adjustWeightsForDifficulty(weights, difficulty);

  // Select items using weighted selection
  const selectedIds = weightedRandomSelection(
    weights,
    Math.min(roundSize, statistics.length),
    false
  );

  // Shuffle to randomize order (weights only affect selection, not order)
  return shuffleArray(selectedIds);
}

/**
 * Calculate recommended round size based on performance
 *
 * Better performance = shorter rounds (mastery)
 * Worse performance = longer rounds (more practice needed)
 */
export function calculateRecommendedRoundSize(
  averageSuccessRate: number,
  minSize: number = 10,
  maxSize: number = 26
): number {
  // Higher success rate = smaller rounds
  // Lower success rate = larger rounds
  const normalized = 1 - averageSuccessRate; // Invert so low success = high value
  const range = maxSize - minSize;
  const recommended = minSize + Math.floor(normalized * range);

  return Math.max(minSize, Math.min(maxSize, recommended));
}
