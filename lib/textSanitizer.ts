export function sanitizeForSignTokens(input: string): string {
  if (!input) return "";
  return input
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
