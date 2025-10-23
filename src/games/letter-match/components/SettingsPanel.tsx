/**
 * SettingsPanel Component
 * Configuration options for Letter Match game
 */

import { useState } from 'react';
import { useLetterMatchStore } from '../store';
import { resetAllStatistics } from '../utils';
import { useProfileStore } from '@/lib/profiles/store';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';

interface SettingsPanelProps {
  onClose: () => void;
  onViewProgress?: () => void;
}

export function SettingsPanel({ onClose, onViewProgress }: SettingsPanelProps) {
  const { config, updateConfig, resetGame } = useLetterMatchStore();
  const { activeProfileId, getActiveProfile } = useProfileStore();
  const activeProfile = getActiveProfile();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetProgress = async () => {
    if (!activeProfileId) {
      console.error('No active profile');
      return;
    }
    await resetAllStatistics(activeProfileId);
    resetGame();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" id="letter-match-settings-overlay">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6" id="letter-match-settings-panel">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-[3px] border-black">
          <h2 className="text-2xl font-black text-black">
            ⚙️ Settings
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-coral-400 border-[3px] border-black flex items-center justify-center hover:bg-coral-500 active:bg-coral-600 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            aria-label="Close"
            id="letter-match-settings-close-button"
          >
            <span className="text-xl font-black">✕</span>
          </button>
        </div>

        {/* Settings content */}
        <div className="space-y-6">
          {/* Difficulty */}
          <div id="letter-match-difficulty-setting">
            <label className="block text-sm font-bold text-black mb-3">
              Difficulty
            </label>
            <div className="flex gap-2">
              {(['easy', 'auto', 'hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => updateConfig({ difficulty })}
                  className={`flex-1 py-2 px-4 rounded-full font-bold transition-all border-[2px] border-black ${
                    config.difficulty === difficulty
                      ? 'bg-yellow-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black hover:bg-yellow-100'
                  }`}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-black mt-2 bg-yellow-50 p-2 rounded-xl border-[2px] border-black">
              {config.difficulty === 'easy' && '📊 Even distribution of all letters'}
              {config.difficulty === 'auto' && '🎯 Adaptive - focuses on struggling letters'}
              {config.difficulty === 'hard' && '🔥 Heavily focuses on incorrect letters'}
            </p>
          </div>

          {/* Letter Case */}
          <div id="letter-match-case-setting">
            <label className="block text-sm font-bold text-black mb-3">
              Letter Case
            </label>
            <div className="flex gap-2">
              {(['both', 'uppercase', 'lowercase'] as const).map((letterCase) => (
                <button
                  key={letterCase}
                  onClick={() => updateConfig({ letterCase })}
                  className={`flex-1 py-2 px-4 rounded-full font-bold transition-all border-[2px] border-black ${
                    config.letterCase === letterCase
                      ? 'bg-teal-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black hover:bg-teal-100'
                  }`}
                >
                  {letterCase === 'both'
                    ? 'Both'
                    : letterCase === 'uppercase'
                    ? 'ABC'
                    : 'abc'}
                </button>
              ))}
            </div>
          </div>

          {/* Round Size */}
          <div id="letter-match-round-size-setting">
            <label className="block text-sm font-bold text-black mb-3">
              Round Size: <span className="bg-coral-200 px-3 py-1 rounded-full border-[2px] border-black">{config.roundSize}</span> letters
            </label>
            <input
              type="range"
              min="10"
              max="26"
              value={config.roundSize}
              onChange={(e) =>
                updateConfig({ roundSize: parseInt(e.target.value) })
              }
              className="w-full h-3 bg-yellow-100 rounded-lg appearance-none cursor-pointer border-[2px] border-black"
              id="letter-match-round-size-slider"
              style={{
                accentColor: '#facc15',
              }}
            />
            <div className="flex justify-between text-xs font-bold text-black mt-2">
              <span>10 min</span>
              <span>26 max</span>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-black">
              🔊 Sound Effects
            </label>
            <button
              onClick={() =>
                updateConfig({ soundEnabled: !config.soundEnabled })
              }
              className={`relative w-14 h-8 rounded-full transition-colors border-[3px] border-black ${
                config.soundEnabled ? 'bg-teal-400' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform border-[2px] border-black ${
                  config.soundEnabled ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Haptic Feedback */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-black">
              📳 Haptic Feedback
            </label>
            <button
              onClick={() =>
                updateConfig({ hapticEnabled: !config.hapticEnabled })
              }
              className={`relative w-14 h-8 rounded-full transition-colors border-[3px] border-black ${
                config.hapticEnabled ? 'bg-teal-400' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform border-[2px] border-black ${
                  config.hapticEnabled ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* View Progress */}
          {onViewProgress && (
            <div className="pt-4 border-t-[3px] border-black">
              <Button
                variant="secondary"
                onClick={() => {
                  onClose();
                  onViewProgress();
                }}
                className="w-full !bg-teal-200 hover:!bg-teal-300 !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                id="letter-match-settings-view-progress-button"
              >
                📊 View Letter Progress
              </Button>
            </div>
          )}

          {/* Reset Progress */}
          <div className="pt-4 border-t-[3px] border-black">
            {!showResetConfirm ? (
              <Button
                variant="ghost"
                onClick={() => setShowResetConfirm(true)}
                className="w-full !border-coral-400 !text-coral-600 hover:!bg-coral-50"
                id="letter-match-reset-progress-button"
              >
                🗑️ Reset Progress
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="bg-coral-100 p-4 rounded-2xl border-[2px] border-black">
                  <p className="text-sm font-bold text-black text-center">
                    ⚠️ Are you sure? This will erase all statistics for{' '}
                    {activeProfile && (
                      <span className="inline-flex items-center gap-1">
                        <span>{activeProfile.emoji}</span>
                        <span className="font-black">{activeProfile.name}</span>
                      </span>
                    )}!
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <button
                    onClick={handleResetProgress}
                    className="flex-1 px-6 py-3 bg-coral-400 text-black font-bold rounded-full border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all min-h-[56px]"
                    id="letter-match-confirm-reset-button"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Close button */}
        <div className="mt-6 pt-4 border-t-[3px] border-black">
          <Button variant="primary" onClick={onClose} className="w-full" id="letter-match-settings-done-button">
            ✓ Done
          </Button>
        </div>
      </Card>
    </div>
  );
}
