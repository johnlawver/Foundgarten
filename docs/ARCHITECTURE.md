# Architecture Documentation

## Implementation Status

**Status**: 🚧 Initial Implementation Complete
**Version**: 0.1.0
**Last Updated**: 2025-10-22

**Implemented**:
- ✅ Letter Match game (fully functional)
- ✅ **Multi-child profiles** with separate progress tracking
- ✅ Letter Progress view with uppercase/lowercase toggle
- ✅ IndexedDB persistence with Dexie (v4 schema)
- ✅ Zustand state management
- ✅ Adaptive learning algorithm
- ✅ Neo-brutalist design system
- ✅ Shared component library (Button, Card, GameContainer, ScoreDisplay, ProfileSelector, ProfileCreateModal)
- ✅ Netlify deployment configuration
- ✅ TanStack Router setup

**In Progress**:
- 🚧 PWA service worker (configured, needs verification)
- 🚧 Orientation Game (database schema ready, game not built)

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

### UI Components & Styling
- **Shared Component Library**: Consistent design system
- **Tailwind CSS v4**: Utility-first styling
- **Neo-Brutalist Design**: 3px borders, hard shadows, yellow/teal/coral palette
- Touch-optimized interactive elements (44px+ touch targets)
- Component IDs for debugging and testing

## Application Structure

### Actual File Structure (As Implemented)

```
foundgarten/
├── docs/                          # Project documentation
│   ├── ARCHITECTURE.md           # This file
│   ├── DEVELOPMENT.md            # Setup and dev guide
│   └── games/                    # Individual game requirements
│       ├── letter-match.md       # ✅ Implemented
│       └── orientation-game.md   # 🚧 Planned
├── inspo/                         # Design inspiration images
├── public/                        # Static assets
│   ├── icons/                    # PWA icons
│   └── manifest.webmanifest      # PWA manifest
├── src/
│   ├── components/
│   │   ├── shared/               # ✅ Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   ├── GameContainer.tsx
│   │   │   ├── ProfileSelector.tsx       # ✅ Profile dropdown
│   │   │   ├── ProfileCreateModal.tsx    # ✅ Create profile UI
│   │   │   └── index.ts
│   │   └── layout/               # ✅ App layout components
│   │       └── HomePage.tsx
│   ├── games/                    # Game modules
│   │   ├── index.ts              # Game registry
│   │   └── letter-match/         # ✅ IMPLEMENTED
│   │       ├── components/       # Game-specific UI
│   │       │   ├── SwipeCard.tsx
│   │       │   ├── RoundSummary.tsx
│   │       │   ├── LetterProgress.tsx    # ✅ Letter stats view
│   │       │   └── SettingsPanel.tsx
│   │       ├── store.ts          # Zustand store
│   │       ├── utils.ts          # Game logic & algorithms
│   │       ├── index.ts          # Game entry point
│   │       └── LetterMatchGame.tsx
│   ├── lib/
│   │   ├── storage/              # ✅ Database utilities
│   │   │   └── db.ts            # Dexie setup with schemas (v4)
│   │   ├── profiles/             # ✅ Profile management
│   │   │   └── store.ts         # Profile Zustand store
│   │   └── router/              # ✅ Router configuration
│   │       └── index.tsx
│   ├── hooks/                    # 🚧 Planned (not yet needed)
│   ├── utils/                    # 🚧 Shared utilities (minimal so far)
│   ├── types/                    # ✅ TypeScript types
│   │   ├── game.ts              # Game type definitions
│   │   └── letter-match.ts      # Letter Match types
│   ├── routes/                   # ✅ TanStack Router routes
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   └── games/
│   │       └── letter-match.tsx
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── netlify.toml                  # ✅ Netlify deployment config
├── CLAUDE.md                     # ✅ AI context for assistants
├── RULES.md                      # AI assistance guidelines
├── QUICK_START.md                # Quick reference
├── README.md                     # Project overview
├── package.json
├── tsconfig.json
└── vite.config.ts
```

