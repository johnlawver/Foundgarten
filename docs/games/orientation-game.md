# Orientation Game

## Game Overview

**Name**: Orientation Game (Mirror Match)
**Type**: Visual Discrimination / Spatial Recognition
**Target Age**: Kindergarten (4-6 years)
**Learning Objective**: Recognize correct orientation vs. horizontally flipped characters

## Game Concept

Two cards are displayed side-by-side: one shows a letter or number in the correct orientation, the other is horizontally flipped (mirrored). The child must tap the correctly oriented character. This helps develop spatial awareness and prevents common letter reversal issues (like confusing 'b' and 'd').

## User Experience Flow

### Game Start
1. Parent taps "Orientation Game" from home screen
2. Game displays welcome screen with instructions:
   - "Tap the letter that's the right way!"
   - Shows example with feedback
3. Parent taps "Start Round" button

### During Gameplay
1. **Card Display**:
   - Two large cards side-by-side
   - Left card: character (randomly correct or flipped)
   - Right card: same character (opposite of left)
   - One is always correct, one is always flipped
   - Score counter at top
   - Round progress indicator

2. **Interaction**:
   - Child taps the card they think is correct
   - Immediate visual feedback:
     - Correct: Card flashes green, +1 score
     - Incorrect: Card flashes red, correct card highlights green
   - Brief pause (1 second) to show feedback
   - Next pair appears

3. **Feedback**:
   - Clear visual indication of correct answer
   - Optional celebratory animation on correct
   - Optional sound effects (configurable)
   - Haptic feedback on tap

### Round Completion
1. After configured number of items (default: 10), show summary:
   - Total correct / total attempted
   - Success rate percentage
   - "Play Again" button
   - "Home" button

### Adaptive Behavior
- Track performance per character (A, B, C, etc.)
- Characters with lower success rates appear more frequently
- Adjust which side (left/right) correct answer appears (prevent pattern gaming)
- Focus on commonly confused letters (b/d, p/q, etc.)

## UI Specifications

### Layout (Portrait)
```
┌─────────────────────────────┐
│  ⚙️              Score: 7/9  │  ← Header
├─────────────────────────────┤
│                             │
│  ┌───────────┐ ┌───────────┐│
│  │           │ │           ││
│  │     b     │ │     d     ││  ← Two cards
│  │           │ │           ││
│  │           │ │           ││
│  └───────────┘ └───────────┘│
│                             │
│                             │
│      Tap the correct        │  ← Instruction
│         letter!             │
│                             │
├─────────────────────────────┤
│        Round 2  •  7 / 10   │  ← Progress
└─────────────────────────────┘
```

### Design Specifications

