# Foundgarten

**Foundational Kindergarten learning games**

A mobile-first, offline-capable Progressive Web App (PWA) designed to help kindergarten-aged children learn through interactive games.

## Current Status

**Version**: 0.1.0 (Initial Implementation)
**Status**: 🎮 Letter Match game is fully playable!

**What's Working**:
- ✅ Letter Match game with swipe-based gameplay
- ✅ **Multi-child profiles** with separate progress tracking
- ✅ **Letter Progress view** showing success rates for all letters
- ✅ Adaptive learning algorithm
- ✅ Offline data persistence (IndexedDB)
- ✅ Neo-brutalist design system
- ✅ Mobile-optimized touch interactions
- ✅ Netlify deployment configured

**In Development**:
- 🚧 Orientation Game (Mirror Match)
- 🚧 PWA service worker verification

## Overview

Foundgarten provides adaptive learning experiences that adjust based on each child's performance. All games work completely offline, persist data locally on the device, and are optimized for touch interactions on mobile phones.

## Features

- **Multi-Child Profiles**: Create separate profiles for each child with independent progress tracking
- **Offline-First**: Works completely without internet connectivity
- **Mobile-Optimized**: Designed for mobile phones with touch-friendly interfaces
- **Adaptive Learning**: Games adjust difficulty based on performance
- **Progressive Web App**: Installable on home screen, works like a native app
- **Privacy-Focused**: All data stored locally on device, never transferred anywhere
- **Parent Controls**: Simple settings to adjust difficulty and preferences

## Games

### Letter Match ✅ (Implemented)
A swipe-based letter recognition game where children identify uppercase and lowercase letters. Parents show their child a letter and swipe right for correct answers or left for incorrect ones.

**Status**: Fully playable with adaptive learning
**Features**:
- Swipe gestures (touch and mouse support)
- Visual feedback overlays
- Round statistics and progress tracking
- **Letter Progress view** with color-coded success rates
- **Uppercase/lowercase toggle** to view separate or combined statistics
- **Profile-scoped progress** - each child's data tracked separately
- Configurable difficulty settings
- IndexedDB persistence for learning progress

**Learning Objectives**:
- Uppercase and lowercase letter recognition
- Letter matching skills
- Visual discrimination

### Orientation Game (Mirror Match) 🚧 (Planned)
A tap-based game where children identify correctly oriented letters and numbers versus horizontally flipped (mirrored) ones. Helps prevent common letter reversals like b/d and p/q.

**Status**: Database schema ready, game implementation pending

**Learning Objectives**:
- Spatial awareness and orientation
- Letter reversal prevention
- Visual discrimination
- Attention to detail

## Technology Stack

- **React 18+** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **TanStack Router** - Type-safe routing
- **Zustand** - State management
- **Dexie.js** - IndexedDB wrapper for data persistence
- **Vite PWA Plugin** - Service worker and PWA capabilities

## Getting Started

### Prerequisites

- Node.js v18.0.0 or higher
- npm v9.0.0 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd foundgarten

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Testing on Mobile

```bash
# Start dev server accessible on network
npm run dev:host
```

Access from your mobile device using your computer's local IP address.

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Architecture](docs/ARCHITECTURE.md)** - System design, technology decisions, and project structure
- **[Development Guide](docs/DEVELOPMENT.md)** - Setup, workflow, and development best practices
- **[Letter Match Game](docs/games/letter-match.md)** - Detailed game requirements and specifications
- **[Orientation Game](docs/games/orientation-game.md)** - Detailed game requirements and specifications
- **[AI Assistance Rules](RULES.md)** - Guidelines for AI-assisted development

## Project Structure

```
foundgarten/
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   └── games/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   ├── games/            # Game modules
│   ├── lib/              # Core libraries
│   ├── hooks/            # Custom hooks
│   └── utils/            # Utilities
├── RULES.md              # AI assistance guidelines
└── README.md             # This file
```

