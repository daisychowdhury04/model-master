/** Browser-safe: extract 11-char video id from common YouTube URL shapes. */
export function extractYoutubeVideoId(input: string): string | null {
  const t = input.trim();
  if (!t) return null;
  if (/^[\w-]{11}$/.test(t)) return t;
  try {
    const u = new URL(t.includes("://") ? t : `https://${t}`);
    const host = u.hostname.toLowerCase();
    const isYoutubeHost =
      host === "youtube.com" ||
      host.endsWith(".youtube.com") ||
      host === "youtube-nocookie.com" ||
      host.endsWith(".youtube-nocookie.com");

    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split(/[/?#]/)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (isYoutubeHost) {
      const v = u.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      const shortsIdx = parts.indexOf("shorts");
      if (embedIdx >= 0 && parts[embedIdx + 1]) {
        const id = parts[embedIdx + 1];
        return /^[\w-]{11}$/.test(id) ? id : null;
      }
      if (shortsIdx >= 0 && parts[shortsIdx + 1]) {
        const id = parts[shortsIdx + 1];
        return /^[\w-]{11}$/.test(id) ? id : null;
      }
      const liveIdx = parts.indexOf("live");
      if (liveIdx >= 0 && parts[liveIdx + 1]) {
        const id = parts[liveIdx + 1];
        return /^[\w-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    return null;
  }
  return null;
}
