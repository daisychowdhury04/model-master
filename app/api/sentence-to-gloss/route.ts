import { NextResponse } from "next/server";
import { sentenceToGlossHybrid } from "@/lib/gloss";

const MAX_SENTENCE_LENGTH = 5000;

function getSentence(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim();
}

function validateSentence(sentence: string): string | null {
  if (!sentence) return "Sentence is required";
  if (sentence.length > MAX_SENTENCE_LENGTH) {
    return `Sentence is too long (max ${MAX_SENTENCE_LENGTH} characters)`;
  }
  return null;
}

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set. Gloss needs it for the hybrid AI step." },
      { status: 500 }
    );
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const sentence = getSentence((body as { sentence?: unknown })?.sentence);
    const validationError = validateSentence(sentence);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const gloss = await sentenceToGlossHybrid(sentence, key);

    return NextResponse.json({ gloss });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gloss request failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set. Gloss needs it for the hybrid AI step." },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const sentence = getSentence(searchParams.get("sentence"));
    const validationError = validateSentence(sentence);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const gloss = await sentenceToGlossHybrid(sentence, key);

    return NextResponse.json({ gloss });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gloss request failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
