# Development Guide

## Getting Started

This guide covers setting up your development environment, running the project, and understanding the development workflow.

## Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For version control

### Recommended Tools
- **VS Code**: Recommended IDE
  - Extensions:
    - ESLint
    - Prettier
    - TypeScript and JavaScript Language Features
    - Tailwind CSS IntelliSense (if using Tailwind)
- **Chrome DevTools**: For PWA debugging
- **Mobile device** or emulator for testing

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd foundgarten
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- React & React DOM
- Vite & plugins
- TypeScript
- TanStack Router
- Zustand
- Dexie.js
- PWA dependencies
- Development tools (ESLint, Prettier, etc.)

### 3. Environment Setup

No environment variables required for local development. All data is stored locally via IndexedDB.

## Development Workflow

### Starting the Dev Server

```bash
npm run dev
```

This starts the Vite dev server at `http://localhost:5173` (default port).

Features:
- Hot Module Replacement (HMR)
- Fast refresh for React components
- TypeScript type checking
- Service worker in development mode

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run dev:host         # Start dev server accessible on network (for mobile testing)

# Building
npm run build            # Production build
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix auto-fixable lint issues
npm run typecheck        # Run TypeScript compiler check
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# PWA
npm run generate-pwa-assets  # Generate PWA icons and splash screens
```

### Testing on Mobile Devices

#### Option 1: Network Access
```bash
npm run dev:host
```
Then access from your mobile device using your computer's local IP (e.g., `http://192.168.1.100:5173`).

#### Option 2: Chrome DevTools Device Mode
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select mobile device preset
4. Test touch interactions and responsive design

#### Option 3: Real Device via USB Debugging
1. Enable USB debugging on Android device
2. Connect via USB
3. Chrome DevTools → Remote Devices
4. Inspect and debug on real device

## Project Structure

```
foundgarten/
├── public/                     # Static assets (served as-is)
│   ├── icons/                 # PWA icons (generated)
│   ├── images/                # Game images
│   └── manifest.json          # PWA manifest
├── src/
│   ├── components/            # React components
│   │   ├── shared/           # Reusable components
│   │   └── layout/           # Layout components
│   ├── games/                # Game modules
│   │   ├── letter-match/
│   │   └── orientation-game/
│   ├── lib/                  # Core libraries
│   │   ├── storage/          # Dexie/IndexedDB
│   │   ├── router/           # TanStack Router
│   │   └── learning/         # Adaptive algorithms
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript types
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   └── sw.ts                 # Service worker
├── docs/                     # Documentation
├── RULES.md                  # AI assistance rules
├── README.md
├── package.json
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
└── .eslintrc.json            # ESLint config
```

## Key Technologies

### React
- **Version**: 18+
- **Features Used**:
  - Hooks (useState, useEffect, etc.)
  - Suspense & lazy loading
  - Memo for optimization

### TypeScript
- **Version**: 5+
- **Strict Mode**: Enabled
- **Key Practices**:
  - Explicit type definitions
  - Interface for objects, type for unions
  - Avoid `any`, use `unknown` when needed

### Vite
- **Build Tool**: Fast HMR, optimized builds
- **Plugins**:
  - `@vitejs/plugin-react`: React support
  - `vite-plugin-pwa`: PWA/service worker generation

### TanStack Router
- **File-based routing**: Routes defined by file structure
- **Type-safe**: Full TypeScript integration
- **Code splitting**: Automatic route-level splitting

### Zustand
- **State Management**: Lightweight, hook-based
- **Store Pattern**: Separate stores per game
- **Middleware**: Persist middleware for settings

### Dexie.js
- **IndexedDB Wrapper**: Promise-based, easy to use
- **Features**:
  - Type-safe queries
  - Version migrations
  - Live queries (reactive)

## Development Best Practices

### Code Style

Follow the project's ESLint and Prettier configuration:

```typescript
// ✅ Good
interface GameProps {
  gameId: string;
  onComplete: () => void;
}

export const Game: React.FC<GameProps> = ({ gameId, onComplete }) => {
  // Component logic
};

// ❌ Avoid
export const Game = (props: any) => {
  // Component logic
};
```

### Component Organization

```typescript
// Component structure:
// 1. Imports
import React from 'react';
import { useGameStore } from './store';

// 2. Types
interface GameCardProps {
  character: string;
  onTap: () => void;
}

// 3. Component
export const GameCard: React.FC<GameCardProps> = ({ character, onTap }) => {
  // 4. Hooks
  const [isAnimating, setIsAnimating] = useState(false);

  // 5. Event handlers
  const handleTap = () => {
    setIsAnimating(true);
    onTap();
  };

  // 6. Render
  return (
    <div onClick={handleTap}>
      {character}
    </div>
  );
};
```

### State Management Pattern

```typescript
// Store definition
import { create } from 'zustand';

interface GameState {
  score: number;
  incrementScore: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
}));

// Component usage
const MyComponent = () => {
  const { score, incrementScore } = useGameStore();

  return <button onClick={incrementScore}>Score: {score}</button>;
};
```

### Database Operations

```typescript
// lib/storage/db.ts
import Dexie, { Table } from 'dexie';

export interface Statistics {
  id?: number;
  gameId: string;
  score: number;
}

class GameDatabase extends Dexie {
  statistics!: Table<Statistics>;

  constructor() {
    super('GameDatabase');
    this.version(1).stores({
      statistics: '++id, gameId, score'
    });
  }
}

export const db = new GameDatabase();

// Usage in components
import { db } from '@/lib/storage/db';

async function saveScore(gameId: string, score: number) {
  await db.statistics.add({ gameId, score });
}

async function getScores(gameId: string) {
  return await db.statistics.where({ gameId }).toArray();
}
```

