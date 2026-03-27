import { createMirroredSequence } from "./utils/mirrorUtils";
import { testSequences } from "./Data/test/testSequences";
import {
  A, B, C, D, E, F, G, H, I, J, K, L, M,
  N, O, P, Q, R, S, T, U, V, W, X, Y, Z,
} from "./Data";

const legacySequenceDefinitions = {
  ...testSequences,
  ...A, ...B, ...C, ...D, ...E, ...F, ...G, ...H, ...I, ...J, ...K, ...L, ...M,
  ...N, ...O, ...P, ...Q, ...R, ...S, ...T, ...U, ...V, ...W, ...X, ...Y, ...Z,
} as const;

export const signSequences = { ...legacySequenceDefinitions } as Record<string, readonly string[]>;

Object.entries(legacySequenceDefinitions).forEach(([key, sequence]) => {
  if (
    !key.endsWith("_LEFT") &&
    (sequence as readonly string[]).some((pose: string) => pose.startsWith("RIGHT_"))
  ) {
    signSequences[`${key}_LEFT`] = createMirroredSequence(sequence as readonly string[]);
  }
});

/** Look up a pose sequence by name in `signSequences` only (original, lower, UPPER case). */
export function getSignSequence(word: string): string[] | null {
  if (!word?.trim()) return null;
  for (const k of [word, word.toLowerCase(), word.toUpperCase()]) {
    const seq = signSequences[k as keyof typeof signSequences];
    if (seq?.length) return Array.from(seq);
  }
  return null;
}

export type SignWord = keyof typeof signSequences;
