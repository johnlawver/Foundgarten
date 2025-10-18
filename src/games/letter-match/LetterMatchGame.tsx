/**
 * Letter Match Game - Main Game Component
 * Swipe-based letter recognition game
 */

import { useEffect, useState } from 'react';
import { useLetterMatchStore } from './store';
import { SwipeCard } from './components/SwipeCard';
import { RoundSummary } from './components/RoundSummary';
import { SettingsPanel } from './components/SettingsPanel';
import { GameContainer } from '@/components/shared/GameContainer';
import { Button } from '@/components/shared/Button';
import type { SwipeDirection } from '@/types/letter-match';

export function LetterMatchGame() {
  const {
    currentRound,
    sessionLetters,
    currentIndex,
    currentScore,
    roundComplete,
    startNewRound,
    recordAnswer,
  } = useLetterMatchStore();

  const [showSettings, setShowSettings] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // Auto-start first round if not started
  useEffect(() => {
    if (currentRound === 0 && !isStarted) {
      // Show welcome screen first
      return;
    }
  }, [currentRound, isStarted]);

  const handleStart = async () => {
    await startNewRound();
    setIsStarted(true);
  };

  const handleSwipe = async (direction: SwipeDirection) => {
    if (direction === null) return;

    const correct = direction === 'right';
    await recordAnswer(correct);

    // Haptic feedback if supported
    if ('vibrate' in navigator && correct) {
      navigator.vibrate(50);
    }
  };

  const handlePlayAgain = async () => {
    await startNewRound();
    setIsStarted(true);
  };

  const handleBack = () => {
    if ((window as any).navigateToHome) {
      (window as any).navigateToHome();
    }
  };

  const currentLetter = sessionLetters[currentIndex];
  const totalLetters = sessionLetters.length;
  const progress = totalLetters > 0 ? `${currentIndex} / ${totalLetters}` : '0 / 0';

  // Welcome screen
  if (!isStarted || currentRound === 0) {
    return (
      <GameContainer
        title="Letter Match"
        onBack={handleBack}
      >
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🔤</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Letter Match
            </h2>
            <p className="text-gray-600 mb-2">
              Show your child the letter
            </p>
            <p className="text-gray-600 mb-2">
              Ask: "What letter is this?"
            </p>
            <p className="text-gray-600">
              Swipe ➡️ if correct, ⬅️ if incorrect
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={handleStart}
              className="w-48"
            >
              Start Round
            </Button>

            <Button
              variant="secondary"
              onClick={() => setShowSettings(true)}
              className="w-48"
            >
              ⚙️ Settings
            </Button>
          </div>
        </div>

        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </GameContainer>
    );
  }

  // Round summary screen
  if (roundComplete) {
    return (
      <RoundSummary
        totalAttempts={totalLetters}
        correctCount={currentScore}
        incorrectCount={totalLetters - currentScore}
        roundNumber={currentRound}
        onPlayAgain={handlePlayAgain}
        onHome={handleBack}
        onSettings={() => setShowSettings(true)}
      />
    );
  }

  // Active gameplay
  return (
    <GameContainer
      title="Letter Match"
      onBack={handleBack}
    >
      {/* Header - Score and Settings */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => setShowSettings(true)}
          className="text-2xl hover:opacity-70 transition-opacity"
          aria-label="Settings"
        >
          ⚙️
        </button>

        <div className="text-lg font-semibold text-gray-700">
          Score: {currentScore} / {currentIndex}
        </div>
      </div>

      {/* Main game area - Swipe card */}
      <div className="flex-1 flex items-center justify-center px-6">
        {currentLetter && (
          <SwipeCard
            letter={currentLetter}
            onSwipe={handleSwipe}
          />
        )}
      </div>

      {/* Progress footer */}
      <div className="px-6 py-4 text-center">
        <div className="text-sm text-gray-500">
          Round {currentRound} • {progress}
        </div>
      </div>

      {/* Settings panel overlay */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </GameContainer>
  );
}
