import { sanitizeForSignTokens } from "@/lib/textSanitizer";

export const WORD_BREAK_NEUTRAL = "RIGHT_HAND_FULL_NEUTRAL";

export type PlaySignPhraseOptions = {
  sanitize?: boolean;
  /** Called once with the token list before any animation (after sanitize / split). */
  onPhraseStart?: (tokens: string[]) => void;
  /** Called with the current word index while signing each word; `null` when the phrase finishes or is interrupted. */
  onWordIndex?: (index: number | null) => void;
};

export type PlaySignTokenListOptions = PlaySignPhraseOptions & {
  /** If true, this word is skipped (no pose), e.g. not in dictionary. */
  skipWord?: (word: string, index: number) => boolean;
};

/**
 * Same timing as the Sign input: start neutral, then each token with neutral between.
 * Use `skipWord` to omit unknown gloss tokens while keeping original indices for `onWordIndex`.
 */
export async function playSignTokenList(
  animate: (animationName: string, disabledPoses?: number[]) => Promise<void>,
  words: string[],
  options?: PlaySignTokenListOptions
): Promise<void> {
  if (words.length === 0) return;

  const hasPlayable = words.some((w, i) => !options?.skipWord?.(w, i));
  if (!hasPlayable) {
    options?.onPhraseStart?.(words);
    options?.onWordIndex?.(null);
    return;
  }

  options?.onPhraseStart?.(words);

  try {
    await animate(WORD_BREAK_NEUTRAL);
    for (let i = 0; i < words.length; i++) {
      if (options?.skipWord?.(words[i], i)) continue;

      options?.onWordIndex?.(i);
      await animate(words[i].toUpperCase());

      const hasMorePlayable = words
        .slice(i + 1)
        .some((w, j) => !options?.skipWord?.(w, i + 1 + j));
      if (hasMorePlayable) {
        await animate(WORD_BREAK_NEUTRAL);
      }
    }
  } finally {
    options?.onWordIndex?.(null);
  }
}

export async function playSignPhrase(
  animate: (animationName: string, disabledPoses?: number[]) => Promise<void>,
  rawText: string,
  options?: PlaySignPhraseOptions
): Promise<void> {
  const body = options?.sanitize === false ? rawText : sanitizeForSignTokens(rawText);
  const words = body
    .trim()
    .split(/\s+/)
    .map((w) => w.toUpperCase())
    .filter(Boolean);

  if (words.length === 0) return;

  await playSignTokenList(animate, words, options);
}
