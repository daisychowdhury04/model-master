"use client";

import React, { useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ModelViewer } from "@/components/viewer/ModelViewer";
import { playIndividualPose } from "@/components/animations/handAnimations";
import { poses } from "@/components/animations/poses";
import { poseGroups } from "@/components/animations/poses/poseGroups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Play } from "lucide-react";
import { AppRoutesNav } from "@/components/nav/AppRoutesNav";

export interface SavedWord {
  word: string;
  sequence: string[];
}

export default function TrainPage() {
  const bonesRef = useRef<{ [key: string]: THREE.Bone }>({});
  const [wordInput, setWordInput] = useState("");
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleBonesLoaded = useCallback((bones: { [key: string]: THREE.Bone }) => {
    bonesRef.current = bones;
  }, []);

  const playPose = async (poseName: string) => {
    const config = poses[poseName];
    if (!config || !bonesRef.current) return;
    setIsPlaying(true);
    try {
      await playIndividualPose(bonesRef.current, config, 1);
    } finally {
      setIsPlaying(false);
    }
  };

  const playSequence = async () => {
    if (!bonesRef.current || currentSequence.length === 0) return;
    setIsPlaying(true);
    try {
      for (const poseName of currentSequence) {
        const config = poses[poseName];
        if (config) await playIndividualPose(bonesRef.current, config, 1);
      }
    } finally {
      setIsPlaying(false);
    }
  };

  const addPoseToSequence = (poseName: string) => {
    setCurrentSequence((prev) => [...prev, poseName]);
    // Defer starting the animation until after React has committed the state update and re-rendered,
    // so the animation clock isn't starved and the first frame doesn't see progress >= 1.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => playPose(poseName));
    });
  };

  const removeFromSequence = (index: number) => {
    setCurrentSequence((prev) => prev.filter((_, i) => i !== index));
  };

  const clearSequence = () => setCurrentSequence([]);

  const saveWord = () => {
    const word = wordInput.trim().toLowerCase().replace(/\s+/g, "_");
    if (!word || currentSequence.length === 0) return;
    setSavedWords((prev) => [...prev, { word, sequence: [...currentSequence] }]);
    setWordInput("");
    setCurrentSequence([]);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <AppRoutesNav />
      <div className="flex min-h-0 flex-1">
      {/* Left: Word + current sequence + saved words */}
      <aside className="flex w-72 flex-col border-r bg-muted/30">
        <div className="border-b p-3">
          <h1 className="text-lg font-semibold">Train</h1>
          <p className="text-xs text-muted-foreground">
            Build a word from poses and save (UI only, DB later).
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-3">
          <div className="space-y-2">
            <Label htmlFor="word">Word name</Label>
            <Input
              id="word"
              placeholder="e.g. hello"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Current sequence</Label>
              {currentSequence.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearSequence} className="h-7 text-xs">
                  Clear
                </Button>
              )}
            </div>
            {currentSequence.length === 0 ? (
              <p className="text-xs text-muted-foreground">Click poses on the right to add.</p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {currentSequence.map((name, i) => (
                  <Badge
                    key={`${name}-${i}`}
                    variant="secondary"
                    className="flex w-fit items-center gap-1 pr-1"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => removeFromSequence(i)}
                      className="rounded p-0.5 hover:bg-muted"
                      aria-label="Remove"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Button
            onClick={saveWord}
            disabled={!wordInput.trim() || currentSequence.length === 0}
            className="w-full"
          >
            <Plus className="mr-2 size-4" /> Save word
          </Button>
          <Button
            variant="outline"
            onClick={playSequence}
            disabled={currentSequence.length === 0 || isPlaying}
            className="w-full"
          >
            <Play className="mr-2 size-4" /> Play sequence
          </Button>
        </div>
        <div className="border-t p-3">
          <Label className="text-muted-foreground text-xs">Saved words (UI only)</Label>
          <ScrollArea className="mt-2 h-40">
            {savedWords.length === 0 ? (
              <p className="text-xs text-muted-foreground">No words saved yet.</p>
            ) : (
              <ul className="space-y-2 pr-2">
                {savedWords.map((item, idx) => (
                  <li
                    key={`${item.word}-${idx}`}
                    className="rounded-md border bg-background p-2 text-sm"
                  >
                    <span className="font-medium">{item.word}</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.sequence.map((p, i) => (
                        <Badge key={i} variant="outline" className="text-xs font-normal">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </aside>

      {/* Center: Avatar */}
      <section className="flex flex-1 items-center justify-center p-4">
        <div className="h-full w-full min-w-0 rounded-lg border bg-muted/20">
          <ModelViewer onBonesLoaded={handleBonesLoaded} modelPath="/human.glb" />
        </div>
      </section>

      {/* Right: All poses by group */}
      <aside className="flex w-80 min-w-80 flex-col overflow-hidden border-l bg-muted/30">
        <div className="shrink-0 border-b p-3">
          <h2 className="text-sm font-semibold">Poses</h2>
          <p className="text-xs text-muted-foreground">Click to play and add to sequence.</p>
        </div>
        <ScrollArea className="h-0 min-h-0 flex-1">
          <Accordion type="multiple" className="w-full" defaultValue={["hand", "palm", "finger", "extra"]}>
            {(Object.keys(poseGroups) as (keyof typeof poseGroups)[]).map((key) => (
              <AccordionItem key={key} value={key} className="border-b px-3">
                <AccordionTrigger className="py-3 text-sm">
                  {poseGroups[key].label}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1 pb-3">
                    {poseGroups[key].poseNames.map((poseName) => (
                      <Button
                        key={poseName}
                        variant="secondary"
                        size="sm"
                        className="h-auto justify-start py-2 text-left text-xs font-normal"
                        onClick={() => addPoseToSequence(poseName)}
                        disabled={isPlaying}
                      >
                        {poseName}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </aside>
      </div>
    </div>
  );
}
