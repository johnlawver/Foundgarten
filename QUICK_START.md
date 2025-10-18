# Quick Start Guide

## Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Test on Mobile

```bash
# Start server accessible on network
npm run dev:host
```

Then visit `http://<your-ip>:5173` from your mobile device.

## Project Overview

**Foundgarten** is an offline-first PWA with kindergarten learning games.

### Key Features
- Works completely offline
- Mobile-first design
- Adaptive learning (serves more incorrect answers)
- Progressive Web App (installable)
- Local data persistence (IndexedDB)

### Planned Games
1. **Letter Match** - Swipe-based letter recognition
2. **Orientation Game** - Tap correct orientation vs. mirrored

## Important Files

### Documentation (Start Here)
- `README.md` - Project overview
- `RULES.md` - **Development guidelines** (read this first!)
- `docs/ARCHITECTURE.md` - System design
- `docs/DEVELOPMENT.md` - Setup and workflow
- `docs/games/letter-match.md` - Game 1 requirements
- `docs/games/orientation-game.md` - Game 2 requirements
- `docs/PROJECT_STATUS.md` - Current status and roadmap

### Configuration
- `vite.config.ts` - Vite and PWA config
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencies and scripts

### Code
- `src/App.tsx` - Main component
- `src/main.tsx` - Entry point
- `src/index.css` - Global styles

## Development Workflow

### Before Making Changes
1. Read `RULES.md` - **Critical for consistency**
2. Check `docs/ARCHITECTURE.md` for system design
3. Review relevant game docs in `docs/games/`

### While Making Changes
- Update documentation immediately
- Follow TypeScript strict mode
- Test offline functionality
- Verify mobile responsiveness

### After Making Changes
- Update affected documentation
- Run `npm run lint` and `npm run typecheck`
- Test on mobile viewport
- Verify offline mode works

## Key Principles from RULES.md

1. **Documentation First** - Update docs with every change
2. **Mobile-First** - Design for touch on small screens
3. **Offline-First** - Everything must work offline
4. **Component Reusability** - Check shared library first
5. **Game Isolation** - Games are independent modules

## File Structure

```
foundgarten/
├── docs/              # All documentation
├── public/            # Static assets
│   ├── icons/        # PWA icons (need to add)
│   └── manifest.json # PWA manifest
├── src/
│   ├── components/   # UI components
│   ├── games/        # Game modules
│   ├── lib/          # Core libraries
│   │   ├── storage/  # Dexie/IndexedDB
│   │   ├── router/   # TanStack Router
│   │   └── learning/ # Adaptive algorithms
│   ├── hooks/        # Custom hooks
│   └── utils/        # Utilities
└── RULES.md          # ⭐ Read this!
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev:host         # Dev server on network (mobile testing)

# Quality
npm run lint             # Check code style
npm run lint:fix         # Auto-fix lint issues
npm run typecheck        # TypeScript validation
npm run format           # Format with Prettier

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Testing (when implemented)
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Next Steps

### Phase 1: Core Infrastructure
1. Set up Dexie.js database
2. Create game registry
3. Build shared component library
4. Configure TanStack Router

### Phase 2: Implement Games
1. Letter Match game
2. Orientation Game

### Phase 3: Polish
1. Generate PWA icons
2. Test offline mode
3. Mobile device testing
4. Performance optimization

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Router** - Routing
- **Zustand** - State management
- **Dexie.js** - IndexedDB wrapper
- **Vite PWA Plugin** - Service worker

## Getting Help

1. Check documentation in `/docs`
2. Read `RULES.md` for guidelines
3. Review `docs/ARCHITECTURE.md` for design decisions
4. Check `docs/DEVELOPMENT.md` for troubleshooting

## Remember

**Always update documentation with code changes!**

This is the #1 rule in `RULES.md` and ensures the project stays maintainable.

---

**Status**: Planning complete, ready for implementation
**Next**: Run `npm install` and start building!
