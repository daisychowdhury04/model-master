"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppRoutesNav } from "@/components/nav/AppRoutesNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractYoutubeVideoId } from "@/lib/youtube-id";

export default function GlossPage() {
  const [sentence, setSentence] = useState("");
  const [gloss, setGloss] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [rawTranscript, setRawTranscript] = useState<string | null>(null);

  const videoId = useMemo(() => extractYoutubeVideoId(youtubeUrl), [youtubeUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGloss(null);
    if (!sentence.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/sentence-to-gloss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: sentence.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Request failed");
        return;
      }

      setGloss(data.gloss ?? "");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleYoutubeTranscribe = async () => {
    setYtError(null);
    setTranscript(null);
    setRawTranscript(null);
    const url = youtubeUrl.trim();
    if (!url) {
      setYtError("Paste a YouTube link first.");
      return;
    }
    if (!videoId) {
      setYtError("Could not read a video ID from that URL.");
      return;
    }

    setYtLoading(true);
    try {
      const res = await fetch("/api/youtube-transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setYtError(typeof data.error === "string" ? data.error : "Transcription failed");
        return;
      }
      const text = typeof data.text === "string" ? data.text : "";
      setTranscript(text);
      if (typeof data.rawTranscript === "string") {
        setRawTranscript(data.rawTranscript);
      }
    } catch {
      setYtError("Network error");
    } finally {
      setYtLoading(false);
    }
  };

  const useTranscriptAsSentence = () => {
    if (transcript) setSentence(transcript);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppRoutesNav />
      <header className="border-b px-4 py-3">
        <h1 className="text-xl font-semibold">Sentence to Gloss</h1>
        <p className="text-sm text-muted-foreground">
          Hybrid gloss: <strong>gpt-4o-mini</strong> picks which words stay in the gloss; the server only normalizes casing and
          stems, then applies question/time reorder. Rule-only fallback still uses a stop-word list.
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-8 p-6">
        <section className="mx-auto w-full max-w-4xl space-y-4">
          <h2 className="text-lg font-medium">YouTube → speech (OpenAI Whisper)</h2>
          <p className="text-sm text-muted-foreground">
            Paste a link; the server downloads audio and sends it to Whisper (same pipeline as{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/transcribe</code>). The video embeds below for
            reference. Only use content you have rights to process.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=…"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                disabled={ytLoading}
                className="h-10"
              />
            </div>
            <Button type="button" onClick={handleYoutubeTranscribe} disabled={ytLoading || !videoId} className="shrink-0">
              {ytLoading ? "Transcribing…" : "Transcribe audio"}
            </Button>
          </div>

          {ytError && <p className="text-sm text-destructive">{ytError}</p>}

          {videoId && (
            <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black shadow-sm">
              <iframe
                title="YouTube preview"
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}

          {(transcript !== null || rawTranscript) && (
            <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label className="text-muted-foreground text-xs">Transcript (Whisper)</Label>
                {transcript && (
                  <Button type="button" variant="secondary" size="sm" onClick={useTranscriptAsSentence}>
                    Use as sentence
                  </Button>
                )}
              </div>
              <p className="whitespace-pre-wrap font-mono text-sm">{transcript ?? "(empty)"}</p>
              {rawTranscript && rawTranscript !== transcript && (
                <>
                  <Label className="pt-2 text-muted-foreground text-xs">Raw (before spell-fix)</Label>
                  <p className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">{rawTranscript}</p>
                </>
              )}
            </div>
          )}
        </section>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sentence">Sentence</Label>
              <Input
                id="sentence"
                placeholder="e.g. my name is ram"
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                disabled={loading}
                className="h-10"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Converting…" : "To gloss"}
            </Button>
          </form>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          {gloss !== null && (
            <div className="mt-6 w-full rounded-lg border bg-muted/30 p-4">
              <Label className="text-muted-foreground text-xs">Gloss</Label>
              <p className="mt-1 font-mono text-lg">{gloss || "(empty)"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
