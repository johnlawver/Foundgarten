/**
 * SettingsPanel Component
 * Configuration options for Letter Match game
 */

import { useState } from 'react';
import { useLetterMatchStore } from '../store';
import { resetAllStatistics } from '../utils';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { config, updateConfig, resetGame } = useLetterMatchStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetProgress = async () => {
    await resetAllStatistics();
    resetGame();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Letter Match Settings
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Settings content */}
        <div className="space-y-6">
          {/* Difficulty */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Difficulty
            </label>
            <div className="flex gap-2">
              {(['easy', 'auto', 'hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => updateConfig({ difficulty })}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    config.difficulty === difficulty
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {config.difficulty === 'easy' && 'Even distribution of all letters'}
              {config.difficulty === 'auto' && 'Adaptive - focuses on struggling letters'}
              {config.difficulty === 'hard' && 'Heavily focuses on incorrect letters'}
            </p>
          </div>

          {/* Letter Case */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Letter Case
            </label>
            <div className="flex gap-2">
              {(['both', 'uppercase', 'lowercase'] as const).map((letterCase) => (
                <button
                  key={letterCase}
                  onClick={() => updateConfig({ letterCase })}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    config.letterCase === letterCase
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Round Size: {config.roundSize} letters
            </label>
            <input
              type="range"
              min="10"
              max="26"
              value={config.roundSize}
              onChange={(e) =>
                updateConfig({ roundSize: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>10</span>
              <span>26</span>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Sound Effects
            </label>
            <button
              onClick={() =>
                updateConfig({ soundEnabled: !config.soundEnabled })
              }
              className={`relative w-14 h-8 rounded-full transition-colors ${
                config.soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  config.soundEnabled ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Haptic Feedback */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Haptic Feedback
            </label>
            <button
              onClick={() =>
                updateConfig({ hapticEnabled: !config.hapticEnabled })
              }
              className={`relative w-14 h-8 rounded-full transition-colors ${
                config.hapticEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  config.hapticEnabled ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Reset Progress */}
          <div className="pt-4 border-t border-gray-200">
            {!showResetConfirm ? (
              <Button
                variant="secondary"
                onClick={() => setShowResetConfirm(true)}
                className="w-full text-red-600 hover:bg-red-50"
              >
                Reset Progress
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-700 text-center">
                  Are you sure? This will erase all statistics.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleResetProgress}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Confirm Reset
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Close button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button variant="primary" onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
}
