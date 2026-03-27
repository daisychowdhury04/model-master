"use client";

import React, { useCallback, useState } from "react";
import { SignInput } from "@/components/viewer/controller/SignInput";
import { playSignPhrase } from "@/lib/playSignPhrase";
import type { SimpleModelViewerRef } from "@/components/viewer/SimpleModelViewer";

interface FloatingSignInputProps {
  viewerRef: React.RefObject<SimpleModelViewerRef | null>;
  /** When true (default), strip punctuation via `sanitizeForSignTokens` before signing. */
  sanitize?: boolean;
  className?: string;
  /** Fires when a phrase run starts / ends (e.g. sidebar chips). */
  onPlayingChange?: (playing: boolean) => void;
  onPhraseStart?: (tokens: string[]) => void;
  onWordIndex?: (index: number | null) => void;
  /**
   * Controlled text (e.g. prefill gloss on test page). When set, `onValueChange` should be passed too.
   * After submit, text is not cleared so the user can click Sign again to replay.
   */
  value?: string;
  onValueChange?: (value: string) => void;
}

export function FloatingSignInput({
  viewerRef,
  sanitize = true,
  className,
  onPlayingChange,
  onPhraseStart,
  onWordIndex,
  value: controlledValue,
  onValueChange,
}: FloatingSignInputProps) {
  const [internalText, setInternalText] = useState("");
  const isControlled = controlledValue !== undefined;
  const text = isControlled ? controlledValue : internalText;
  const setText = isControlled ? (onValueChange ?? (() => {})) : setInternalText;

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const viewer = viewerRef.current;
      if (!viewer) return;
      onPlayingChange?.(true);
      try {
        await playSignPhrase((name, disabled) => viewer.animate(name, disabled), text, {
          sanitize,
          onPhraseStart,
          onWordIndex,
        });
      } finally {
        onPlayingChange?.(false);
      }
      if (!isControlled) {
        setInternalText("");
      }
    },
    [text, viewerRef, sanitize, onPlayingChange, onPhraseStart, onWordIndex, isControlled]
  );

  return (
    <div className={className}>
      <SignInput text={text} setText={setText} onSubmit={onSubmit} />
    </div>
  );
}