## Development Workflow

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
npm run test         # Run tests
```

### Key Development Principles

1. **Documentation First** - Update documentation with every code change
2. **Mobile-First** - Design for touch and small screens first
3. **Offline-First** - Ensure all features work without connectivity
4. **Component Reusability** - Build shared components, avoid duplication
5. **Game Isolation** - Games are self-contained modules

See [RULES.md](RULES.md) for detailed development guidelines.

## Adding a New Game

1. Create game directory: `src/games/your-game/`
2. Create game documentation: `docs/games/your-game.md`
3. Define database schema in `src/lib/storage/db.ts`
4. Create Zustand store in `src/games/your-game/store/`
5. Build game component in `src/games/your-game/index.tsx`
6. Register game in game registry
7. Update relevant documentation

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md#adding-a-new-game) for detailed instructions.

## Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Deployment

### Netlify (Configured)

The project includes `netlify.toml` configuration for automatic deployment:

```bash
# Build and deploy automatically on push to main branch
git push origin main
```

**Features**:
- Automatic builds on git push
- SPA redirects for client-side routing
- PWA-optimized headers
- Asset caching (1 year for static files)
- Service worker support (no-cache for updates)

**Manual Deployment**:
```bash
# Build locally
npm run build

# Deploy to Netlify (via CLI or drag-and-drop)
netlify deploy --prod --dir=dist
```

### Alternative Hosting

The app can be deployed to any static hosting service that supports:
- SPA redirects (`/*` → `/index.html`)
- HTTPS (required for PWA service workers)
- Custom headers (optional, for caching optimization)

**Recommended Services**:
- **Netlify** ✅ (configured and recommended)
- **Vercel** - Git-based deployment
- **GitHub Pages** - Free static hosting
- **Firebase Hosting** - Google's hosting solution

**Deployment Steps**:
1. Run `npm run build` to create production build
2. Upload the contents of the `dist/` folder to your hosting service
3. Configure SPA redirects (if needed)
4. Ensure HTTPS is enabled

## PWA Installation

Once deployed, users can install the app on their devices:

1. Visit the app in a mobile browser
2. Tap the browser menu
3. Select "Add to Home Screen" or "Install App"
4. The app icon will appear on the home screen

The app will work offline after installation, with all data stored locally.

## Browser Support

- **Chrome/Edge**: Full support (recommended)
- **Safari iOS**: Full support
- **Firefox**: Full support
- **Samsung Internet**: Full support

Minimum requirements:
- ES2020 support
- IndexedDB support
- Service Worker support

## Privacy & Security

- **No external tracking** - No analytics or third-party scripts
- **Local storage only** - All data stored on device
- **No accounts required** - No user authentication or personal data collection
- **Offline-capable** - No network requests needed for functionality

## Contributing

Before contributing:

1. Read [RULES.md](RULES.md) for development guidelines
2. Review [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design
3. Check [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for workflow

Key guidelines:
- Update documentation with code changes
- Follow TypeScript best practices
- Test offline functionality
- Verify mobile responsiveness
- Write tests for new features

## Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test coverage focuses on:
- Game logic and scoring
- Adaptive learning algorithms
- Database operations
- Offline functionality

## Roadmap

### Phase 1: MVP ✅ (Current)
- ✅ Letter Match game
- ✅ Adaptive learning algorithm
- ✅ IndexedDB persistence
- ✅ Neo-brutalist design system
- ✅ Mobile-first responsive UI
- ✅ Deployment configuration

### Phase 2: Next Steps 🚧
- 🚧 Orientation Game (Mirror Match)
- 🚧 PWA service worker verification
- 🚧 Sound effects and haptic feedback
- 🚧 Parent statistics dashboard

### Phase 3: Future Features
- Additional learning games (counting, colors, shapes)
- Multi-device sync (optional cloud backup)
- Audio instructions and pronunciation
- Detailed progress tracking and charts
- Progress export/sharing
- Multi-language support
- Custom letter/number sets

### Current Status
- **Phase**: Phase 1 Complete, Phase 2 In Progress
- **Version**: 0.1.0 (Initial Implementation)
- **Games**: Letter Match (playable), Orientation Game (planned)

## License

[License information to be added]

## Acknowledgments

Built with modern web technologies to provide kindergarten children with engaging, educational experiences that work anywhere, anytime.

## Support

For questions, issues, or contributions:
- Review documentation in `/docs`
- Check [RULES.md](RULES.md) for development guidelines
- Open an issue for bugs or feature requests

---

**Foundational Kindergarten learning games - built for young learners, designed for offline use, optimized for mobile devices.**