#### Character Cards
- **Size**: 140px × 180px each (on 375px viewport)
- **Gap**: 20px between cards
- **Background**: White with border
- **Border**: 3px solid, neutral color (#CBD5E0)
- **Border Radius**: 16px
- **Character Size**: 96px font size
- **Font**: Clean sans-serif (same as Letter Match)
- **Character Color**: Dark (#2D3748)

#### Active States
- **Tap**: Scale down slightly (0.95)
- **Correct**: Green border flash + green background tint
- **Incorrect**: Red border flash + red background tint
- **Highlight correct**: Green border + slight green glow

#### Responsive Behavior
- Cards stack vertically on very small screens (<340px)
- Font size scales proportionally
- Minimum touch target: 120×160px

## Data Model

### Storage Schema

```typescript
// Dexie table: orientationGameStatistics
interface OrientationGameStatistics {
  id?: number;              // Auto-increment
  character: string;        // 'A', 'b', '3', etc.
  characterType: 'letter' | 'number';
  caseType: 'uppercase' | 'lowercase' | 'n/a';
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  lastAttempt: Date;
  successRate: number;      // correctCount / totalAttempts
  confusionScore: number;   // How often confused (0-1)
}
```

### Game State (Zustand Store)

```typescript
interface OrientationGameState {
  // Current session
  currentRound: number;
  roundItems: OrientationItem[];
  currentIndex: number;
  currentScore: number;
  roundComplete: boolean;
  showingFeedback: boolean;

  // Actions
  startNewRound: () => Promise<void>;
  handleChoice: (choice: 'left' | 'right') => Promise<void>;
  nextItem: () => void;
  resetGame: () => void;
}

interface OrientationItem {
  character: string;
  correctSide: 'left' | 'right';  // Which side has correct orientation
  weight: number;                  // For adaptive selection
}
```

## Game Logic

### Character Selection

Focus on characters that are commonly reversed:

**High Priority (appear more often)**:
- Lowercase: b, d, p, q
- Uppercase: N, Z, S
- Numbers: 2, 3, 5, 6, 9

**Medium Priority**:
- Uppercase: B, C, D, E, F, G, J, K, L, P, R
- Numbers: 1, 4, 7

**Low Priority** (rarely flipped in practice):
- Symmetric letters: A, H, I, M, O, T, U, V, W, X, Y
- Symmetric numbers: 0, 8

### Round Generation Algorithm

```typescript
async function generateRound(roundNumber: number): Promise<OrientationItem[]> {
  // 1. Fetch statistics
  const stats = await db.orientationGameStatistics.toArray();

  // 2. Calculate weights
  const weights = stats.map(stat => ({
    character: stat.character,
    weight: calculateWeight(stat)
  }));

  // 3. Add priority boost for commonly confused characters
  const boostedWeights = applyPriorityBoost(weights);

  // 4. Select characters for round
  const selectedChars = weightedSelection(boostedWeights, ROUND_SIZE);

  // 5. Randomize which side is correct
  return selectedChars.map(char => ({
    character: char,
    correctSide: Math.random() > 0.5 ? 'left' : 'right',
    weight: weights.find(w => w.character === char)?.weight || 1.0
  }));
}

function applyPriorityBoost(weights: CharacterWeight[]): CharacterWeight[] {
  const HIGH_PRIORITY = ['b', 'd', 'p', 'q', 'N', 'Z', 'S', '2', '3', '5', '6', '9'];
  const BOOST_MULTIPLIER = 1.5;

  return weights.map(w => ({
    ...w,
    weight: HIGH_PRIORITY.includes(w.character)
      ? w.weight * BOOST_MULTIPLIER
      : w.weight
  }));
}
```

### Answer Validation

```typescript
async function handleChoice(choice: 'left' | 'right'): Promise<void> {
  const currentItem = roundItems[currentIndex];
  const isCorrect = choice === currentItem.correctSide;

  // 1. Update UI state
  setShowingFeedback(true);

  // 2. Update score if correct
  if (isCorrect) {
    setCurrentScore(s => s + 1);
  }

  // 3. Record to statistics
  await recordAnswer(currentItem.character, isCorrect);

  // 4. Wait for feedback display
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 5. Move to next item
  setShowingFeedback(false);
  nextItem();
}
```

### Mirroring Logic

Render flipped character using CSS transform:

```typescript
function renderCard(character: string, isFlipped: boolean) {
  return (
    <Card style={{ transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)' }}>
      {character}
    </Card>
  );
}
```

## Settings & Configuration

### Parent Settings Panel

```
┌─────────────────────────────┐
│  Orientation Game Settings  │
├─────────────────────────────┤
│                             │
│  Difficulty                 │
│  ○ Easy  ● Auto  ○ Hard     │
│                             │
│  Character Type             │
│  ● Both  ○ Letters  ○ Numbers│
│                             │
│  Letter Case                │
│  ● Both  ○ Upper  ○ Lower   │
│                             │
│  Round Size                 │
│  [━━━━●━━━━━] 10 items      │
│                             │
│  Sound Effects              │
│  [Toggle ON]                │
│                             │
│  Haptic Feedback            │
│  [Toggle ON]                │
│                             │
│  Show Hints                 │
│  [Toggle OFF]               │
│                             │
│  [ Reset Progress ]         │
│                             │
└─────────────────────────────┘
```

### Configuration Options

```typescript
interface OrientationGameConfig {
  difficulty: 'easy' | 'auto' | 'hard';
  characterType: 'both' | 'letters' | 'numbers';
  letterCase: 'both' | 'uppercase' | 'lowercase';
  roundSize: number;        // 5-20
  soundEnabled: boolean;
  hapticEnabled: boolean;
  showHints: boolean;       // Show subtle arrow indicator
}
```

**Difficulty Modes**:
- **Easy**: Focus on high-priority confused letters, slower pace
- **Auto**: Standard weighted algorithm (default)
- **Hard**: Include symmetric letters, faster feedback

**Show Hints**: When enabled, shows subtle arrow (→) on correct card briefly

## Accessibility

### Touch Targets
- Each card: 140×180px (larger than 44px minimum)
- Settings button: 44×44px minimum
- All buttons: 48×48px minimum

### Visual Accessibility
- High contrast characters
- Color + border changes for feedback (not color alone)
- Large, clear fonts
- Sufficient spacing between cards

### Cognitive Accessibility
- Simple binary choice
- Clear immediate feedback
- Consistent layout
- Visual + haptic feedback

## Performance Considerations

### Optimization Strategies
1. **Preload next pair**: Prepare next characters while displaying current
2. **CSS transforms**: Use GPU-accelerated transforms for mirroring
3. **Memoize renders**: Prevent unnecessary re-renders of cards
4. **Debounce taps**: Prevent accidental double-taps during feedback

### Animation Performance
- Use `transform` for flip effect (not re-rendering)
- Use `will-change` on interactive cards
- Keep feedback animations under 300ms

## Testing Checklist

### Functional Tests
- [ ] Correct card tap registers as correct
- [ ] Incorrect card tap registers as incorrect
- [ ] Flipped character renders correctly (mirror image)
- [ ] Statistics update after each answer
- [ ] Adaptive algorithm surfaces struggling characters
- [ ] Correct side randomizes (not always left or right)
- [ ] Settings persist between sessions

### UX Tests
- [ ] Cards are easy to distinguish
- [ ] Tap targets are comfortable for children
- [ ] Feedback is immediate and clear
- [ ] Commonly confused letters (b/d) are prioritized
- [ ] Animation is smooth and not distracting

### Edge Cases
- [ ] First-time user (no prior data)
- [ ] All characters 100% success rate
- [ ] Rapid tapping doesn't break state
- [ ] Small screen layout works (320px)
- [ ] Offline mode functions perfectly

## Assets Required

### Images
- None (text-based)

### Sounds (Optional)
- `correct.mp3` - Success sound
- `incorrect.mp3` - Error sound
- `complete.mp3` - Round completion

### Icons
- Settings gear icon
- Home icon
- Hint arrow (→) if showHints enabled

## Character Set

### Letters (Uppercase)
```
Priority: N, Z, S
Include: B, C, D, E, F, G, J, K, L, P, R
Optional: A, H, I, M, O, T, U, V, W, X, Y
```

### Letters (Lowercase)
```
Priority: b, d, p, q
Include: a, c, e, f, g, h, j, k, n, r, s, z
Optional: i, l, m, o, t, u, v, w, x, y
```

### Numbers
```
Priority: 2, 3, 5, 6, 9
Include: 1, 4, 7
Optional: 0, 8
```

## Future Enhancements

### Potential Additions (Post-MVP)
- **Vertical Flip Mode**: Rotate upside-down instead of mirror
- **Three Card Mode**: One correct, two flipped (harder)
- **Timed Mode**: Add time pressure for older kids
- **Word Mode**: Show whole words (some mirrored)
- **Custom Character Sets**: Parent chooses specific letters to practice
- **Progressive Difficulty**: Start with one pair, increase to multiple
- **Animations**: Celebratory effects on streaks
- **Tutorial Mode**: Guided introduction with hints

## Educational Rationale

### Learning Benefits
1. **Spatial Awareness**: Develops left/right discrimination
2. **Letter Recognition**: Reinforces correct letter formation
3. **Reversal Prevention**: Helps prevent common b/d, p/q confusion
4. **Visual Discrimination**: Strengthens attention to detail
5. **Pattern Recognition**: Builds cognitive pattern-matching skills

### Pedagogical Approach
- Immediate feedback reinforces correct choices
- Adaptive repetition for struggling characters
- Low-pressure environment (no time limits by default)
- Parent involvement enables discussion and guidance

## Change Log

### Version 1.0 (Initial Requirements)
- Defined two-card tap-based gameplay
- Established character priority system
- Designed adaptive learning for orientation
- Specified mirroring implementation
- Created settings and configuration

---

**Last Updated**: 2025-01-17
**Status**: Planning Phase
**Author**: Project Team
