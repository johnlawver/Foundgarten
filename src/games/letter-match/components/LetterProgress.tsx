/**
 * LetterProgress Component
 * Shows aggregated success rates for all letters
 */

import { useEffect, useState } from 'react';
import { db } from '@/lib/storage/db';
import { useProfileStore } from '@/lib/profiles/store';
import { Button } from '@/components/shared/Button';

interface LetterStat {
  letter: string;
  caseType: 'uppercase' | 'lowercase';
  totalAttempts: number;
  correctCount: number;
  successRate: number;
}

interface LetterProgressProps {
  onClose: () => void;
}

export function LetterProgress({ onClose }: LetterProgressProps) {
  const [letterStats, setLetterStats] = useState<LetterStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSeparate, setShowSeparate] = useState(true); // Toggle between separate/combined view
  const { activeProfileId, getActiveProfile } = useProfileStore();
  const activeProfile = getActiveProfile();

  useEffect(() => {
    loadLetterStats();
  }, [activeProfileId]);

  const loadLetterStats = async () => {
    if (!activeProfileId) return;

    setIsLoading(true);

    // Get all stats for this profile
    const allStats = await db.letterMatchStatistics
      .where('profileId')
      .equals(activeProfileId)
      .toArray();

    // Create map by letter and case (keep them separate)
    const statsMap = new Map<string, LetterStat>();

    for (const stat of allStats) {
      const letter = stat.letter.toUpperCase();
      const key = `${letter}-${stat.caseType}`;

      if (!statsMap.has(key)) {
        statsMap.set(key, {
          letter,
          caseType: stat.caseType as 'uppercase' | 'lowercase',
          totalAttempts: stat.totalAttempts,
          correctCount: stat.correctCount,
          successRate: stat.totalAttempts > 0
            ? stat.correctCount / stat.totalAttempts
            : 0,
        });
      }
    }

    // Convert to array and sort alphabetically, uppercase before lowercase
    const statsArray = Array.from(statsMap.values()).sort((a, b) => {
      const letterCompare = a.letter.localeCompare(b.letter);
      if (letterCompare !== 0) return letterCompare;
      // Uppercase before lowercase
      return a.caseType === 'uppercase' ? -1 : 1;
    });

    setLetterStats(statsArray);
    setIsLoading(false);
  };

  const getColorClass = (successRate: number, attempts: number) => {
    if (attempts === 0) return 'bg-gray-200 border-gray-400';
    if (successRate >= 0.8) return 'bg-teal-200 border-teal-600';
    if (successRate >= 0.6) return 'bg-yellow-200 border-yellow-600';
    return 'bg-coral-200 border-coral-500';
  };

  const getLabel = (successRate: number, attempts: number) => {
    if (attempts === 0) return 'Not tried';
    if (successRate >= 0.8) return 'Great!';
    if (successRate >= 0.6) return 'Good';
    return 'Practice';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-full max-h-[90vh] bg-[#f7f7f7] rounded-[32px] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-yellow-300 border-b-[3px] border-black">
          <h1 className="text-2xl font-black text-black">Letter Progress</h1>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-xl bg-coral-400 border-[3px] border-black flex items-center justify-center hover:bg-coral-500 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
            aria-label="Close"
          >
            <span className="text-2xl font-black">✕</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-yellow-300 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transform rotate-3">
              <span className="text-4xl">📊</span>
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-black text-black">
                {activeProfile?.name}'s Progress
              </h2>
              <p className="text-sm font-semibold text-gray-600">
                Success rate for each letter
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="bg-white rounded-2xl p-3 border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSeparate(true)}
                className={`px-4 py-2 rounded-xl border-[2px] font-bold text-sm transition-all ${
                  showSeparate
                    ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white border-gray-400 text-gray-600'
                }`}
                id="view-separate-button"
              >
                Aa Separate
              </button>
              <button
                onClick={() => setShowSeparate(false)}
                className={`px-4 py-2 rounded-xl border-[2px] font-bold text-sm transition-all ${
                  !showSeparate
                    ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white border-gray-400 text-gray-600'
                }`}
                id="view-combined-button"
              >
                A Combined
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 justify-center">
            <div className="px-3 py-1 bg-teal-200 rounded-full border-[2px] border-teal-600 text-xs font-bold">
              🟢 Great (80%+)
            </div>
            <div className="px-3 py-1 bg-yellow-200 rounded-full border-[2px] border-yellow-600 text-xs font-bold">
              🟡 Good (60-79%)
            </div>
            <div className="px-3 py-1 bg-coral-200 rounded-full border-[2px] border-coral-500 text-xs font-bold">
              🔴 Practice (&lt;60%)
            </div>
            <div className="px-3 py-1 bg-gray-200 rounded-full border-[2px] border-gray-400 text-xs font-bold">
              ⚪ Not tried
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-lg font-semibold text-gray-600">Loading progress...</p>
          </div>
        ) : showSeparate ? (
          <>
            {/* Letter Grid - Separate (uppercase and lowercase pairs) */}
            <div className="space-y-6">
              {/* Group stats by letter */}
              {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter) => {
                const upperStat = letterStats.find(
                  (s) => s.letter === letter && s.caseType === 'uppercase'
                );
                const lowerStat = letterStats.find(
                  (s) => s.letter === letter && s.caseType === 'lowercase'
                );

                // Skip if no data for either
                if (!upperStat && !lowerStat) return null;

                return (
                  <div key={letter} className="grid grid-cols-2 gap-3" id={`letter-group-${letter}`}>
                    {/* Uppercase */}
                    <div
                      className={`aspect-square rounded-2xl border-[3px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center p-3 ${getColorClass(
                        upperStat?.successRate || 0,
                        upperStat?.totalAttempts || 0
                      )}`}
                      id={`letter-progress-${letter}-upper`}
                    >
                      <div className="text-6xl font-black text-black mb-2">
                        {letter}
                      </div>
                      <div className="text-sm font-bold text-black">
                        {upperStat && upperStat.totalAttempts > 0
                          ? `${Math.round(upperStat.successRate * 100)}%`
                          : '—'}
                      </div>
                      <div className="text-xs font-semibold text-gray-700">
                        {getLabel(upperStat?.successRate || 0, upperStat?.totalAttempts || 0)}
                      </div>
                    </div>

                    {/* Lowercase */}
                    <div
                      className={`aspect-square rounded-2xl border-[3px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center p-3 ${getColorClass(
                        lowerStat?.successRate || 0,
                        lowerStat?.totalAttempts || 0
                      )}`}
                      id={`letter-progress-${letter}-lower`}
                    >
                      <div className="text-6xl font-black text-black mb-2">
                        {letter.toLowerCase()}
                      </div>
                      <div className="text-sm font-bold text-black">
                        {lowerStat && lowerStat.totalAttempts > 0
                          ? `${Math.round(lowerStat.successRate * 100)}%`
                          : '—'}
                      </div>
                      <div className="text-xs font-semibold text-gray-700">
                        {getLabel(lowerStat?.successRate || 0, lowerStat?.totalAttempts || 0)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Letter Grid - Combined (aggregated uppercase + lowercase) */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter) => {
                const upperStat = letterStats.find(
                  (s) => s.letter === letter && s.caseType === 'uppercase'
                );
                const lowerStat = letterStats.find(
                  (s) => s.letter === letter && s.caseType === 'lowercase'
                );

                // Aggregate stats
                const totalAttempts = (upperStat?.totalAttempts || 0) + (lowerStat?.totalAttempts || 0);
                const correctCount = (upperStat?.correctCount || 0) + (lowerStat?.correctCount || 0);
                const successRate = totalAttempts > 0 ? correctCount / totalAttempts : 0;

                return (
                  <div
                    key={letter}
                    className={`aspect-square rounded-2xl border-[3px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center p-2 ${getColorClass(
                      successRate,
                      totalAttempts
                    )}`}
                    id={`letter-progress-${letter}-combined`}
                  >
                    <div className="text-5xl font-black text-black mb-1">
                      {letter}
                    </div>
                    <div className="text-xs font-bold text-black">
                      {totalAttempts > 0
                        ? `${Math.round(successRate * 100)}%`
                        : '—'}
                    </div>
                    <div className="text-[10px] font-semibold text-gray-700">
                      {getLabel(successRate, totalAttempts)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!isLoading && (
          <>

          {/* Summary Stats */}
          <div className="mt-8 bg-white rounded-[24px] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
            <h3 className="text-lg font-black text-black mb-3">Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-black text-teal-600">
                  {letterStats.filter((s) => s.successRate >= 0.8 && s.totalAttempts > 0).length}
                </div>
                <div className="text-xs font-semibold text-gray-600">Mastered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-yellow-600">
                  {letterStats.filter((s) => s.successRate >= 0.6 && s.successRate < 0.8 && s.totalAttempts > 0).length}
                </div>
                <div className="text-xs font-semibold text-gray-600">Learning</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-coral-600">
                  {letterStats.filter((s) => s.successRate < 0.6 && s.totalAttempts > 0).length}
                </div>
                <div className="text-xs font-semibold text-gray-600">Practice</div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={onClose}
              className="w-full"
              id="letter-progress-close"
            >
              Done
            </Button>
          </div>
        </>
        )}
      </div>
    </div>
    </div>
  );
}
