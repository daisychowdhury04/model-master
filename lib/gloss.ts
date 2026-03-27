/**
 * Hybrid Gloss System (AI + Rules + ASL ordering)
 * Uses gpt-4o-mini, then rule cleanup and question/time reorder.
 */

import OpenAI from "openai";

// ------------------------
// RULE SETS
// ------------------------

const REMOVE_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "am",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "to",
  "of",
  "in",
  "on",
  "at",
  "for",
  "with",
  "by",
  "from",
  "and",
  "or",
  "but",
  "so",
  "than",
  "me",
  "my",
  "mine",
  "he",
  "him",
  "she",
  "her",
  "they",
  "them",
  "we",
  "us",
  "it",
]);

const IMPORTANT_WORDS = new Set([
  "not",
  "no",
  "never",
  "why",
  "how",
  "when",
  "where",
  "what",
  "who",
  "today",
  "tomorrow",
  "yesterday",
  "because",
  "if",
]);

const TIME_WORDS_UPPER = ["TODAY", "TOMORROW", "YESTERDAY"] as const;
const QUESTION_WORDS_UPPER = ["WHY", "HOW", "WHEN", "WHERE", "WHAT", "WHO"] as const;

// ------------------------
// NORMALIZATION
// ------------------------

function normalizeVerb(word: string): string {
  if (word.endsWith("ing") && word.length > 4) return word.slice(0, -3);
  if (word.endsWith("ed") && word.length > 3) return word.slice(0, -2);
  /* length > 4 avoids this→thi, us→u, etc. */
  if (word.endsWith("s") && word.length > 4) return word.slice(0, -1);
  return word;
}

// ------------------------
// CLEANUP
// ------------------------

/**
 * After the model returns a gloss line: only mechanical fixes (punctuation, stems, case).
 * Do not drop tokens here — the model already decided what to keep or omit.
 */
export function normalizeGlossLine(text: string): string {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[.,!?;:]+/g, "").trim())
    .filter(Boolean);

  return words.map(normalizeVerb).map((w) => w.toUpperCase()).join(" ");
}

/**
 * Rule-based cleanup when there is no AI gloss (fallback / sentenceToGloss).
 */
export function cleanGloss(text: string): string {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[.,!?;:]+/g, "").trim())
    .filter(Boolean);

  const filtered = words.filter((w) => {
    if (IMPORTANT_WORDS.has(w)) return true;
    if (REMOVE_WORDS.has(w)) return false;
    return w.length > 0;
  });

  return filtered.map(normalizeVerb).map((w) => w.toUpperCase()).join(" ");
}

// ------------------------
// ASL-STYLE REORDER
// ------------------------

export function reorderASL(gloss: string): string {
  const words = gloss.split(/\s+/).filter(Boolean);
  const timeWords = new Set<string>(TIME_WORDS_UPPER);
  const questionWords = new Set<string>(QUESTION_WORDS_UPPER);

  const time: string[] = [];
  const question: string[] = [];
  const rest: string[] = [];

  for (const w of words) {
    if (timeWords.has(w)) time.push(w);
    else if (questionWords.has(w)) question.push(w);
    else rest.push(w);
  }

  return [...question, ...time, ...rest].join(" ");
}

// ------------------------
// AI
// ------------------------

async function generateAIGloss(sentence: string, apiKey: string): Promise<string> {
  const client = new OpenAI({ apiKey });
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content:
          "Output a single line: ASL-style English gloss in natural speaking order, space-separated, no punctuation. You choose which words to keep: include anything that would be signed or that carries essential meaning; omit words that do not need to appear in the gloss. Be consistent and concise.",
      },
      { role: "user", content: sentence },
    ],
  });

  return res.choices[0]?.message?.content?.trim() ?? "";
}

// ------------------------
// MAIN
// ------------------------

export async function sentenceToGlossHybrid(sentence: string, apiKey: string): Promise<string> {
  if (!sentence?.trim()) return "";

  try {
    const aiGloss = await generateAIGloss(sentence.trim(), apiKey);
    const firstLine = aiGloss.split(/\r?\n/).map((l) => l.trim()).find(Boolean) ?? "";
    const normalized = normalizeGlossLine(firstLine.replace(/^["']+|["']+$/g, ""));
    return reorderASL(normalized);
  } catch (err) {
    console.error("Gloss error:", err);
    return reorderASL(cleanGloss(sentence));
  }
}

/**
 * Rule-only gloss (no AI). Same cleanup path as hybrid fallback.
 */
export function sentenceToGloss(sentence: string): string {
  if (!sentence?.trim()) return "";
  return reorderASL(cleanGloss(sentence.trim()));
}
