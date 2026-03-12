export class TranscriptionError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "TranscriptionError";
  }
}

/** Fix ASR mistakes (spelling, plurals, agreement) while keeping intent and order. */
export async function correctAsrSpelling(raw: string, apiKey: string): Promise<string> {
  if (!raw.trim()) return raw;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.1,
      max_tokens: Math.min(800, Math.max(64, raw.length * 2)),
      messages: [
        {
          role: "system",
          content: [
            "You fix spelling and speech-to-text errors in English.",
            "Use standard plural nouns: add -s or -es where English requires plurals (e.g. letter → letters, dog → dogs); fix missing or wrong plural -s from bad transcription.",
            "Fix word endings and forms: -ing (running, jumping), -ly adverbs (quickly, slowly), -ive/-ively/-iveness (active, positively), -s/-es on verbs in third person (runs, fixes).",
            "Fix subject–verb agreement (singular/plural) and verb forms (e.g. he run → he runs) when the sentence clearly needs it.",
            "Keep the same overall meaning, word order, and content words; do not add new ideas or remove ideas.",
            "Use normal sentence casing for prose (not ALL CAPS unless the input is).",
            "Output a single line: the corrected text only. No quotes or explanation.",
          ].join(" "),
        },
        { role: "user", content: raw },
      ],
    }),
  });

  const body = await res.text();
  if (!res.ok) {
    console.warn("spell-correct chat failed:", res.status, body.slice(0, 200));
    return raw;
  }

  try {
    const parsed = JSON.parse(body) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const corrected = parsed.choices?.[0]?.message?.content?.trim();
    if (!corrected) return raw;
    return corrected.replace(/^["']|["']$/g, "").trim() || raw;
  } catch {
    return raw;
  }
}

export type TranscribeResult = { text: string; rawTranscript?: string };

function mimeForFilename(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".webm")) return "audio/webm";
  if (lower.endsWith(".m4a")) return "audio/mp4";
  if (lower.endsWith(".mp4")) return "audio/mp4";
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  if (lower.endsWith(".wav")) return "audio/wav";
  if (lower.endsWith(".flac")) return "audio/flac";
  if (lower.endsWith(".ogg")) return "audio/ogg";
  if (lower.endsWith(".opus")) return "audio/ogg";
  return "application/octet-stream";
}

/** Send audio bytes to Whisper + optional spell correction (same as /api/transcribe). */
export async function transcribeAudioBytes(
  data: Uint8Array,
  filename: string,
  apiKey: string
): Promise<TranscribeResult> {
  if (!data?.byteLength) {
    throw new TranscriptionError("Empty audio payload", 400);
  }
  if (!filename?.trim()) {
    throw new TranscriptionError("Missing audio filename", 400);
  }

  const outbound = new FormData();
  const type = mimeForFilename(filename);
  const blob = new Blob([data], { type });
  outbound.append("file", blob, filename);
  outbound.append("model", "whisper-1");
  outbound.append("response_format", "json");

  const openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: outbound,
  });

  const raw = await openaiRes.text();
  if (!openaiRes.ok) {
    let message = raw || openaiRes.statusText;
    try {
      const parsed = JSON.parse(raw) as { error?: { message?: string } };
      if (parsed.error?.message) message = parsed.error.message;
    } catch {
      // use raw
    }
    throw new TranscriptionError(message, openaiRes.status >= 500 ? 502 : 400);
  }

  const parsed = JSON.parse(raw) as { text?: string };
  const rawTranscript = typeof parsed.text === "string" ? parsed.text.trim() : "";

  const skipCorrect =
    process.env.TRANSCRIBE_SPELLCHECK === "0" || process.env.TRANSCRIBE_SPELLCHECK === "false";

  let text = rawTranscript;
  if (rawTranscript && !skipCorrect) {
    try {
      text = await correctAsrSpelling(rawTranscript, apiKey);
    } catch (err) {
      console.warn("correctAsrSpelling:", err);
      text = rawTranscript;
    }
  }

  return {
    text,
    ...(skipCorrect ? {} : { rawTranscript }),
  };
}
