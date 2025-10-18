# Letter Match Game

## Game Overview

**Name**: Letter Match
**Type**: Swipe-based Letter Recognition
**Target Age**: Kindergarten (4-6 years)
**Learning Objective**: Uppercase and lowercase letter recognition and matching

## Game Concept

A Tinder-style swipe interface where children match lowercase letters with their uppercase counterparts. The parent holds the phone, shows the child a letter, asks "What letter is this?" and then swipes left (incorrect) or right (correct) based on the child's verbal response.

## User Experience Flow

### Game Start
1. Parent taps "Letter Match" from home screen
2. Game displays welcome screen with instructions:
   - "Show your child the letter"
   - "Ask: 'What letter is this?'"
   - "Swipe ➡️ if correct, ⬅️ if incorrect"
3. Parent taps "Start Round" button

### During Gameplay
1. **Card Display**:
   - Large letter card fills most of screen
   - Letter shown in center (either uppercase OR lowercase)
   - Subtle swipe indicators on edges (left/right)
   - Current score displayed at top
   - Round progress indicator (e.g., "12 / 26")

2. **Interaction**:
   - Parent asks child to identify the letter
   - Parent swipes right if child answers correctly
   - Parent swipes left if child answers incorrectly
   - Card animates off screen in swipe direction
   - Next card slides in from bottom

3. **Feedback**:
   - Quick visual feedback on swipe (green checkmark / red X)
   - Optional haptic feedback on correct answers
   - Optional sound effects (configurable)

### Round Completion
1. After all letters shown, display round summary:
   - Total correct / total attempted
   - Success rate percentage
   - "Play Again" button
   - "Home" button

### Adaptive Behavior
- First round: Show all 26 letters once in random order
- Subsequent rounds:
  - Letters with lower success rates appear more frequently
  - Letters with 100% success rate may be skipped or shown less
  - Round size adjusts (e.g., 15-20 letters instead of 26)

## UI Specifications

### Layout
```
┌─────────────────────────────┐
│  ⚙️              Score: 8/10 │  ← Header
├─────────────────────────────┤
│                             │
│       ⬅️                     │  ← Left swipe hint
│                             │
│      ┌─────────────┐        │
│      │             │        │
│      │      A      │        │  ← Letter card
│      │             │        │
│      └─────────────┘        │
│                             │
│                    ➡️       │  ← Right swipe hint
│                             │
├─────────────────────────────┤
│      Round 1  •  12 / 26    │  ← Progress
└─────────────────────────────┘
```

### Design Specifications

