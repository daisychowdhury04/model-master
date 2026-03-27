"use client";

import React, { useRef, useState } from "react";
import LeftSidebar from "./components/left-side";
import RightSidebar from "./components/right-side";
import { SimpleModelViewerRef } from "@/components/viewer/SimpleModelViewer";
import { AppRoutesNav } from "@/components/nav/AppRoutesNav";
import { FloatingSignInput } from "@/components/viewer/controller/FloatingSignInput";

export default function DemoPage() {
  const viewerRef = useRef<SimpleModelViewerRef>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [playTokens, setPlayTokens] = useState<string[]>([]);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col">
      <AppRoutesNav />
      <div className="flex min-h-0 flex-1">
        <LeftSidebar
          playTokens={playTokens}
          activeWordIndex={activeWordIndex}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          setPlaybackSpeed={setPlaybackSpeed}
        />
        <div className="relative min-h-0 flex-1">
          <RightSidebar ref={viewerRef} playbackSpeed={playbackSpeed} />
          <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center p-4 pb-6">
            <div className="pointer-events-auto w-full max-w-md rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <FloatingSignInput
                viewerRef={viewerRef}
                onPhraseStart={setPlayTokens}
                onWordIndex={setActiveWordIndex}
                onPlayingChange={setIsPlaying}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
