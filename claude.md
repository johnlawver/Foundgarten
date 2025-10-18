# Foundgarten - Claude Context

**Quick context for AI assistants working on this project.**

## What This Project Is

A mobile-first, offline-capable PWA for kindergarten learning games. Parents hold the device while children interact through touch (swipes, taps). All data stays local - no cloud, no tracking, no internet required.

## Critical Constraints

1. **Offline-First**: Every feature MUST work without internet
2. **Mobile-First**: Design for 320px-414px viewports, touch interactions only
3. **Data Persistence**: Use IndexedDB (via Dexie.js) - NEVER localStorage
4. **Game Isolation**: Games are self-contained modules in `/src/games/[game-name]/`
5. **Documentation First**: Update docs WITH code changes, not after

## Tech Stack at a Glance

- **React 18** + **TypeScript** + **Vite**
- **TanStack Router** (type-safe, file-based routing)
- **Zustand** (state management - separate store per game)
- **Dexie.js** (IndexedDB wrapper for persistence)
- **Tailwind CSS v4** (utility-first styling)
- **Vite PWA Plugin** (service worker, offline caching)

## Design System

### Visual Style: Neo-Brutalist Playful

The app uses a **neo-brutalist design** with playful, child-friendly elements inspired by modern educational apps (see `/inspo` directory). This creates a fun, engaging experience while maintaining clarity and accessibility.

**Core Aesthetic Principles**:
- Bold, thick black borders (`border-[3px]` or `border-[2px]`)
- Hard drop shadows (no blur) - `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` or `shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`
- Large border radius for organic feel (`rounded-[32px]`, `rounded-2xl`)
- Rotated elements for playfulness (`transform rotate-3`, `-rotate-6`)
- Heavy use of emojis as visual icons
- Organic blob shapes in backgrounds

### Color Palette

**Primary Colors** (warm, friendly, educational):
- **Yellow**: Primary accent, buttons, highlights
  - `bg-yellow-400` - Bright yellow for primary actions
  - `bg-yellow-300` - Medium yellow for badges, accents
  - `bg-yellow-200` - Light yellow for backgrounds, blobs
  - `bg-yellow-50` - Very light yellow for subtle backgrounds

- **Teal**: Secondary actions, alternating elements
  - `bg-teal-400` - Bright teal for CTAs, icons
  - `bg-teal-300` - Medium teal for cards
  - `bg-teal-200` - Light teal for backgrounds, blobs

- **Coral**: Tertiary accent, status indicators
  - `bg-coral-400` - Bright coral for badges, alerts
  - `bg-coral-200` - Light coral for backgrounds, blobs

**Neutrals**:
- `bg-[#f7f7f7]` - Main app background (soft gray)
- `bg-white` - Card backgrounds
- `bg-black` / `text-black` - Borders and primary text
- `text-gray-700` - Secondary text
- `text-gray-600` - Tertiary text

### Typography

**Font Weights** (bold hierarchy for readability):
- `font-black` (900) - Main headings, titles
- `font-bold` (700) - Subheadings, emphasized text
- `font-semibold` (600) - Labels, small headings
- `font-medium` (500) - Body text, descriptions

**Text Sizes** (large for children):
- `text-5xl` - Main app title (3rem)
- `text-4xl` - Section headings (2.25rem)
- `text-3xl` - Card titles (1.875rem)
- `text-xl` - Game card headings (1.25rem)
- `text-lg` - Body text large (1.125rem)
- `text-sm` - Labels, meta info (0.875rem)
- `text-xs` - Badges, tiny labels (0.75rem)

### Component Patterns

**Cards** (main container pattern):
```tsx
className="bg-white rounded-[32px] p-6 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
```
- White background
- Extra large border radius (32px)
- Thick black border (3px)
- Hard shadow (6px offset, no blur)

**Hover Effects** (for interactive cards):
```tsx
className="... hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
```
- Increase shadow offset on hover
- Smooth transition

