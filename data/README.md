# Data

Per-country JSON sign dictionaries were removed. Pose sequences now live only in TypeScript:

- **`components/animations/sequences`** — `signSequences` (letters A–Z, tests, etc.)
- **`components/animations/poses`** — single-pose definitions referenced by sequence entries

To add a new word: define a key in the appropriate file under `sequences/Data/` (or `testSequences`) with an array of pose names.
