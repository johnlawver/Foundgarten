# Architecture Documentation

## Project Overview

**Foundgarten** is a mobile-first, offline-capable Progressive Web App (PWA) designed to help kindergarten-aged children learn through interactive games. The app works completely offline, persists data locally on a single device, and provides adaptive learning experiences that adjust based on the child's performance.

## Design Principles

### 1. Offline-First
- All functionality must work without internet connectivity
- Assets, code, and data cached locally
- Service Worker handles offline requests
- No external API dependencies for core functionality

### 2. Mobile-First
- Designed primarily for mobile phones (parent holds device)
- Touch-optimized UI with large interactive elements
- Responsive design supporting 320px - 414px viewports
- Performance optimized for mobile devices

### 3. Modular Game Architecture
- Games are self-contained, pluggable modules
- Each game manages its own state and storage
- Shared component library for consistent UX
- Easy to add/remove games without affecting others

### 4. Adaptive Learning
- Algorithm tracks performance per learning item
- Automatically serves more challenging content
- Parent override available for manual control
- Focus on reinforcement through repetition

## Technology Stack

### Core Framework
- **React 18+**: UI library with concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server

### Routing
- **TanStack Router**: File-based routing with type safety
- Code-splitting at route level for optimal loading
- Lazy loading for individual games

### State Management
- **Zustand**: Lightweight state management
- Separate stores per game for isolation
- Minimal boilerplate, easy debugging

### Data Persistence
- **IndexedDB**: Browser-native database for structured data
- **Dexie.js**: Promise-based IndexedDB wrapper
- Aggregate statistics storage (not session-based)
- Per-game database tables

### PWA & Offline
- **Vite PWA Plugin**: Service worker generation
- **Workbox**: Advanced caching strategies
- Precache all app assets
- Runtime caching for dynamic resources

### UI Components
- **Shared Component Library**: Consistent design system
- Tailwind CSS (or similar) for utility-first styling
- Touch-optimized interactive elements
- Accessibility-first component design

## Application Structure

```
foundgarten/
├── docs/                          # Project documentation
│   ├── ARCHITECTURE.md           # This file
│   ├── DEVELOPMENT.md            # Setup and dev guide
│   ├── TESTING.md                # Testing strategy
│   └── games/                    # Individual game requirements
│       ├── letter-match.md
│       └── orientation-game.md
├── public/                        # Static assets
│   ├── icons/                    # PWA icons
│   ├── images/                   # Game images
│   └── manifest.json             # PWA manifest
├── src/
│   ├── components/
│   │   ├── shared/               # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   └── GameContainer.tsx
│   │   └── layout/               # App layout components
│   │       ├── Header.tsx
│   │       ├── Navigation.tsx
│   │       └── AppShell.tsx
│   ├── games/                    # Game modules
│   │   ├── letter-match/         # Example: Letter matching game
│   │   │   ├── components/       # Game-specific UI
│   │   │   ├── store/           # Game state (Zustand)
│   │   │   ├── utils/           # Game logic & algorithms
│   │   │   ├── types.ts         # Game type definitions
│   │   │   └── index.tsx        # Game entry point
│   │   └── orientation-game/
│   │       └── ...
│   ├── lib/
│   │   ├── storage/              # Database utilities
│   │   │   ├── db.ts            # Dexie setup
│   │   │   ├── migrations.ts    # Schema migrations
│   │   │   └── types.ts         # DB type definitions
│   │   ├── router/              # Router configuration
│   │   │   └── index.tsx
│   │   └── learning/            # Adaptive learning algorithms
│   │       └── weighted-selection.ts
│   ├── hooks/                    # Shared React hooks
│   │   ├── useGameState.ts
│   │   ├── useStatistics.ts
│   │   └── useOfflineStatus.ts
│   ├── utils/                    # Shared utilities
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── types/                    # Shared TypeScript types
│   │   ├── game.ts
│   │   └── statistics.ts
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Entry point
│   └── sw.ts                     # Service worker
├── RULES.md                      # AI assistance guidelines
├── README.md                     # Project overview
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Core Concepts

### Game Module Interface

Each game is a self-contained module that exports:

```typescript
interface GameModule {
  // Unique identifier
  id: string;

  // Display information
  name: string;
  description: string;
  icon: string;

  // Game component
  Component: React.ComponentType;

  // Database schema
  storageSchema: {
    tableName: string;
    schema: string; // Dexie schema definition
  };

  // Learning configuration
  learningConfig: {
    itemType: 'letter' | 'number' | 'word' | 'custom';
    adaptiveAlgorithm: 'weighted' | 'spaced-repetition';
    defaultDifficulty: 'easy' | 'medium' | 'hard';
  };
}
```

### Game Registry

Central registry managing all available games:

```typescript
// src/lib/games/registry.ts
class GameRegistry {
  private games: Map<string, GameModule>;

