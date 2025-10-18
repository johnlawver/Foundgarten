import { useState, useEffect } from 'react';
import { HomePage } from './components/layout/HomePage';
import { getGame } from './lib/games/registry';
import type { GameId } from './types/game';

// Import all games to register them
import './games';

function App() {
  const [currentView, setCurrentView] = useState<'home' | GameId>('home');

  // Setup navigation handlers
  useEffect(() => {
    // Global navigation function
    (window as any).navigateToGame = (gameId: GameId) => {
      setCurrentView(gameId);
    };

    (window as any).navigateToHome = () => {
      setCurrentView('home');
    };

    return () => {
      delete (window as any).navigateToGame;
      delete (window as any).navigateToHome;
    };
  }, []);

  // Render home page
  if (currentView === 'home') {
    return <HomePage />;
  }

  // Render game
  const game = getGame(currentView);
  if (game) {
    const GameComponent = game.Component;
    return <GameComponent />;
  }

  // Fallback to home if game not found
  return <HomePage />;
}

export default App;