#### Letter Card
- **Size**: 280px × 380px (on 375px wide viewport)
- **Background**: White with subtle shadow
- **Border Radius**: 24px
- **Letter Size**: 180px font size
- **Font**: Clean sans-serif (e.g., Poppins, Nunito)
- **Letter Color**: High contrast (#2D3748 on white)

#### Swipe Indicators
- **Left (Incorrect)**: Red (#EF4444), X icon or ⬅️
- **Right (Correct)**: Green (#10B981), ✓ icon or ➡️
- **Opacity**: 0.3 when idle, 1.0 when swiping

#### Feedback Animation
- **Swipe Duration**: 250ms ease-out
- **Card Entry**: 200ms slide-up from bottom
- **Success Flash**: Brief green glow (100ms)
- **Error Flash**: Brief red glow (100ms)

### Responsive Behavior
- Card scales down on smaller screens (320px viewport)
- Maintains aspect ratio and touch targets
- Letter font size scales proportionally

## Data Model

### Storage Schema

```typescript
// Dexie table: letterMatchStatistics
interface LetterMatchStatistics {
  id?: number;              // Auto-increment
  letter: string;           // 'A', 'B', 'C', etc.
  caseType: 'uppercase' | 'lowercase';
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  lastAttempt: Date;
  successRate: number;      // correctCount / totalAttempts
}
```

### Game State (Zustand Store)

```typescript
interface LetterMatchState {
  // Current session
  currentRound: number;
  sessionLetters: Letter[];     // Letters for current round
  currentIndex: number;         // Index in sessionLetters
  currentScore: number;         // Correct in this round
  roundComplete: boolean;

  // Actions
  startNewRound: () => Promise<void>;
  recordAnswer: (letter: string, correct: boolean) => Promise<void>;
  nextLetter: () => void;
  resetGame: () => void;
}

interface Letter {
  character: string;
  caseType: 'uppercase' | 'lowercase';
  weight: number;           // For adaptive selection
}
```

## Game Logic

### Round Generation Algorithm

```typescript
async function generateRound(roundNumber: number): Promise<Letter[]> {
  // 1. Fetch statistics for all letters
  const stats = await db.letterMatchStatistics.toArray();

  // 2. Calculate weights for each letter
  const weights = stats.map(stat => ({
    letter: stat.letter,
    caseType: stat.caseType,
    weight: calculateWeight(stat)
  }));

  // 3. Select letters based on weights
  if (roundNumber === 1) {
    // First round: all letters A-Z, random case
    return generateFirstRound();
  } else {
    // Adaptive rounds: weighted selection
    return weightedSelection(weights, ROUND_SIZE);
  }
}

function calculateWeight(stat: LetterMatchStatistics): number {
  if (stat.totalAttempts === 0) {
    return 1.0;  // Never seen, high priority
  }

  // Error weight: 1 - successRate
  const errorWeight = 1 - stat.successRate;

  // Recent attempts boost (show recently missed letters more)
  const daysSinceLastAttempt =
    (Date.now() - stat.lastAttempt.getTime()) / (1000 * 60 * 60 * 24);
  const recencyBoost = daysSinceLastAttempt > 7 ? 1.2 : 1.0;

  return errorWeight * recencyBoost;
}
```

### Answer Recording

```typescript
async function recordAnswer(letter: string, correct: boolean): Promise<void> {
  // 1. Get or create statistics record
  let stat = await db.letterMatchStatistics
    .where({ letter, caseType: currentLetter.caseType })
    .first();

  if (!stat) {
    stat = {
      letter,
      caseType: currentLetter.caseType,
      totalAttempts: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastAttempt: new Date(),
      successRate: 0
    };
  }

  // 2. Update counts
  stat.totalAttempts++;
  if (correct) {
    stat.correctCount++;
  } else {
    stat.incorrectCount++;
  }

  // 3. Recalculate success rate
  stat.successRate = stat.correctCount / stat.totalAttempts;
  stat.lastAttempt = new Date();

  // 4. Save to database
  await db.letterMatchStatistics.put(stat);
}
```

## Settings & Configuration

### Parent Settings Panel

Accessible via ⚙️ icon in game header:

```
┌─────────────────────────────┐
│   Letter Match Settings     │
├─────────────────────────────┤
│                             │
│  Difficulty                 │
│  ○ Easy  ● Auto  ○ Hard     │
│                             │
│  Letter Case                │
│  ● Both  ○ Upper  ○ Lower   │
│                             │
│  Round Size                 │
│  [━━━━●━━━━━] 15 letters    │
│                             │
│  Sound Effects              │
│  [Toggle ON]                │
│                             │
│  Haptic Feedback            │
│  [Toggle ON]                │
│                             │
│  [ Reset Progress ]         │
│                             │
└─────────────────────────────┘
```

### Configuration Options

```typescript
interface LetterMatchConfig {
  difficulty: 'easy' | 'auto' | 'hard';
  letterCase: 'both' | 'uppercase' | 'lowercase';
  roundSize: number;        // 10-26
  soundEnabled: boolean;
  hapticEnabled: boolean;
}
```

**Difficulty Modes**:
- **Easy**: Flatten weights, more even distribution of letters
- **Auto**: Standard weighted algorithm (default)
- **Hard**: Amplify weights, focus heavily on struggling letters

**Letter Case**:
- **Both**: Show mix of uppercase and lowercase (default)
- **Uppercase**: Only show uppercase letters
- **Lowercase**: Only show lowercase letters

**Round Size**: Number of letters per round (slider: 10-26)

## Accessibility

### Touch Targets
- Swipe area: Full card (280×380px)
- Settings button: 44×44px minimum
- All buttons: 48×48px minimum

### Visual Accessibility
- High contrast ratio (WCAG AA: 4.5:1 minimum)
- Large, clear letter fonts
- Color is not the only indicator (icons + color)

### Optional Features (Future)
- Audio pronunciation of letters
- Screen reader support for parent instructions
- Adjustable font sizes

## Performance Considerations

### Optimization Strategies
1. **Preload next card**: Load next letter while current is displayed
2. **Lazy load sounds**: Only load if sound enabled
3. **Debounce rapid swipes**: Prevent accidental double-swipes
4. **Batch database writes**: Update stats in microtask

### Animation Performance
- Use CSS transforms for swipe animations (GPU-accelerated)
- Use `will-change` property on swipe cards
- Limit simultaneous animations

## Testing Checklist

### Functional Tests
- [ ] All 26 letters appear in first round
- [ ] Swipe left records incorrect answer
- [ ] Swipe right records correct answer
- [ ] Statistics update in IndexedDB
- [ ] Adaptive algorithm increases frequency of incorrect letters
- [ ] Settings persist between sessions
- [ ] Reset progress clears all statistics

### UX Tests
- [ ] Swipe gesture feels responsive
- [ ] Card animations are smooth
- [ ] Feedback is clear (visual + haptic)
- [ ] Text is readable on small screens (320px)
- [ ] Touch targets are easy to hit

### Edge Cases
- [ ] First-time user (no statistics)
- [ ] All letters 100% correct (what to show?)
- [ ] All letters 0% correct
- [ ] Rapid swiping doesn't break state
- [ ] Offline mode works perfectly

## Assets Required

### Images
- None (text-based cards)

### Sounds (Optional)
- `correct.mp3` - Success sound (short, positive)
- `incorrect.mp3` - Error sound (short, gentle)
- `complete.mp3` - Round completion sound

### Icons
- Swipe left icon (X or ⬅️)
- Swipe right icon (✓ or ➡️)
- Settings gear icon
- Home icon

## Future Enhancements

### Potential Additions (Post-MVP)
- **Letter Matching Mode**: Show uppercase on one card, swipe to match with lowercase
- **Timed Challenges**: Optional time pressure for older kids
- **Animations**: Celebratory animations on correct answers
- **Audio Mode**: Speak letter name when card appears
- **Progress Tracking**: Visual progress chart for parents
- **Custom Letter Sets**: Focus on specific letters (e.g., vowels only)
- **Multi-Child Profiles**: Track progress for multiple children

## Change Log

### Version 1.0 (Initial Requirements)
- Defined core swipe-based gameplay
- Established adaptive learning algorithm
- Designed parent-driven interaction model
- Specified data model and storage

---

**Last Updated**: 2025-01-17
**Status**: Planning Phase
**Author**: Project Team