**Icon Containers** (playful squares):
```tsx
// Alternating rotations
className="w-16 h-16 bg-yellow-300 rounded-2xl flex items-center justify-center border-[3px] border-black transform rotate-3"
className="w-16 h-16 bg-teal-300 rounded-2xl flex items-center justify-center border-[3px] border-black transform -rotate-3"
```
- 64x64px minimum (touch-friendly)
- Alternating background colors
- Slight rotation (±3deg) for playfulness
- Contains emoji (text-4xl size)

**Badges/Pills**:
```tsx
className="px-3 py-1 bg-yellow-200 rounded-full border-[2px] border-black text-xs font-bold"
```
- Fully rounded (rounded-full)
- 2px border (slightly thinner than cards)
- Small padding, extra small bold text

**Buttons** (primary action):
```tsx
// From inspiration - solid filled
className="px-6 py-3 bg-yellow-400 rounded-full border-[3px] border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"

// Secondary - outlined/dashed
className="px-6 py-3 bg-white rounded-full border-[3px] border-black border-dashed font-bold"
```

### Background Decorations

**Organic Blobs** (decorative, non-interactive):
```tsx
{/* Fixed positioning, pointer-events-none */}
<div className="fixed inset-0 overflow-hidden pointer-events-none">
  {/* Yellow blob - top left */}
  <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-200 rounded-full"
       style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }} />

  {/* Teal blob - top right */}
  <div className="absolute -top-20 right-10 w-64 h-64 bg-teal-200 rounded-full opacity-60"
       style={{ clipPath: 'ellipse(60% 70% at 50% 50%)' }} />

  {/* Coral blob - bottom right */}
  <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-coral-200 rounded-full opacity-50" />

  {/* Decorative dots */}
  <div className="absolute top-40 left-20 w-4 h-4 bg-yellow-400 rounded-full" />
</div>
```

### Spacing & Sizing

**Touch Targets**:
- Minimum 44x44px (but prefer 64x64px for icon containers)
- Buttons: min 48px height
- Generous padding: `p-6` (1.5rem) for cards, `p-4` (1rem) for smaller elements

**Layout Spacing**:
- Section gaps: `space-y-10` (2.5rem between major sections)
- Card gaps: `gap-6` (1.5rem in grids)
- Internal spacing: `gap-4` or `gap-5` (1-1.25rem)

**Container Widths**:
- Max width: `max-w-5xl` (64rem) for main content
- Responsive grids: `grid md:grid-cols-2` (single column mobile, 2 cols desktop)

### Animation & Interaction

**Transitions**:
```tsx
className="... transition-all" // Smooth transitions for hover states
className="... group-hover:text-teal-600 transition-colors" // Text color change
```

**States**:
- Hover: Increase shadow, subtle color change
- Active: (To be defined per game)
- Disabled: (To be defined - likely reduced opacity + no border)

### Design Implementation Checklist

When creating new UI components, ensure:
- [ ] Uses 3px black borders for cards, 2px for small elements
- [ ] Has hard drop shadow (4px or 6px offset, no blur)
- [ ] Large border radius (32px for cards, 16px+ for smaller)
- [ ] Touch target minimum 44px, prefer 64px
- [ ] Uses established color palette (yellow/teal/coral)
- [ ] Bold typography (font-black for titles, font-bold for emphasis)
- [ ] Emojis at appropriate sizes (text-4xl for icons, text-6xl for large decorative)
- [ ] Smooth transitions on interactive elements
- [ ] Background decorations don't interfere (pointer-events-none)

### Inspiration Sources

See `/inspo` directory for design reference:
- Neo-brutalist card layouts with thick borders
- Soft pastel blob backgrounds
- Playful rotated elements
- Clear visual hierarchy
- Touch-friendly sizing
- Teal as primary action color
- Dashed borders for secondary actions

## File Structure Quick Reference

