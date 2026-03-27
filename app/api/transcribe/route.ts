import { NextResponse } from "next/server";
import { TranscriptionError, transcribeAudioBytes } from "@/lib/transcribe-openai";

const MAX_BYTES = 25 * 1024 * 1024; // OpenAI transcription limit is 25 MB
function isProbablyAudio(mime: string, name: string) {
  if (!mime || mime === "application/octet-stream") {
    return /\.(mp3|m4a|wav|webm|ogg|opus|flac|mpeg|mpga)$/i.test(name);
  }
  return /^audio\//i.test(mime) || mime === "video/webm";
}

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set. Add it to your environment (.env.local)." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing audio file (field name: file)" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 25 MB)" }, { status: 400 });
    }

    const name = file.name || "audio";
    if (!isProbablyAudio(file.type || "", name)) {
      return NextResponse.json(
        { error: "Expected an audio file (e.g. mp3, wav, m4a, webm)" },
        { status: 400 }
      );
    }

    const buf = new Uint8Array(await file.arrayBuffer());
    const result = await transcribeAudioBytes(buf, name || "audio.webm", key);

    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof TranscriptionError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    console.error("transcribe:", e);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
