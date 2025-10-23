/**
 * Profile Store (Zustand)
 * Manages child profiles and active profile selection
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, type Profile } from '@/lib/storage/db';

interface ProfileState {
  activeProfileId: number | null;
  profiles: Profile[];
  isLoading: boolean;

  // Actions
  loadProfiles: () => Promise<void>;
  setActiveProfile: (profileId: number) => Promise<void>;
  createProfile: (name: string, emoji: string) => Promise<Profile>;
  updateProfile: (id: number, name: string, emoji: string) => Promise<void>;
  deleteProfile: (id: number) => Promise<void>;
  getActiveProfile: () => Profile | null;
  hasProfiles: () => boolean;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      activeProfileId: null,
      profiles: [],
      isLoading: false,

      /**
       * Load all profiles from database
       */
      loadProfiles: async () => {
        set({ isLoading: true });
        try {
          const profiles = await db.profiles.toArray();
          set({ profiles, isLoading: false });

          // If no active profile set but profiles exist, set first as active
          const { activeProfileId } = get();
          if (!activeProfileId && profiles.length > 0) {
            set({ activeProfileId: profiles[0].id! });
          }
        } catch (error) {
          console.error('Failed to load profiles:', error);
          set({ isLoading: false });
        }
      },

      /**
       * Set the active profile
       */
      setActiveProfile: async (profileId: number) => {
        const { profiles } = get();
        const profile = profiles.find(p => p.id === profileId);

        if (profile) {
          set({ activeProfileId: profileId });

          // Store in app settings for persistence across sessions
          await db.appSettings.put({
            key: 'activeProfileId',
            value: profileId.toString(),
          });
        }
      },

      /**
       * Create a new profile
       */
      createProfile: async (name: string, emoji: string) => {
        const newProfile: Omit<Profile, 'id'> = {
          name,
          emoji,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const id = await db.profiles.add(newProfile);
        const profile = { ...newProfile, id };

        set((state) => ({
          profiles: [...state.profiles, profile],
        }));

        // If this is the first profile, set it as active
        const { activeProfileId } = get();
        if (!activeProfileId) {
          await get().setActiveProfile(id);
        }

        return profile;
      },

      /**
       * Update an existing profile
       */
      updateProfile: async (id: number, name: string, emoji: string) => {
        await db.profiles.update(id, {
          name,
          emoji,
          updatedAt: new Date(),
        });

        set((state) => ({
          profiles: state.profiles.map(p =>
            p.id === id
              ? { ...p, name, emoji, updatedAt: new Date() }
              : p
          ),
        }));
      },

      /**
       * Delete a profile and its associated statistics
       */
      deleteProfile: async (id: number) => {
        const { activeProfileId, profiles } = get();

        // Delete profile from database
        await db.profiles.delete(id);

        // Delete all associated statistics
        await db.letterMatchStatistics.where('profileId').equals(id).delete();
        await db.orientationGameStatistics.where('profileId').equals(id).delete();

        // Update state
        const remainingProfiles = profiles.filter(p => p.id !== id);
        set({ profiles: remainingProfiles });

        // If we deleted the active profile, switch to another one
        if (activeProfileId === id) {
          if (remainingProfiles.length > 0) {
            await get().setActiveProfile(remainingProfiles[0].id!);
          } else {
            set({ activeProfileId: null });
          }
        }
      },

      /**
       * Get the currently active profile
       */
      getActiveProfile: () => {
        const { activeProfileId, profiles } = get();
        return profiles.find(p => p.id === activeProfileId) || null;
      },

      /**
       * Check if any profiles exist
       */
      hasProfiles: () => {
        return get().profiles.length > 0;
      },
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({
        activeProfileId: state.activeProfileId,
      }),
    }
  )
);

/**
 * Initialize profile store on app start
 */
export async function initializeProfileStore() {
  const store = useProfileStore.getState();
  await store.loadProfiles();

  // Restore active profile from settings if exists
  const activeProfileSetting = await db.appSettings
    .where('key')
    .equals('activeProfileId')
    .first();

  if (activeProfileSetting && activeProfileSetting.value) {
    const profileId = parseInt(activeProfileSetting.value, 10);
    if (!isNaN(profileId)) {
      await store.setActiveProfile(profileId);
    }
  }
}
