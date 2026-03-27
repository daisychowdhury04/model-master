"use client";

import React, { useMemo, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AppRoutesNav } from "@/components/nav/AppRoutesNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2, Mic, Play, Youtube } from "lucide-react";
import { extractYoutubeVideoId } from "@/lib/youtube-id";
import SimpleModelViewer, { SimpleModelViewerRef } from "@/components/viewer/SimpleModelViewer";
import { getSignSequence } from "@/components/animations/sequences";
import { poses } from "@/components/animations/poses";
import { sanitizeForSignTokens } from "@/lib/textSanitizer";
import { playSignTokenList } from "@/lib/playSignPhrase";
import { FloatingSignInput } from "@/components/viewer/controller/FloatingSignInput";
import { PlaybackSpeedSlider } from "@/components/viewer/controller/PlaybackSpeedSlider";

export default function AudioTestPage() {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [whisperRaw, setWhisperRaw] = useState<string | null>(null);
  const [gloss, setGloss] = useState<string | null>(null);
  const [glossWords, setGlossWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showYoutubeWithOverlay, setShowYoutubeWithOverlay] = useState(true);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [isPlayingPoses, setIsPlayingPoses] = useState(false);
  const [unknownWords, setUnknownWords] = useState<string[]>([]);
  /** Prefilled with gloss sentence so Sign can replay word-by-word. */
  const [signPhraseText, setSignPhraseText] = useState("");
  /** Same as home Model Controls — affects every pose in the viewer. */
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<SimpleModelViewerRef>(null);

  const videoId = useMemo(() => extractYoutubeVideoId(youtubeUrl), [youtubeUrl]);

  function isKnownAnimationWord(word: string): boolean {
    if (!word?.trim()) return false;
    if (getSignSequence(word)) return true;
    if (poses[word as keyof typeof poses]) return true;
    if (poses[word.toUpperCase() as keyof typeof poses]) return true;
    return false;
  }

  /** Same mechanic as the Sign field: neutral between words; skips unknown gloss tokens. */
  const runGlossSequence = useCallback(async (tokens: string[]) => {
    if (!viewerRef.current || tokens.length === 0) return;

    const missing: string[] = [];
    tokens.forEach((token) => {
      if (!isKnownAnimationWord(token) && !missing.includes(token)) {
        missing.push(token);
      }
    });
    setUnknownWords(missing);

    if (!tokens.some((t) => isKnownAnimationWord(t))) {
      setActiveWordIndex(null);
      return;
    }

    setIsPlayingPoses(true);
    try {
      await playSignTokenList((name, disabled) => viewerRef.current!.animate(name, disabled), tokens, {
        skipWord: (w) => !isKnownAnimationWord(w),
        onWordIndex: setActiveWordIndex,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsPlayingPoses(false);
      setActiveWordIndex(null);
    }
  }, []);

  async function fetchGlossFromText(text: string): Promise<string[]> {
    const cleanText = sanitizeForSignTokens(text);
    const res = await fetch("/api/sentence-to-gloss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentence: cleanText }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? "Gloss conversion failed");
    }
    const g = sanitizeForSignTokens((data.gloss ?? "").trim());
    const words = g ? g.split(/\s+/).filter(Boolean) : [];
    setGloss(g);
    setGlossWords(words);
    return words;
  }

  async function startTranscribe(file: File) {
    setError(null);
    setTranscript(null);
    setWhisperRaw(null);
    setGloss(null);
    setGlossWords([]);
    setUnknownWords([]);
    setSignPhraseText("");
    setLoading(true);

    try {
      const fd = newFormDataWithFile(file);
      const txRes = await fetch("/api/transcribe", { method: "POST", body: fd });
      const txData = await txRes.json();

      if (!txRes.ok) {
        setError(txData.error ?? "Transcription failed");
        return;
      }

      const text = sanitizeForSignTokens((txData.text ?? "").trim());
      if (!text) {
        setError("No speech detected in the audio");
        return;
      }

      const raw =
        typeof txData.rawTranscript === "string" ? txData.rawTranscript.trim() : null;
      setWhisperRaw(raw && raw !== text ? raw : null);
      setTranscript(text);
      const words = await fetchGlossFromText(text);
      setSignPhraseText(words.length > 0 ? words.join(" ") : "");
      await runGlossSequence(words);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function startYoutubeTranscribe() {
    setError(null);
    setTranscript(null);
    setWhisperRaw(null);
    setGloss(null);
    setGlossWords([]);
    setUnknownWords([]);
    setSignPhraseText("");
    const url = youtubeUrl.trim();
    if (!url) {
      setError("Paste a YouTube link first.");
      return;
    }
    if (!videoId) {
      setError("Could not read a video ID from that URL.");
      return;
    }

    setLoading(true);
    try {
      const txRes = await fetch("/api/youtube-transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const txData = await txRes.json();

      if (!txRes.ok) {
        setError(typeof txData.error === "string" ? txData.error : "Transcription failed");
        return;
      }

      const text = sanitizeForSignTokens((txData.text ?? "").trim());
      if (!text) {
        setError("No speech detected in the video audio");
        return;
      }

      const raw =
        typeof txData.rawTranscript === "string" ? txData.rawTranscript.trim() : null;
      setWhisperRaw(raw && raw !== text ? raw : null);
      setTranscript(text);
      const words = await fetchGlossFromText(text);
      setSignPhraseText(words.length > 0 ? words.join(" ") : "");
      await runGlossSequence(words);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setSelectedFile(f);
    setError(null);
    setTranscript(null);
    setWhisperRaw(null);
    setGloss(null);
    setGlossWords([]);
    setUnknownWords([]);
    setSignPhraseText("");
  }

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-background">
      <AppRoutesNav />
      <header className="shrink-0 border-b px-4 py-3">
        <h1 className="text-xl font-semibold">Audio or YouTube → text → gloss → pose</h1>
        <p className="text-sm text-muted-foreground">
          Left: audio or YouTube; Whisper transcribes, gloss shows above, then the avatar signs poses below (use{" "}
          <strong className="text-foreground">Sign</strong> to replay).
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Left: two columns — audio | YouTube */}
        <aside className="flex shrink-0 flex-col gap-4 overflow-y-auto border-b p-4 lg:w-[min(100%,52rem)] lg:min-w-0 lg:border-b-0 lg:border-r bg-muted/10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
              <Label htmlFor="audio-file" className="flex items-center gap-2 text-sm font-medium">
                <Mic className="size-4 shrink-0" /> Audio file
              </Label>
              <input
                id="audio-file"
                ref={inputRef}
                type="file"
                accept="audio/*"
                aria-label="Choose audio file to transcribe"
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border file:bg-background file:px-3 file:py-2 file:text-sm"
                disabled={loading}
                onChange={onFileChosen}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => inputRef.current?.click()}
              >
                Choose file…
              </Button>
              {selectedFile && (
                <p className="truncate text-xs text-muted-foreground" title={selectedFile.name}>
                  Selected: <span className="font-medium text-foreground">{selectedFile.name}</span>
                </p>
              )}
              <Button
                type="button"
                className="w-full"
                disabled={!selectedFile || loading}
                onClick={() => selectedFile && void startTranscribe(selectedFile)}
              >
                <Play className="mr-2 h-4 w-4 shrink-0" />
                Transcribe &amp; gloss
              </Button>
            </div>

            <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="yt-url" className="flex items-center gap-2 text-sm font-medium">
                  <Youtube className="size-4 shrink-0" /> YouTube
                </Label>
                <Button
                  type="button"
                  variant={showYoutubeWithOverlay ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowYoutubeWithOverlay((v) => !v)}
                >
                  {showYoutubeWithOverlay ? "YT ON" : "YT OFF"}
                </Button>
              </div>
              <Input
                id="yt-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=…"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                disabled={loading}
                className="h-10"
              />
              <Button
                type="button"
                className="w-full"
                disabled={loading || !videoId}
                onClick={() => void startYoutubeTranscribe()}
              >
                <Youtube className="mr-2 h-4 w-4 shrink-0" />
                Transcribe &amp; gloss
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-5 shrink-0 animate-spin" />
                <span>Transcribing &amp; building gloss…</span>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            {transcript !== null && (
              <section className="space-y-2">
                <Label className="text-muted-foreground text-xs">Transcript (spelling-corrected)</Label>
                <p className="rounded-lg border bg-background p-4 text-lg leading-relaxed">{transcript}</p>
                {whisperRaw && (
                  <p className="text-xs text-muted-foreground">
                    Whisper raw: <span className="font-mono">{whisperRaw}</span>
                  </p>
                )}
              </section>
            )}

            {gloss !== null && (
              <section className="space-y-3">
                <Label className="text-muted-foreground text-xs">Gloss (on screen)</Label>
                <div className="flex min-h-[120px] flex-wrap content-start items-center justify-start gap-x-4 gap-y-3 rounded-lg border bg-gradient-to-br from-muted/40 to-muted/10 p-6">
                  {glossWords.length === 0 ? (
                    <span className="text-muted-foreground">(no content words after filtering)</span>
                  ) : (
                    glossWords.map((w, i) => (
                      <span
                        key={`${w}-${i}`}
                        className={
                          isPlayingPoses && activeWordIndex === i
                            ? "rounded-md bg-primary px-2 py-1 text-2xl font-bold tracking-wide text-primary-foreground ring-2 ring-primary ring-offset-2 sm:text-3xl"
                            : "text-2xl font-bold tracking-wide text-foreground sm:text-3xl"
                        }
                      >
                        {w}
                      </span>
                    ))
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {glossWords.map((w, i) => (
                    <Badge
                      key={`b-${w}-${i}`}
                      variant={isPlayingPoses && activeWordIndex === i ? "default" : "secondary"}
                      className="font-mono text-xs"
                    >
                      {w}
                    </Badge>
                  ))}
                </div>
                <p className="text-muted-foreground text-xs">
                  The gloss sentence is filled in <strong className="text-foreground">Sign</strong> below; click{" "}
                  <strong className="text-foreground">Sign</strong> anytime to play word-by-word again.
                </p>
                {unknownWords.length > 0 && (
                  <p className="text-sm text-amber-600">
                    Not in dictionary (skipped): {unknownWords.join(", ")}
                  </p>
                )}
              </section>
            )}

            {gloss !== null && (
              <section className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  <ArrowRight className="size-3.5 shrink-0 opacity-80" aria-hidden />
                  Pose
                </Label>
                <PlaybackSpeedSlider playbackSpeed={playbackSpeed} setPlaybackSpeed={setPlaybackSpeed} />
                {videoId && showYoutubeWithOverlay ? (
                  <>
                  <div className="relative h-[460px] overflow-hidden rounded-lg border bg-black">
                    <iframe
                      title="YouTube with avatar overlay"
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                  <SimpleModelViewer
                    ref={viewerRef}
                    modelPath="/human.glb"
                    floating
                    initialPosition={{ x: 24, y: 120 }}
                    playbackSpeed={playbackSpeed}
                  />
                  <div className="pointer-events-none fixed bottom-4 left-1/2 z-[1100] w-full max-w-md -translate-x-1/2 px-4">
                    <div className="pointer-events-auto rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
                      <FloatingSignInput
                        viewerRef={viewerRef}
                        value={signPhraseText}
                        onValueChange={setSignPhraseText}
                        onWordIndex={setActiveWordIndex}
                        onPlayingChange={setIsPlayingPoses}
                      />
                    </div>
                  </div>
                  </>
                ) : (
                  <div className="relative h-[420px] overflow-hidden rounded-lg border bg-background">
                    <SimpleModelViewer ref={viewerRef} modelPath="/human.glb" playbackSpeed={playbackSpeed} />
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center p-3 pb-4">
                      <div className="pointer-events-auto w-full max-w-md rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
                        <FloatingSignInput
                          viewerRef={viewerRef}
                          value={signPhraseText}
                          onValueChange={setSignPhraseText}
                          onWordIndex={setActiveWordIndex}
                          onPlayingChange={setIsPlayingPoses}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function newFormDataWithFile(file: File): FormData {
  const fd = new FormData();
  fd.append("file", file);
  return fd;
}
