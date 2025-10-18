# AI Assistance Rules

This document provides guidelines for AI assistants working on this project. Following these rules ensures consistency, maintainability, and quality throughout development.

## Core Principles

### 1. Documentation First
**With every code change, update relevant documentation.**

- If you modify architecture, update `/docs/ARCHITECTURE.md`
- If you change a game's behavior, update the corresponding `/docs/games/[game-name].md`
- If you add dependencies or change setup, update `/docs/DEVELOPMENT.md`
- Keep `README.md` accurate and up-to-date
- Document WHY decisions were made, not just WHAT was changed

### 2. Mobile-First, Offline-First
**Every feature must work offline on mobile devices.**

- Design for touch interactions first
- Test responsive layouts at mobile breakpoints (320px, 375px, 414px)
- Ensure all assets are properly cached for offline use
- Verify IndexedDB operations handle offline scenarios
- Consider slow/intermittent connections gracefully

### 3. Data Persistence
**Respect the user's data. Never lose game progress.**

- All game state must persist to IndexedDB via Dexie.js
- Implement proper error handling for storage operations
- Test data migration scenarios when schema changes
- Never clear user data without explicit consent
- Log storage errors for debugging

### 4. Component Reusability
**Build shared components, avoid duplication.**

- Check `/src/components/shared` before creating new components
- Extract common patterns into reusable components
- Document component props and usage examples
- Keep game-specific logic in game directories
- Share UI patterns through the component library

### 5. Game Isolation
**Games should be self-contained modules.**

- Each game lives in `/src/games/[game-name]/`
- Games manage their own state via Zustand stores
- Games can share utilities but not state
- Each game has its own IndexedDB table
- Games register themselves in the game registry

## Code Standards

### File Organization
```
/src
  /components
    /shared        # Reusable UI components
    /layout        # App shell components
  /games
    /[game-name]   # Self-contained game modules
      /components  # Game-specific components
      /store       # Game state management
      /utils       # Game-specific utilities
      index.tsx    # Game entry point
      types.ts     # Game type definitions
  /lib
    /storage       # IndexedDB/Dexie utilities
    /router        # TanStack Router config
  /hooks           # Shared React hooks
  /utils           # Shared utilities
```

### Naming Conventions
- Components: PascalCase (`GameCard.tsx`)
- Files: kebab-case (`game-utils.ts`)
- Hooks: camelCase with 'use' prefix (`useGameState.ts`)
- Types: PascalCase (`GameConfig.ts`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_ROUNDS`)

### TypeScript Requirements
- Use TypeScript for all new code
- Define explicit types for component props
- Avoid `any` - use `unknown` if type is truly unknown
- Export types that other modules might need
- Use interfaces for object shapes, types for unions/primitives

### Testing Expectations
- Test critical game logic (scoring, state transitions)
- Test adaptive learning algorithms
- Test offline storage operations
- Test PWA installation and caching
- Document test scenarios in game requirement docs

## Development Workflow

### Before Making Changes
1. Read relevant documentation in `/docs`
2. Understand the architectural implications
3. Check if similar functionality exists
4. Plan the change with the user if significant

### While Making Changes
1. Keep changes focused and atomic
2. Update related documentation immediately
3. Add comments for complex logic
4. Test offline functionality
5. Verify mobile responsiveness

### After Making Changes
1. Update all affected documentation
2. Verify no regressions in existing games
3. Test on mobile viewport sizes
4. Confirm offline functionality works
5. Update README if user-facing changes

## Game Development Guidelines

### Adaptive Learning Algorithm
- Track correct/incorrect answers per item (letter, number, etc.)
- Calculate success rate for each item
- Serve items with lower success rates more frequently
- Default algorithm: weighted random selection based on error rate
- Allow parent override via settings (difficulty adjustment)
- Store aggregate statistics, not individual sessions

### Parent Controls
- Automatic difficulty adjustment by default
- Optional manual override for difficulty
- Clear feedback on child's progress
- Simple, intuitive settings UI
- Settings persist per game

### Accessibility
- Large, touch-friendly targets (minimum 44x44px)
- High contrast colors for visibility
- Simple, clear instructions
- Audio feedback for interactions (when appropriate)
- Support for landscape and portrait orientations

### Performance
- Minimize re-renders with React.memo and useMemo
- Lazy load games to reduce initial bundle size
- Optimize images and assets for mobile
- Keep bundle sizes small for fast offline loading
- Profile performance on lower-end devices

## Documentation Requirements

### When Adding a New Game
1. Create `/docs/games/[game-name].md` with:
   - Game concept and learning objectives
   - UI/UX specifications
   - Data model and storage requirements
   - Adaptive learning algorithm specifics
   - Parent control options
   - Assets needed (images, sounds, etc.)

2. Update `/docs/ARCHITECTURE.md` if introducing new patterns

3. Update `README.md` with game description

### When Changing Architecture
1. Update `/docs/ARCHITECTURE.md` immediately
2. Document migration path if breaking change
3. Update affected game documentation
4. Add rationale for the change

### When Adding Dependencies
1. Update `/docs/DEVELOPMENT.md` with setup instructions
2. Document why the dependency was chosen
3. Note bundle size impact
4. Verify offline compatibility

## Common Pitfalls to Avoid

❌ **Don't** create new components without checking shared library
✅ **Do** reuse and extend existing shared components

❌ **Don't** make breaking changes without updating docs
✅ **Do** update documentation in the same commit

❌ **Don't** assume online connectivity
✅ **Do** design for offline-first from the start

❌ **Don't** use localStorage for game data
✅ **Do** use IndexedDB via Dexie.js for all persistent data

❌ **Don't** couple games together
✅ **Do** keep games as independent modules

❌ **Don't** skip mobile testing
✅ **Do** verify every change on mobile viewport

## Questions to Ask

When uncertain, ask the user:
- Does this change affect the offline experience?
- Should this be configurable by parents?
- Does this introduce a new architectural pattern?
- Will this work well on a 5-year-old's touch interaction?
- Is the learning objective still clear?

## Resources

- [Dexie.js Documentation](https://dexie.org/)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [Mobile Touch Guidelines](https://web.dev/mobile-touch/)
