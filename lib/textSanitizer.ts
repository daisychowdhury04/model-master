export function sanitizeForSignTokens(input: string): string {
  if (!input) return "";
  return input
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/(^|\s)['-]+(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
