/**
 * ProfileSelector Component
 * Dropdown/modal to switch between child profiles
 */

import { useState } from 'react';
import { useProfileStore } from '@/lib/profiles/store';
import { ProfileCreateModal } from './ProfileCreateModal';

export function ProfileSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
  const { profiles, activeProfileId, setActiveProfile, deleteProfile, getActiveProfile } = useProfileStore();
  const activeProfile = getActiveProfile();

  const handleSelectProfile = async (profileId: number) => {
    await setActiveProfile(profileId);
    setIsOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, profileId: number) => {
    e.stopPropagation();
    setProfileToDelete(profileId);
  };

  const handleConfirmDelete = async () => {
    if (profileToDelete) {
      await deleteProfile(profileToDelete);
      setProfileToDelete(null);
      setIsOpen(false);
    }
  };

  if (!activeProfile) {
    return null;
  }

  return (
    <div className="relative" id="profile-selector">
      {/* Active Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
        aria-label="Select profile"
        id="profile-selector-button"
      >
        <span className="text-2xl">{activeProfile.emoji}</span>
        <span className="text-sm font-bold text-black">{activeProfile.name}</span>
        <span className="text-xs">▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50"
            id="profile-selector-menu"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-yellow-200 border-b-[3px] border-black">
              <h3 className="text-sm font-black text-black">Switch Profile</h3>
              <p className="text-xs text-gray-700 mt-1">
                Profiles are stored on this device only
              </p>
            </div>

            {/* Profile List */}
            <div className="max-h-64 overflow-y-auto">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-50 transition-colors border-b-[2px] border-gray-200 ${
                    profile.id === activeProfileId ? 'bg-yellow-100' : ''
                  }`}
                >
                  <button
                    onClick={() => handleSelectProfile(profile.id!)}
                    className="flex-1 flex items-center gap-3 text-left"
                    id={`profile-option-${profile.id}`}
                  >
                    <span className="text-3xl">{profile.emoji}</span>
                    <div className="flex-1">
                      <div className="text-base font-bold text-black">
                        {profile.name}
                      </div>
                      {profile.id === activeProfileId && (
                        <div className="text-xs text-teal-600 font-semibold">
                          ✓ Active
                        </div>
                      )}
                    </div>
                  </button>
                  {profiles.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteClick(e, profile.id!)}
                      className="w-8 h-8 rounded-lg bg-coral-200 border-[2px] border-black flex items-center justify-center hover:bg-coral-300 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                      aria-label="Delete profile"
                      id={`delete-profile-${profile.id}`}
                    >
                      <span className="text-sm font-black">🗑️</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Profile Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                setShowCreateModal(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-100 hover:bg-teal-200 border-t-[3px] border-black transition-colors"
              id="add-profile-button"
            >
              <span className="text-xl">➕</span>
              <span className="text-sm font-bold text-black">Add Profile</span>
            </button>
          </div>
        </>
      )}

      {/* Profile Create Modal */}
      <ProfileCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        isFirstRun={false}
      />

      {/* Delete Confirmation Modal */}
      {profileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-sm bg-white rounded-[24px] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-coral-200 rounded-2xl border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-3xl sm:text-4xl">⚠️</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-black mb-2">Delete Profile?</h3>
              <p className="text-xs sm:text-sm font-bold text-black">
                This will permanently delete{' '}
                <span className="inline-flex items-center gap-1">
                  <span>{profiles.find(p => p.id === profileToDelete)?.emoji}</span>
                  <span className="font-black">{profiles.find(p => p.id === profileToDelete)?.name}</span>
                </span>
                's profile and all their learning data.
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setProfileToDelete(null)}
                className="flex-1 px-4 py-3 bg-white text-black font-bold rounded-full border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all min-h-[48px]"
                id="cancel-delete-profile"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-3 bg-coral-400 text-black font-bold rounded-full border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all min-h-[48px]"
                id="confirm-delete-profile"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
