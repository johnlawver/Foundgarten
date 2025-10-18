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
        {/* Emoji and message */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">{emoji}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {message}
          </h2>
          <p className="text-gray-600">Round {roundNumber} Complete</p>
        </div>

        {/* Stats card */}
        <Card className="w-full max-w-sm mb-8">
          <div className="space-y-4">
            {/* Success rate - big and prominent */}
            <div className="text-center pb-4 border-b border-gray-200">
              <div className="text-6xl font-bold text-blue-600 mb-1">
                {successRate}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>

            {/* Detailed stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {totalAttempts}
                </div>
                <div className="text-xs text-gray-600">Total</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-green-600">
                  {correctCount}
                </div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-red-600">
                  {incorrectCount}
                </div>
                <div className="text-xs text-gray-600">Incorrect</div>
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
          >
            Play Again
          </Button>

          <Button
            variant="secondary"
            onClick={onSettings}
            className="w-full"
          >
            ⚙️ Settings
          </Button>

          <Button
            variant="secondary"
            onClick={onHome}
            className="w-full"
          >
            🏠 Home
          </Button>
        </div>
      </div>
    </GameContainer>
  );
}