## PWA Development

### Service Worker

The service worker is auto-generated by `vite-plugin-pwa` based on configuration in `vite.config.ts`.

### Testing Offline Mode

1. **Chrome DevTools**:
   - Application tab → Service Workers
   - Check "Offline" checkbox
   - Reload page to test offline functionality

2. **Network Tab**:
   - Throttle to "Offline"
   - Verify all assets load from cache

### PWA Manifest

Located at `public/manifest.json`:

```json
{
  "name": "Foundgarten",
  "short_name": "Foundgarten",
  "description": "Kindergarten learning games",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#4F46E5",
  "background_color": "#FFFFFF",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Adding a New Game

### Step 1: Create Game Directory

```bash
mkdir -p src/games/my-new-game/{components,store,utils}
touch src/games/my-new-game/{index.tsx,types.ts}
```

### Step 2: Create Game Documentation

```bash
touch docs/games/my-new-game.md
```

Document the game requirements, UI specs, and data model.

### Step 3: Define Database Schema

```typescript
// src/lib/storage/db.ts
interface MyGameStatistics {
  id?: number;
  // ... game-specific fields
}

class GameDatabase extends Dexie {
  myGameStats!: Table<MyGameStatistics>;

  constructor() {
    super('GameDatabase');
    this.version(2).stores({
      // ... existing tables
      myGameStats: '++id, gameId, ...'
    });
  }
}
```

### Step 4: Create Game Store

```typescript
// src/games/my-new-game/store/index.ts
import { create } from 'zustand';

interface MyGameState {
  // ... state properties
}

export const useMyGameStore = create<MyGameState>((set) => ({
  // ... initial state and actions
}));
```

### Step 5: Create Game Component

```typescript
// src/games/my-new-game/index.tsx
import React from 'react';

export const MyNewGame: React.FC = () => {
  return (
    <div>
      {/* Game UI */}
    </div>
  );
};
```

### Step 6: Register Game

```typescript
// src/lib/games/registry.ts
import { MyNewGame } from '@/games/my-new-game';

export const games = [
  // ... existing games
  {
    id: 'my-new-game',
    name: 'My New Game',
    description: 'Description here',
    Component: MyNewGame,
  }
];
```

### Step 7: Update Documentation

Update `README.md` and `docs/ARCHITECTURE.md` to reflect the new game.

## Debugging

### React DevTools
- Install React DevTools browser extension
- Inspect component tree
- View props and state
- Profile performance

### IndexedDB Inspection
- Chrome DevTools → Application → Storage → IndexedDB
- View database tables
- Inspect stored data
- Manually modify for testing

### Service Worker Debugging
- Chrome DevTools → Application → Service Workers
- View active service worker
- Update on reload
- Unregister for fresh start

### Common Issues

**Issue**: Hot reload not working
- **Solution**: Check Vite dev server is running, restart if needed

**Issue**: TypeScript errors
- **Solution**: Run `npm run typecheck` to see all errors

**Issue**: Service worker not updating
- **Solution**: Check "Update on reload" in DevTools, or unregister SW

**Issue**: IndexedDB not persisting
- **Solution**: Check browser storage quota, verify database operations

## Performance Optimization

### Bundle Size
- Lazy load game modules
- Tree-shake unused dependencies
- Analyze with `npm run build -- --mode analyze`

### Runtime Performance
- Use React.memo for expensive components
- useMemo/useCallback for expensive computations
- Virtualize long lists if needed

### Mobile Performance
- Test on real devices
- Profile with Chrome DevTools Performance tab
- Optimize images (use WebP format)
- Minimize animations during critical interactions

## Deployment

### Building for Production

```bash
npm run build
```

Output in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test production build with `npm run preview`
- [ ] Verify offline functionality works
- [ ] Test PWA installation
- [ ] Check all games function correctly
- [ ] Verify statistics persist
- [ ] Test on real mobile device
- [ ] Validate manifest.json
- [ ] Ensure service worker caches all assets

### Deployment Platforms

The built app can be deployed to:
- **Netlify**: Drag-and-drop `dist/` folder
- **Vercel**: Connect GitHub repo
- **GitHub Pages**: Use `gh-pages` branch
- **Firebase Hosting**: `firebase deploy`
- **Any static host**: Upload `dist/` contents

## Troubleshooting

### Development Server Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### TypeScript Errors
```bash
# Full type check
npm run typecheck

# Restart TS server in VS Code
Cmd+Shift+P → "Restart TS Server"
```

### Database Migration Issues
```bash
# Clear IndexedDB in DevTools
# Application → Storage → IndexedDB → Right-click → Delete

# Or programmatically:
await db.delete();
await db.open();
```

## Resources

### Official Documentation
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/)
- [TanStack Router](https://tanstack.com/router)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Dexie.js](https://dexie.org/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

### Learning Resources
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [PWA Best Practices](https://web.dev/pwa-checklist/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## Getting Help

### Documentation
1. Check `docs/ARCHITECTURE.md` for system design
2. Check `docs/games/*.md` for game-specific details
3. Read `RULES.md` for development guidelines

### Debugging
1. Check browser console for errors
2. Inspect with React DevTools
3. Check IndexedDB in Application tab
4. Review service worker status

### Contributing
1. Read `RULES.md` before making changes
2. Update relevant documentation with code changes
3. Ensure tests pass
4. Follow code style guidelines

---

**Last Updated**: 2025-01-17
**Maintainer**: Project Team
