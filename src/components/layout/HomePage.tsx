/**
 * Home Page
 * Main landing page with game selection
 */

import { useEffect, useState } from 'react';
import { getAllGameConfigs } from '@/lib/games/registry';
import type { GameConfig } from '@/types/game';
import { db } from '@/lib/storage/db';

export const HomePage: React.FC = () => {
  const [games, setGames] = useState<GameConfig[]>([]);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Get registered games
    const registeredGames = getAllGameConfigs();
    setGames(registeredGames);

    // Check database initialization
    db.getDatabaseSize().then((size) => {
      setDbInitialized(size.letterMatchStats > 0 || size.orientationGameStats > 0);
    });
  }, []);

  const handleGameClick = (gameId: string) => {
    // Use global navigation function
    if ((window as any).navigateToGame) {
      (window as any).navigateToGame(gameId);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top left yellow blob */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-200 rounded-full"
          style={{
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
          }}
        />
        {/* Top right teal blob */}
        <div
          className="absolute -top-20 right-10 w-64 h-64 bg-teal-200 rounded-full opacity-60"
          style={{
            clipPath: 'ellipse(60% 70% at 50% 50%)'
          }}
        />
        {/* Bottom right coral blob */}
        <div
          className="absolute -bottom-40 -right-20 w-80 h-80 bg-coral-200 rounded-full opacity-50"
        />
        {/* Decorative dots */}
        <div className="absolute top-40 left-20 w-4 h-4 bg-yellow-400 rounded-full" />
        <div className="absolute top-60 right-40 w-3 h-3 bg-coral-400 rounded-full" />
        <div className="absolute bottom-40 left-1/3 w-5 h-5 bg-teal-400 rounded-full" />
      </div>

      {/* Main Content */}
      <main className="relative max-w-5xl mx-auto p-6 space-y-10">
        {/* Header */}
        <header className="text-center pt-8 pb-4">
          <div className="inline-flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-6">
              <span className="text-4xl">🎓</span>
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-black text-black mb-1">
                Foundgarten
              </h1>
              <div className="inline-block bg-yellow-300 px-3 py-1 rounded-full border-[2px] border-black">
                <p className="text-sm font-bold text-black">Learn & Play!</p>
              </div>
            </div>
          </div>
        </header>

        {/* Status Card */}
        <div className="bg-white rounded-[32px] p-6 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-teal-400 rounded-2xl flex items-center justify-center border-[3px] border-black shrink-0 transform rotate-3">
              <span className="text-4xl">✨</span>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-black text-black mb-6">
                Phase 1 Complete!
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '💾', text: dbInitialized ? 'Database Ready' : 'Loading...' },
                  { icon: '🧠', text: 'AI Learning Ready' },
                  { icon: '🎨', text: 'Components Built' },
                  { icon: '⚙️', text: 'State Configured' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-semibold text-black">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Games Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-black">
              Learning Games
            </h2>
            <span className="px-4 py-2 bg-coral-400 text-black text-sm font-bold rounded-full border-[3px] border-black">
              Coming Soon
            </span>
          </div>

          {games.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-full -mr-16 -mt-16 opacity-50" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-200 rounded-full -ml-20 -mb-20 opacity-50" />

              <div className="relative">
                <div className="w-28 h-28 bg-yellow-100 rounded-full mx-auto mb-8 flex items-center justify-center border-[3px] border-black">
                  <span className="text-6xl">🎮</span>
                </div>
                <h3 className="text-4xl font-black text-black mb-4">
                  Games on the Way!
                </h3>
                <p className="text-lg text-gray-700 mb-3 max-w-md mx-auto font-medium">
                  We're building fun learning games for you
                </p>
                <p className="text-base text-gray-600 font-medium">
                  Everything is ready to go ✓
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {games.map((game, idx) => (
                <div
                  key={game.id}
                  className="group bg-white rounded-[32px] p-6 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  onClick={() => handleGameClick(game.id)}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border-[3px] border-black shrink-0 transform ${idx % 2 === 0 ? 'rotate-3 bg-yellow-300' : '-rotate-3 bg-teal-300'}`}
                    >
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-black mb-2 group-hover:text-teal-600 transition-colors">
                        {game.name}
                      </h3>
                      <p className="text-sm text-gray-700 mb-4 font-medium">
                        {game.description}
                      </p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-yellow-200 text-black text-xs font-bold rounded-full border-[2px] border-black">
                          {game.itemType}
                        </span>
                        <span className="px-3 py-1 bg-teal-200 text-black text-xs font-bold rounded-full border-[2px] border-black">
                          {game.defaultDifficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Next Steps */}
        <section>
          <div className="bg-white rounded-[32px] p-8 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-coral-400 rounded-2xl flex items-center justify-center border-[3px] border-black">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-3xl font-black text-black">What's Next</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                { emoji: '🎨', title: 'Letter Match', desc: 'Swipe to learn letters' },
                { emoji: '🔄', title: 'Orientation', desc: 'Find the right way' },
                { emoji: '🧭', title: 'Navigation', desc: 'Move between pages' },
                { emoji: '📱', title: 'App Icons', desc: 'Make it pretty' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-yellow-50 rounded-2xl border-[2px] border-black">
                  <span className="text-4xl shrink-0">{step.emoji}</span>
                  <div>
                    <div className="font-black text-black text-lg mb-1">{step.title}</div>
                    <div className="text-sm text-gray-700 font-medium">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Debug Info */}
        {import.meta.env.DEV && (
          <section>
            <details className="bg-gray-900 text-white rounded-[24px] p-6 border-[3px] border-black">
              <summary className="cursor-pointer font-black text-lg flex items-center gap-2">
                <span>🔧</span>
                Developer Info
              </summary>
              <div className="mt-4 space-y-2 text-sm font-mono bg-black p-4 rounded-xl">
                <div className="flex justify-between">
                  <span className="text-gray-400">Database:</span>
                  <span className={dbInitialized ? 'text-teal-400' : 'text-yellow-400'}>
                    {dbInitialized ? 'Initialized ✓' : 'Not initialized'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Games:</span>
                  <span className="text-coral-400">{games.length}</span>
                </div>
                {games.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">IDs:</span>
                    <span className="text-yellow-400">{games.map((g) => g.id).join(', ')}</span>
                  </div>
                )}
              </div>
            </details>
          </section>
        )}
      </main>
    </div>
  );
};
