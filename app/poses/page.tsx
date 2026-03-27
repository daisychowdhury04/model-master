"use client";

import React, { useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ModelViewer } from "@/components/viewer/ModelViewer";
import { AppRoutesNav } from "@/components/nav/AppRoutesNav";
import { playIndividualPose } from "@/components/animations/handAnimations";
import { poses } from "@/components/animations/poses";
import { poseGroups } from "@/components/animations/poses/poseGroups";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Plus, Trash2, ListOrdered, PanelLeftClose, PanelLeftOpen } from "lucide-react";

type BoneRotations = Record<string, { x: number; y: number; z: number }>;

function captureBoneRotations(bones: { [key: string]: THREE.Bone }): BoneRotations {
  const out: BoneRotations = {};
  Object.entries(bones).forEach(([name, bone]) => {
    out[name] = {
      x: bone.rotation.x,
      y: bone.rotation.y,
      z: bone.rotation.z,
    };
  });
  return out;
}

function applyBoneRotations(bones: { [key: string]: THREE.Bone }, rotations: BoneRotations) {
  Object.entries(rotations).forEach(([name, rot]) => {
    const bone = bones[name];
    if (bone) {
      bone.rotation.x = rot.x;
      bone.rotation.y = rot.y;
      bone.rotation.z = rot.z;
      bone.updateMatrix();
      bone.updateMatrixWorld(true);
    }
  });
}

export default function PosesPage() {
  const bonesRef = useRef<{ [key: string]: THREE.Bone }>({});
  const initialRotationsRef = useRef<BoneRotations | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleBonesLoaded = useCallback((bones: { [key: string]: THREE.Bone }) => {
    bonesRef.current = bones;
    initialRotationsRef.current = captureBoneRotations(bones);
    setModelLoaded(true);
  }, []);

  const playPose = async (poseName: string) => {
    const config = poses[poseName];
    if (!config || !bonesRef.current) return;
    setIsPlaying(true);
    setLastPlayed(poseName);
    try {
      await playIndividualPose(bonesRef.current, config, 1);
      // Pose stays where it is (no reset)
    } finally {
      setIsPlaying(false);
    }
  };

  const resetToDefault = () => {
    const bones = bonesRef.current;
    const initial = initialRotationsRef.current;
    if (!bones || !initial) return;
    applyBoneRotations(bones, initial);
    setLastPlayed(null);
  };

  const addToSequence = (poseName: string) => {
    setSequence((prev) => [...prev, poseName]);
  };

  const removeFromSequence = (index: number) => {
    setSequence((prev) => prev.filter((_, i) => i !== index));
  };

  const clearSequence = () => setSequence([]);

  const playSequence = async () => {
    if (!bonesRef.current || sequence.length === 0) return;
    setIsPlaying(true);
    try {
      for (const poseName of sequence) {
        const config = poses[poseName];
        if (config) await playIndividualPose(bonesRef.current, config, 1);
      }
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <AppRoutesNav />
      <div className="relative flex min-h-0 flex-1">
      {/* Toggle sidebar */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-3 left-3 z-10 shadow-md"
        onClick={() => setSidebarOpen((o) => !o)}
        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
      >
        {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </Button>
      {/* Left: Back + list of all poses by group — hidden by default, larger when open */}
      <aside
        className={`flex flex-col overflow-hidden border-r bg-muted/30 transition-[width] duration-200 ease-out ${
          sidebarOpen ? "w-[420px] min-w-[420px]" : "w-0 min-w-0 overflow-hidden border-0"
        }`}
      >
        <div className="shrink-0 border-b p-3 space-y-3 w-[420px]">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              disabled={!modelLoaded || isPlaying}
              title="Reset avatar to default position"
              className="shrink-0"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Default
            </Button>
          </div>
          <h1 className="text-lg font-semibold">Test Poses</h1>
          <p className="text-xs text-muted-foreground">
            Play a pose or add to sequence. Play sequence runs your full list.
          </p>
          {/* Your sequence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <ListOrdered className="h-3.5 w-3.5" /> Your sequence
              </span>
              {sequence.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearSequence} className="h-7 text-xs">
                  Clear
                </Button>
              )}
            </div>
            {sequence.length === 0 ? (
              <p className="text-xs text-muted-foreground">Add poses below to build a sequence.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {sequence.map((name, i) => (
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
                      aria-label="Remove from sequence"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={playSequence}
              disabled={sequence.length === 0 || isPlaying}
            >
              <Play className="h-4 w-4 mr-2" />
              Play sequence ({sequence.length})
            </Button>
          </div>
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
                    {poseGroups[key].poseNames.map((poseName) => {
                      const config = poses[poseName];
                      const duration = config ? `${Math.round(config.duration / 1000 * 10) / 10}s` : "";
                      return (
                        <div
                          key={poseName}
                          className="flex items-center gap-1 rounded-md border border-transparent hover:border-border overflow-hidden"
                        >
                          <Button
                            variant={lastPlayed === poseName ? "default" : "secondary"}
                            size="sm"
                            className="h-auto flex-1 min-w-0 justify-start py-2 text-left text-xs font-normal rounded-r-none"
                            onClick={() => playPose(poseName)}
                            disabled={isPlaying}
                          >
                            <span className="flex-1 min-w-0 truncate" title={poseName}>
                              {poseName}
                            </span>
                            {duration && (
                              <span className="shrink-0 ml-1 text-muted-foreground">
                                {duration}
                              </span>
                            )}
                            <Play className="h-3 w-3 shrink-0 ml-1 opacity-70" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-auto py-2 px-2 rounded-l-none border-l"
                            onClick={() => addToSequence(poseName)}
                            disabled={isPlaying}
                            title="Add to sequence"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </aside>

      {/* Center: Model */}
      <section className="flex flex-1 items-center justify-center p-4">
        <div className="h-full w-full min-w-0 rounded-lg border bg-muted/20">
          <ModelViewer onBonesLoaded={handleBonesLoaded} modelPath="/human.glb" />
        </div>
      </section>
      </div>
    </div>
  );
}
