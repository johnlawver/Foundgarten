/**
 * App Store
 * Global application state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Settings
  soundEnabled: boolean;
  hapticEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';

  // Navigation
  currentGameId: string | null;

  // Offline status
  isOnline: boolean;

  // Actions
  setSoundEnabled: (enabled: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setCurrentGameId: (gameId: string | null) => void;
  setIsOnline: (isOnline: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      soundEnabled: true,
      hapticEnabled: true,
      theme: 'auto',
      currentGameId: null,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,

      // Actions
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setHapticEnabled: (enabled) => set({ hapticEnabled: enabled }),
      setTheme: (theme) => set({ theme }),
      setCurrentGameId: (gameId) => set({ currentGameId: gameId }),
      setIsOnline: (isOnline) => set({ isOnline }),
    }),
    {
      name: 'foundgarten-app-storage',
      partialize: (state) => ({
        // Only persist these fields
        soundEnabled: state.soundEnabled,
        hapticEnabled: state.hapticEnabled,
        theme: state.theme,
      }),
    }
  )
);

// Initialize online/offline detection
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().setIsOnline(true);
  });

  window.addEventListener('offline', () => {
    useAppStore.getState().setIsOnline(false);
  });
}
