# Sign Language Dictionary

This directory contains sign language sequences organized alphabetically from A to Z. Each letter has its own folder containing words that start with that letter.

## Structure

```
Data/
├── A/
│   └── word1.ts
│   └── word2.ts
├── B/
│   └── word3.ts
├── ...
└── Z/
    └── wordN.ts
```

## File Format

Each word file exports a sign language sequence using the following format:

```typescript
import { createSequence } from '../../utils/sequenceUtils';
import { handMovements } from '../../poses/Data/hand/handMovements';
import { palmPoses } from '../../poses/Data/hand/palmPoses';
import { fingerPoses } from '../../poses/Data/hand/fingerPoses';

export const WORD_NAME = createSequence([
    // Sequence of poses and movements
    handMovements.HAND_POSITION,
    palmPoses.PALM_ORIENTATION,
    fingerPoses.FINGER_SHAPE,
    // ... more poses
]);
```

## Word Categories

- **A**: apple, and, ask, etc.
- **B**: book, bread, blue, etc.
- **C**: cat, car, coffee, etc.
- **D**: dog, door, drink, etc.
- **E**: eat, elephant, eye, etc.
- **F**: food, friend, family, etc.
- **G**: go, good, green, etc.
- **H**: hello, help, house, etc.
- **I**: I/me, ice, idea, etc.
- **J**: jump, juice, jacket, etc.
- **K**: king, kitchen, key, etc.
- **L**: love, learn, listen, etc.
- **M**: mother, make, money, etc.
- **N**: name, nice, night, etc.
- **O**: open, orange, office, etc.
- **P**: please, person, phone, etc.
- **Q**: question, queen, quiet, etc.
- **R**: red, right, read, etc.
- **S**: sorry, stop, school, etc.
- **T**: thank you, time, talk, etc.
- **U**: understand, up, use, etc.
- **V**: very, visit, voice, etc.
- **W**: water, what, when, etc.
- **X**: x-ray, xylophone, etc.
- **Y**: yes, you, yellow, etc.
- **Z**: zero, zebra, zoo, etc.

## Adding New Words

1. Choose the appropriate letter folder
2. Create a new TypeScript file with the word name in UPPER_SNAKE_CASE
3. Implement the sign sequence using available poses and movements
4. Export the sequence with the word name

## Current Status

- ✅ Folder structure created (A-Z)
- 🔄 Adding first 50 common words
- ⏳ Dictionary expansion ongoing

## Usage

Words can be imported and used in sign language animations:

```typescript
import { HELLO } from './H/hello';
import { THANK_YOU } from './T/thank_you';

// Use in sequences
const greetingSequence = [HELLO, THANK_YOU];
```
