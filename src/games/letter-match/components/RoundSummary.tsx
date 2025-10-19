/**
 * RoundSummary Component
 * Displays results after completing a round
 */

import { GameContainer } from '@/components/shared/GameContainer';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';

interface RoundSummaryProps {
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  roundNumber: number;
  onPlayAgain: () => void;
  onHome: () => void;
  onSettings: () => void;
}

export function RoundSummary({
  totalAttempts,
  correctCount,
  incorrectCount,
  roundNumber,
  onPlayAgain,
  onHome,
  onSettings,
}: RoundSummaryProps) {
  const successRate =
    totalAttempts > 0
      ? Math.round((correctCount / totalAttempts) * 100)
      : 0;

  // Determine emoji and message based on success rate
  let emoji = '🎉';
  let message = 'Amazing work!';

  if (successRate < 50) {
    emoji = '💪';
    message = "Keep practicing!";
  } else if (successRate < 75) {
    emoji = '👍';
    message = 'Great effort!';
  } else if (successRate < 90) {
    emoji = '⭐';
    message = 'Excellent job!';
  } else if (successRate === 100) {
    emoji = '🏆';
    message = 'Perfect round!';
  }

  return (
    <GameContainer
      title="Round Complete"
      onBack={onHome}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Emoji container with playful rotation */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-yellow-300 rounded-3xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transform -rotate-6 mx-auto mb-6">
            <span className="text-7xl">{emoji}</span>
          </div>

          <h2 className="text-4xl font-black text-black mb-2 text-center">
            {message}
          </h2>
          <div className="inline-block bg-teal-200 px-4 py-2 rounded-full border-[2px] border-black">
            <p className="text-sm font-bold text-black">Round {roundNumber} Complete</p>
          </div>
        </div>

        {/* Stats card */}
        <Card className="w-full max-w-sm mb-8 p-6" id="letter-match-stats-card">
          <div className="space-y-6">
            {/* Success rate - big and prominent */}
            <div className="text-center pb-6 border-b-[3px] border-black" id="letter-match-success-rate">
              <div className="text-7xl font-black text-yellow-400 mb-2">
                {successRate}%
              </div>
              <div className="text-sm font-bold text-black">Success Rate</div>
            </div>

            {/* Detailed stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-yellow-50 rounded-2xl border-[2px] border-black p-3" id="letter-match-total-stat">
                <div className="text-3xl font-black text-black mb-1">
                  {totalAttempts}
                </div>
                <div className="text-xs font-semibold text-black">Total</div>
              </div>

              <div className="bg-teal-200 rounded-2xl border-[2px] border-black p-3" id="letter-match-correct-stat">
                <div className="text-3xl font-black text-black mb-1">
                  {correctCount}
                </div>
                <div className="text-xs font-semibold text-black">Correct</div>
              </div>

              <div className="bg-coral-200 rounded-2xl border-[2px] border-black p-3" id="letter-match-incorrect-stat">
                <div className="text-3xl font-black text-black mb-1">
                  {incorrectCount}
                </div>
                <div className="text-xs font-semibold text-black">Incorrect</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action buttons */}
        <div className="space-y-3 w-full max-w-xs">
          <Button
            variant="primary"
            onClick={onPlayAgain}
            className="w-full"
            id="letter-match-play-again-button"
          >
            🎮 Play Again
          </Button>

          <Button
            variant="ghost"
            onClick={onSettings}
            className="w-full"
            id="letter-match-summary-settings-button"
          >
            ⚙️ Settings
          </Button>

          <Button
            variant="ghost"
            onClick={onHome}
            className="w-full"
            id="letter-match-home-button"
          >
            🏠 Home
          </Button>
        </div>
      </div>
    </GameContainer>
  );
}
