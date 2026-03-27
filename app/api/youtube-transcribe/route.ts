import { NextResponse } from "next/server";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { create as createYoutubeDl } from "youtube-dl-exec";
import { TranscriptionError, transcribeAudioBytes } from "@/lib/transcribe-openai";
import { extractYoutubeVideoId } from "@/lib/youtube-id";

export const runtime = "nodejs";

/** Long downloads + Whisper; increase on Vercel Pro if needed. */
export const maxDuration = 300;

const MAX_BYTES = 25 * 1024 * 1024; // OpenAI limit

const YT_DLP_FILENAME = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp";

/**
 * youtube-dl-exec defaults to __dirname/../bin, which breaks when Next bundles
 * the dependency (path ends up under .next). Resolve from project root instead.
 */
function resolveYtDlpBinary(): string {
  const fromEnv = process.env.YOUTUBE_DL_PATH?.trim();
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const fromModules = path.join(
    process.cwd(),
    "node_modules",
    "youtube-dl-exec",
    "bin",
    YT_DLP_FILENAME
  );
  if (existsSync(fromModules)) return fromModules;
  throw new Error(
    `yt-dlp not found. Expected at ${fromModules}. Run npm install (with lifecycle scripts), or set YOUTUBE_DL_PATH to your yt-dlp executable.`
  );
}

let youtubedl: ReturnType<typeof createYoutubeDl> | null = null;
function getYoutubeDl() {
  if (!youtubedl) youtubedl = createYoutubeDl(resolveYtDlpBinary());
  return youtubedl;
}

function filenameForTranscribe(downloadedPath: string): string {
  const ext = path.extname(downloadedPath).replace(/^\./, "").toLowerCase();
  if (ext === "webm" || ext === "m4a" || ext === "mp4" || ext === "opus" || ext === "ogg") {
    return `audio.${ext}`;
  }
  return "audio.m4a";
}

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set. Add it to your environment (.env.local)." },
      { status: 500 }
    );
  }

  let tmpFile: string | null = null;

  try {
    const body = (await request.json()) as { url?: string };
    const url = typeof body.url === "string" ? body.url.trim() : "";

    if (!url) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    const videoId = extractYoutubeVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "Not a valid YouTube URL" }, { status: 400 });
    }

    const stamp = Date.now();
    const filePrefix = `yt-audio-${videoId}-${stamp}`;
    const outputTemplate = path.join(tmpdir(), `${filePrefix}.%(ext)s`);

    const flags: Parameters<ReturnType<typeof createYoutubeDl>>[1] = {
      format: "bestaudio[ext=m4a]/bestaudio/best",
      output: outputTemplate,
      noPlaylist: true,
      noCheckCertificates: true,
      noWarnings: true,
      addHeader: [
        "referer:https://www.youtube.com/",
        "user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ],
    };

    const cookiesFile = process.env.YT_COOKIES_FILE?.trim();
    const cookiesFromBrowser = process.env.YT_COOKIES_FROM_BROWSER?.trim();
    if (cookiesFile) {
      flags.cookies = cookiesFile;
    } else if (cookiesFromBrowser) {
      // yt-dlp: --cookies-from-browser (e.g. chrome, edge, firefox, or chrome:Profile)
      (flags as { cookiesFromBrowser?: string }).cookiesFromBrowser = cookiesFromBrowser;
    }

    await getYoutubeDl()(url, flags);

    const dir = await fs.readdir(tmpdir());
    const name = dir.find((f) => f.startsWith(`${filePrefix}.`));
    if (!name) {
      return NextResponse.json(
        { error: "yt-dlp did not produce an audio file. Try another video or check YT_COOKIES_FILE." },
        { status: 500 }
      );
    }

    tmpFile = path.join(tmpdir(), name);

    const stat = await fs.stat(tmpFile);
    if (stat.size > MAX_BYTES) {
      return NextResponse.json(
        {
          error:
            "Downloaded audio exceeds 25 MB (OpenAI limit). Use a shorter video or trim the source.",
        },
        { status: 400 }
      );
    }

    const audioBuffer = await fs.readFile(tmpFile);
    const result = await transcribeAudioBytes(
      new Uint8Array(audioBuffer),
      filenameForTranscribe(tmpFile),
      key
    );

    return NextResponse.json({ ...result, videoId });
  } catch (e) {
    if (e instanceof TranscriptionError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }

    const message = e instanceof Error ? e.message : "YouTube transcription failed";
    const stderr =
      e && typeof e === "object" && "stderr" in e && typeof (e as { stderr?: unknown }).stderr === "string"
        ? (e as { stderr: string }).stderr
        : "";
    const detail = `${message}\n${stderr}`;
    console.error("youtube-transcribe:", e);

    if (/private/i.test(detail)) {
      return NextResponse.json({ error: "This video is private." }, { status: 400 });
    }
    if (/not available|unavailable|Video unavailable/i.test(detail)) {
      return NextResponse.json(
        { error: "This video is unavailable or region-blocked." },
        { status: 400 }
      );
    }
    if (/not a bot|confirm you.re not a bot|pass cookies to yt-dlp/i.test(detail)) {
      return NextResponse.json(
        {
          error:
            "YouTube is asking for verification (bot check). Export cookies from a signed-in browser: set YT_COOKIES_FILE to a Netscape cookies file, or set YT_COOKIES_FROM_BROWSER (e.g. chrome or edge) for local dev. See https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies",
        },
        { status: 400 }
      );
    }
    if (/sign in|age-restricted|confirm your age/i.test(detail)) {
      return NextResponse.json(
        {
          error:
            "This video requires sign-in or is age-restricted. Set YT_COOKIES_FILE with exported cookies, or YT_COOKIES_FROM_BROWSER for local use.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (tmpFile) {
      await fs.unlink(tmpFile).catch(() => null);
    }
  }
}