  register(game: GameModule): void;
  getGame(id: string): GameModule | undefined;
  getAllGames(): GameModule[];
  initializeStorage(): Promise<void>;
}
```

### Data Models

#### Game Statistics

Aggregate statistics stored per game:

```typescript
interface GameStatistics {
  gameId: string;
  itemId: string;          // Letter, number, etc.
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  lastAttempt: Date;
  successRate: number;     // Calculated: correctCount / totalAttempts
}
```

#### Game Session

Temporary state during active gameplay (not persisted):

```typescript
interface GameSession {
  gameId: string;
  currentRound: number;
  totalRounds: number;
  items: GameItem[];       // Current round items
  score: number;
  startTime: Date;
}
```

### Adaptive Learning Algorithm

**Weighted Random Selection** (default algorithm):

1. **Calculate Success Rate** for each item:
   ```
   successRate = correctCount / totalAttempts
   ```

2. **Calculate Error Weight**:
   ```
   errorWeight = 1 - successRate
   ```
   - Items with 0% success = weight of 1.0
   - Items with 50% success = weight of 0.5
   - Items with 100% success = weight of 0.0

3. **Normalize Weights** across all items

4. **Weighted Random Selection**:
   - Select items based on normalized weights
   - Higher weight = higher probability of selection
   - Ensures struggling items appear more frequently

5. **Parent Override**:
   - Difficulty slider adjusts weight distribution
   - "Easy" mode: flatten weights (more even distribution)
   - "Hard" mode: amplify weights (stronger bias to errors)

### State Management Strategy

#### Global State (Zustand)
- App-level settings (theme, sound, etc.)
- Current game navigation
- Offline status

#### Game-Level State (Zustand)
- Each game has isolated store
- Manages active session state
- Triggers persistence to IndexedDB

#### Persistent State (IndexedDB via Dexie)
- Game statistics (aggregate)
- User preferences
- Game configurations

**State Flow**:
```
User Action → Game Store → Update UI + Persist to IndexedDB
                ↓
          Statistics Service → Adaptive Algorithm → Next Round Items
```

### PWA & Offline Strategy

#### Service Worker Caching

**Precache Strategy** (install-time):
- App shell (HTML, CSS, JS bundles)
- Static assets (icons, fonts)
- Core game assets

**Runtime Caching Strategy**:
- Game images: Cache-first with network fallback
- Dynamic routes: Network-first with cache fallback
- API calls (future): Network-only (no external APIs initially)

#### Offline Detection

- Monitor `navigator.onLine` status
- Display indicator when offline
- Queue sync operations for online (future feature)

#### Data Sync Strategy (Future)

While initially single-device only, architecture supports future multi-device sync:

- IndexedDB as source of truth
- Optional cloud sync when online
- Conflict resolution for multi-device scenarios

## Routing Structure

```
/                           # Home: Game selection grid
/game/:gameId               # Individual game play screen
/stats                      # Overall statistics dashboard
/stats/:gameId              # Per-game statistics
/settings                   # App settings
/settings/:gameId           # Per-game settings
```

## Component Architecture

### Shared Component Library

**Core UI Components**:
- `Button`: Touch-optimized buttons with haptic feedback
- `Card`: Container for game selection and info displays
- `ScoreDisplay`: Consistent score presentation
- `GameContainer`: Wrapper providing common game layout
- `ProgressBar`: Visual progress indicator
- `SettingsPanel`: Reusable settings interface

**Layout Components**:
- `AppShell`: Main app container with navigation
- `Header`: App title and status indicators
- `Navigation`: Bottom navigation bar (mobile)
- `BackButton`: Consistent navigation back

### Game Component Pattern

Each game follows this structure:

```tsx
// src/games/example-game/index.tsx
export const ExampleGame: React.FC = () => {
  // 1. Game state from Zustand store
  const { session, nextRound, recordAnswer } = useExampleGameStore();

  // 2. Statistics and adaptive logic
  const { statistics, getNextItems } = useGameStatistics('example-game');

  // 3. Render game UI
  return (
    <GameContainer title="Example Game">
      {/* Game-specific UI */}
    </GameContainer>
  );
};
```

## Performance Considerations

### Code Splitting
- Route-level splitting (per game)
- Lazy load game modules
- Dynamic imports for non-critical features

### Bundle Optimization
- Tree-shaking unused code
- Minimize dependencies
- Use lightweight libraries

### Mobile Performance
- Virtualize long lists (game selection if many games)
- Optimize image sizes and formats (WebP)
- Minimize re-renders with React.memo
- Use CSS transforms for animations (GPU-accelerated)

### Storage Optimization
- Aggregate statistics instead of session logs
- Implement data cleanup for very old records (configurable)
- Compress large data if needed

## Security & Privacy

### Data Privacy
- All data stored locally on device
- No external analytics or tracking
- No user accounts or authentication required
- No personal information collected

### Content Security
- CSP headers for XSS prevention
- Sanitize any user-generated content
- Secure asset loading (integrity checks)

## Testing Strategy

### Unit Tests
- Game logic and algorithms
- Utility functions
- State management stores

### Integration Tests
- Game flow (start → play → complete)
- Database operations
- Adaptive learning algorithm

### E2E Tests
- Critical user paths
- Offline functionality
- PWA installation

### Manual Testing
- Touch interactions on real devices
- Offline mode verification
- Performance on lower-end devices

## Future Enhancements

### Planned Features (Not in MVP)
- Multi-device sync via cloud storage
- Audio instructions and feedback
- Animations and visual rewards
- Parent dashboard with detailed analytics
- Export progress reports
- Additional game types
- Accessibility improvements (screen reader support)

### Scalability Considerations
- Plugin system for third-party games
- Theming engine for customization
- i18n for multiple languages
- Cloud backup option (opt-in)

## Change Log

### Initial Architecture (2025-01-XX)
- Defined core technology stack
- Established modular game architecture
- Planned offline-first PWA approach
- Designed adaptive learning system
- Created documentation structure

---

**Last Updated**: 2025-01-17
**Version**: 1.0.0
**Maintainer**: Project Team
