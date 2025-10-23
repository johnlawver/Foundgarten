/**
 * ProfileCreateModal Component
 * Modal for creating new child profiles
 */

import { useState } from 'react';
import { useProfileStore } from '@/lib/profiles/store';
import { Button } from './Button';

interface ProfileCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstRun?: boolean;
}

// Emoji options for profile avatars
const EMOJI_OPTIONS = [
  '😊', '😎', '🤓', '🥳', '🤗', '🤩',
  '🦄', '🦖', '🦁', '🐼', '🐨', '🐧',
  '🚀', '⭐', '🌈', '🎨', '🎮', '⚽',
  '🎸', '🎭', '🦸', '🧙', '👑', '💎',
];

export function ProfileCreateModal({ isOpen, onClose, isFirstRun = false }: ProfileCreateModalProps) {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);
  const [isCreating, setIsCreating] = useState(false);
  const { createProfile } = useProfileStore();

  const handleCreate = async () => {
    if (!name.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      await createProfile(name.trim(), selectedEmoji);
      setName('');
      setSelectedEmoji(EMOJI_OPTIONS[0]);
      onClose();
    } catch (error) {
      console.error('Failed to create profile:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleCreate();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className="w-full max-w-md bg-white rounded-[32px] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        id="profile-create-modal"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-yellow-300 border-b-[3px] border-black relative">
          {/* Decorative icon */}
          <div className="inline-flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-yellow-400 rounded-2xl border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transform -rotate-6">
              <span className="text-3xl">
                {isFirstRun ? '👋' : '➕'}
              </span>
            </div>
            <h2 className="text-3xl font-black text-black">
              {isFirstRun ? 'Welcome!' : 'Add Profile'}
            </h2>
          </div>
          {isFirstRun && (
            <p className="text-sm font-semibold text-gray-700 mt-2">
              Let's create a profile for your child to track their learning progress.
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Privacy Notice */}
          <div className="bg-teal-200 rounded-2xl p-4 border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-sm font-bold text-black">
              <span className="text-lg">🔒</span> All profiles and learning data are stored
              only on this device and are never transferred anywhere.
            </p>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-base font-black text-black mb-3">
              Child's Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter name..."
              maxLength={20}
              className="w-full px-5 py-4 text-xl font-bold bg-white border-[3px] border-black rounded-2xl focus:outline-none focus:ring-0 focus:shadow-[0_0_0_4px_rgba(253,224,71,0.5)] transition-shadow"
              autoFocus
              id="profile-name-input"
            />
          </div>

          {/* Emoji Selector */}
          <div>
            <label className="block text-base font-black text-black mb-3">
              Choose an Avatar
            </label>
            <div className="grid grid-cols-6 gap-3">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-14 h-14 text-3xl rounded-xl border-[3px] transition-all ${
                    selectedEmoji === emoji
                      ? 'border-black bg-yellow-300 scale-110 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'border-gray-400 bg-white hover:border-black hover:bg-yellow-50 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                  type="button"
                  id={`emoji-option-${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center gap-4 p-5 bg-white rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-16 h-16 bg-yellow-200 rounded-2xl border-[2px] border-black flex items-center justify-center">
              <span className="text-5xl">{selectedEmoji}</span>
            </div>
            <div className="text-2xl font-black text-black">
              {name || 'Preview'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-gray-100 border-t-[3px] border-black flex gap-3">
          {!isFirstRun && (
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isCreating}
              className="flex-1"
              id="profile-create-cancel"
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={!name.trim() || isCreating}
            className={`${isFirstRun ? 'w-full' : 'flex-1'} !bg-teal-300 hover:!bg-teal-400 !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:!shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
            id="profile-create-submit"
          >
            {isCreating ? 'Creating...' : isFirstRun ? '🎮 Get Started' : 'Create Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
}