```
src/
  components/
    shared/     # Reusable UI (Button, Card, ScoreDisplay, etc.)
    layout/     # App shell (Header, Navigation, AppShell)
  games/
    [game-name]/
      components/  # Game-specific UI
      store/       # Zustand store for this game
      utils/       # Game logic, adaptive learning
      types.ts     # Game type definitions
      index.tsx    # Game entry point
  lib/
    storage/    # Dexie setup, migrations, DB types
    router/     # TanStack Router config
    learning/   # Adaptive learning algorithms
  hooks/        # Shared React hooks
  utils/        # Shared utilities
  types/        # Shared TypeScript types
```

## Key Patterns

### Adding/Modifying a Game
1. Game lives in `/src/games/[game-name]/`
2. Game has own Zustand store for session state
3. Game persists to dedicated IndexedDB table
4. Update `/docs/games/[game-name].md` with changes
5. Register in game registry

### Data Flow
```
User Action → Game Store (Zustand) → UI Update + IndexedDB Write
                ↓
   Statistics Service → Adaptive Algorithm → Select Next Items
```

### Adaptive Learning Default
- Track correct/incorrect per item (letter, number, etc.)
- Calculate `errorWeight = 1 - (correctCount / totalAttempts)`
- Use weighted random selection - items with lower success appear more often
- Parents can override with difficulty settings

## Common Pitfalls (Don't Do This!)

❌ Use `localStorage` for game data → Use IndexedDB via Dexie
❌ Create new components without checking `components/shared/` → Reuse first
❌ Couple games together → Keep them isolated
❌ Assume internet connectivity → Design offline-first
❌ Make breaking changes without updating docs → Update docs in same commit
❌ Skip mobile testing → Every change should work at 320px width
❌ Ignore the design system → Follow neo-brutalist patterns (thick borders, hard shadows, bold colors)
❌ Use thin borders or soft shadows → Stick to 3px borders and hard `shadow-[Xpx_Xpx_0px_0px_rgba(0,0,0,1)]`
❌ Create custom colors → Use established palette (yellow/teal/coral + neutrals)

## Quick References

### Available Scripts
```bash
npm run dev          # Dev server (localhost:5173)
npm run dev:host     # Dev server accessible on network
npm run build        # Production build
npm run typecheck    # TypeScript validation
npm run lint         # ESLint
npm run test         # Vitest tests
```

### Documentation Structure
- `README.md` - Project overview, setup, features
- `RULES.md` - AI assistance guidelines, code standards
- `docs/ARCHITECTURE.md` - Technical architecture, design patterns
- `docs/DEVELOPMENT.md` - Development workflow, setup
- `docs/games/[game-name].md` - Individual game specs

## Things to Always Remember

1. **Documentation First**: Update docs with EVERY code change
2. **Design System**: Follow neo-brutalist style (3px borders, hard shadows, yellow/teal/coral palette)
3. **Touch-First**: Minimum 44x44px touch targets
4. **Aggregate Stats**: Store totals, not individual sessions
5. **Game Registry**: Games register themselves
6. **Parent Controls**: Make settings simple and intuitive
7. **Learning Objective**: Keep it clear - what skill is this teaching?

## Current Status

- **Phase**: Initial development
- **Planned Games**: Letter Match, Orientation Game (Mirror Match)
- **Git Branch**: `main`

## When to Ask the User

- Does this affect offline capability?
- Should this be parent-configurable?
- Does this introduce a new architectural pattern?
- Will a 5-year-old be able to interact with this?
- Is the learning objective still clear?

## Testing Checklist

- [ ] Works at 320px viewport width
- [ ] Works completely offline
- [ ] Data persists to IndexedDB correctly
- [ ] Touch targets are 44x44px minimum
- [ ] Follows design system (3px borders, hard shadows, established colors)
- [ ] Uses bold typography (font-black/font-bold)
- [ ] TypeScript compiles without errors
- [ ] Follows existing component patterns

---

**For full details, see comprehensive docs in `/docs`**
