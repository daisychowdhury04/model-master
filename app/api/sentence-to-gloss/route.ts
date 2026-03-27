import { NextResponse } from "next/server";
import { sentenceToGlossHybrid } from "@/lib/gloss";

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set. Gloss needs it for the hybrid AI step." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const sentence = typeof body.sentence === "string" ? body.sentence : "";

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
    const sentence = searchParams.get("sentence") ?? "";

    const gloss = await sentenceToGlossHybrid(sentence, key);

    return NextResponse.json({ gloss });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gloss request failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