**Key Differences from Plan**:
- Games are directly in `src/games/letter-match/` (no `/store` or `/utils` subdirectories)
- TanStack Router uses `routes/` directory for route definitions
- No separate `learning/` directory yet (algorithms in game `utils.ts`)
- Hooks directory not yet needed (may add later)
- CLAUDE.md added for AI assistant context

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

#### Child Profiles

Multi-child support with separate progress tracking:

```typescript
interface Profile {
  id?: number;             // Auto-increment
  name: string;            // Child's name
  emoji: string;           // Avatar emoji
  createdAt: Date;
  updatedAt: Date;
}
```

All game statistics are scoped to a profile via `profileId`.

#### Game Statistics

Aggregate statistics stored per game and profile:

```typescript
interface GameStatistics {
  gameId: string;
  profileId: number;       // Child profile this statistic belongs to
  itemId: string;          // Letter, number, etc.
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  lastAttempt: Date;
  successRate: number;     // Calculated: correctCount / totalAttempts
}
```

**Profile-scoped queries** use compound indexes like `[profileId+letter+caseType]` for efficient filtering.

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

## Deployment

### Netlify Configuration

The app is configured for deployment to Netlify via `netlify.toml`:

**Build Settings**:
- Build command: `npm run build`
- Publish directory: `dist/`
- Node version: 20

**Features**:
- SPA redirects for client-side routing (`/* -> /index.html`)
- PWA-friendly headers for service worker
- Cache control for static assets (31536000s = 1 year)
- No-cache policy for service worker updates

**Deployment**:
```bash
# Build for production
npm run build

# Deploy to Netlify (auto-deploys on git push to main)
git push origin main
```

### Alternative Hosting

The app can be deployed to any static hosting service that supports:
- SPA redirects
- HTTPS (required for service workers)
- Custom headers (optional, for PWA optimization)

**Recommended Hosts**:
- Netlify (configured)
- Vercel
- GitHub Pages
- Firebase Hosting

## Actual Implementation vs. Original Plan

### What's Different

1. **File Organization**: Games are flatter (no nested `/store` and `/utils` directories)
2. **Router**: TanStack Router uses dedicated `routes/` directory
3. **Learning Algorithms**: Embedded in game `utils.ts` instead of separate `/lib/learning`
4. **Game Registry**: Simple game exports instead of complex registry pattern (may evolve)
5. **Design System**: Tailwind CSS v4 with neo-brutalist patterns (3px borders, hard shadows)

### What Stayed the Same

1. **Core Tech Stack**: React 18, TypeScript, Vite, Zustand, Dexie, TanStack Router
2. **Offline-First**: IndexedDB for persistence, PWA configuration
3. **Modular Games**: Self-contained game modules
4. **Adaptive Learning**: Weighted selection based on error rates
5. **Mobile-First**: Touch-optimized, 44px+ touch targets

## Change Log

### Version 0.1.0 - Initial Implementation (2025-10-18)
- ✅ Implemented Letter Match game with full functionality
- ✅ Set up IndexedDB with Dexie (letterMatchStatistics table)
- ✅ Created Zustand store for game state
- ✅ Built adaptive learning algorithm with weighted selection
- ✅ Implemented neo-brutalist design system
- ✅ Added shared component library (Button, Card, GameContainer, ScoreDisplay)
- ✅ Configured Netlify deployment
- ✅ Set up TanStack Router with file-based routing
- ✅ Added component IDs for debugging
- ✅ Cleaned up HomePage UI

### Version 0.0.1 - Planning & Architecture (2025-01-17)
- Defined core technology stack
- Established modular game architecture
- Planned offline-first PWA approach
- Designed adaptive learning system
- Created documentation structure

---

**Last Updated**: 2025-10-22
**Version**: 0.1.0
**Maintainer**: Project Team
