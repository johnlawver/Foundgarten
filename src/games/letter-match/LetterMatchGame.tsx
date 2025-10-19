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

  const handleSwipe = (direction: SwipeDirection) => {
    if (direction === null) return;

    const correct = direction === 'right';

    // Record answer asynchronously (don't block UI)
    recordAnswer(correct).then(() => {
      // Haptic feedback if supported
      if ('vibrate' in navigator && correct) {
        navigator.vibrate(50);
      }
    });
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
          {/* Icon with playful rotation */}
          <div className="mb-8">
            <div className="w-28 h-28 bg-yellow-300 rounded-3xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transform rotate-6 mx-auto mb-6">
              <span className="text-6xl">🔤</span>
            </div>

            <h2 className="text-4xl font-black text-black mb-6">
              Letter Match
            </h2>

            {/* Instructions card */}
            <div className="bg-white rounded-[32px] border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md mx-auto mb-8">
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-200 rounded-xl border-[2px] border-black flex items-center justify-center shrink-0">
                    <span className="text-xl">1</span>
                  </div>
                  <p className="text-base font-semibold text-black">
                    Show your child the letter
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-200 rounded-xl border-[2px] border-black flex items-center justify-center shrink-0">
                    <span className="text-xl">2</span>
                  </div>
                  <p className="text-base font-semibold text-black">
                    Ask: "What letter is this?"
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-coral-200 rounded-xl border-[2px] border-black flex items-center justify-center shrink-0">
                    <span className="text-xl">3</span>
                  </div>
                  <p className="text-base font-semibold text-black">
                    Swipe ➡️ correct, ⬅️ incorrect
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 w-full max-w-xs">
            <Button
              variant="primary"
              onClick={handleStart}
              className="w-full !bg-teal-200 hover:!bg-teal-300 active:!bg-teal-400"
              id="letter-match-start-button"
            >
              🎮 Start Round
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowSettings(true)}
              className="w-full"
              id="letter-match-welcome-settings-button"
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
      <>
        <RoundSummary
          totalAttempts={totalLetters}
          correctCount={currentScore}
          incorrectCount={totalLetters - currentScore}
          roundNumber={currentRound}
          onPlayAgain={handlePlayAgain}
          onHome={handleBack}
          onSettings={() => setShowSettings(true)}
        />

        {/* Settings panel overlay */}
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </>
    );
  }

  // Active gameplay
  return (
    <GameContainer
      title="Letter Match"
      onBack={handleBack}
    >
      {/* Header - Score and Settings */}
      <div className="w-full flex items-center justify-between px-6 py-4">
        <button
          onClick={() => setShowSettings(true)}
          className="w-14 h-14 bg-yellow-300 rounded-2xl border-[3px] border-black flex items-center justify-center hover:bg-yellow-400 active:bg-yellow-500 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
          aria-label="Settings"
          id="letter-match-settings-button"
        >
          <span className="text-2xl">⚙️</span>
        </button>

        <div
          className="bg-white px-5 py-2 rounded-full border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          id="letter-match-score-display"
        >
          <span className="text-lg font-black text-black">
            {currentScore} / {currentIndex}
          </span>
        </div>
      </div>

      {/* Main game area - Swipe card */}
      <div className="flex-1 flex items-center justify-center px-6">
        {currentLetter && (
          <SwipeCard
            key={`${currentLetter.character}-${currentIndex}`}
            letter={currentLetter}
            onSwipe={handleSwipe}
          />
        )}
      </div>

      {/* Progress footer */}
      <div className="px-6 py-4 flex justify-center">
        <div
          className="bg-teal-200 px-6 py-2 rounded-full border-[2px] border-black"
          id="letter-match-progress-display"
        >
          <span className="text-sm font-bold text-black">
            Round {currentRound} • {progress}
          </span>
        </div>
      </div>

      {/* Settings panel overlay */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </GameContainer>
  );
}
