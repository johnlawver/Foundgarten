/**
 * Letter Match Game Store (Zustand)
 * Manages game state, rounds, scoring, and configuration
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  LetterMatchState,
  LetterMatchConfig,
  Letter,
} from '@/types/letter-match';
import { DEFAULT_LETTER_MATCH_CONFIG } from '@/types/letter-match';
import {
  generateFirstRound,
  generateAdaptiveRound,
  recordAnswer as recordAnswerToDB,
  initializeLetterStatistics,
} from './utils';
import { useProfileStore } from '@/lib/profiles/store';

export const useLetterMatchStore = create<LetterMatchState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentRound: 0,
      sessionLetters: [],
      currentIndex: 0,
      currentScore: 0,
      roundComplete: false,
      config: DEFAULT_LETTER_MATCH_CONFIG,

      /**
       * Start a new round
       * First round uses all letters, subsequent rounds are adaptive
       */
      startNewRound: async () => {
        const { currentRound, config } = get();
        const nextRound = currentRound + 1;

        // Get active profile
        const activeProfileId = useProfileStore.getState().activeProfileId;
        if (!activeProfileId) {
          console.error('No active profile - cannot start round');
          return;
        }

        // Ensure statistics are initialized for this profile
        await initializeLetterStatistics(activeProfileId);

        let letters: Letter[];

        if (nextRound === 1) {
          // First round: all 26 letters
          letters = generateFirstRound(config);
        } else {
          // Adaptive rounds based on statistics
          letters = await generateAdaptiveRound(config, activeProfileId);
        }

        set({
          currentRound: nextRound,
          sessionLetters: letters,
          currentIndex: 0,
          currentScore: 0,
          roundComplete: false,
        });
      },

      /**
       * Record an answer and move to next letter
       */
      recordAnswer: async (correct: boolean) => {
        const { sessionLetters, currentIndex, currentScore } = get();

        if (currentIndex >= sessionLetters.length) {
          return; // Round already complete
        }

        // Get active profile
        const activeProfileId = useProfileStore.getState().activeProfileId;
        if (!activeProfileId) {
          console.error('No active profile - cannot record answer');
          return;
        }

        const currentLetter = sessionLetters[currentIndex];

        // Record to database
        await recordAnswerToDB(currentLetter, correct, activeProfileId);

        // Update score
        const newScore = correct ? currentScore + 1 : currentScore;

        // Check if round is complete
        const isLastLetter = currentIndex === sessionLetters.length - 1;

        if (isLastLetter) {
          set({
            currentScore: newScore,
            currentIndex: currentIndex + 1,
            roundComplete: true,
          });
        } else {
          set({
            currentScore: newScore,
            currentIndex: currentIndex + 1,
          });
        }
      },

      /**
       * Move to next letter (without recording answer)
       */
      nextLetter: () => {
        const { sessionLetters, currentIndex } = get();

        if (currentIndex < sessionLetters.length - 1) {
          set({ currentIndex: currentIndex + 1 });
        } else {
          set({ roundComplete: true });
        }
      },

      /**
       * Reset the game completely
       */
      resetGame: () => {
        set({
          currentRound: 0,
          sessionLetters: [],
          currentIndex: 0,
          currentScore: 0,
          roundComplete: false,
        });
      },

      /**
       * Update game configuration
       */
      updateConfig: (newConfig: Partial<LetterMatchConfig>) => {
        set((state) => ({
          config: { ...state.config, ...newConfig },
        }));
      },
    }),
    {
      name: 'letter-match-storage',
      partialize: (state) => ({
        currentRound: state.currentRound,
        config: state.config,
      }),
    }
  )
);
