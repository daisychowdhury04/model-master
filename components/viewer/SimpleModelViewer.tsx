import React, { useRef, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import { toast } from "sonner";
import { playSignWord, playIndividualPose } from "../animations/handAnimations";
import { poses } from "../animations/poses";
import { signSequences, getSignSequence } from "../animations/sequences";
import { ModelViewer } from "./ModelViewer";

/** Avoid skipping poses when `animate()` runs before the GLB has finished loading (same timing as home once loaded). */
async function waitForBonesReady(
  bonesRef: React.MutableRefObject<{ [key: string]: THREE.Bone }>,
  timeoutMs = 20000,
  minBoneCount = 8
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const bones = bonesRef.current;
    if (bones && Object.keys(bones).length >= minBoneCount) return true;
    await new Promise((r) => setTimeout(r, 32));
  }
  return false;
}

const playSequenceFromTempKey = async (
  bones: { [key: string]: THREE.Bone },
  sequence: string[],
  playbackSpeed: number = 1,
  disabledPoses?: number[]
) => {
  const tempKey = `__temp_sequence_${Date.now()}`;
  (signSequences as Record<string, readonly string[]>)[tempKey] = sequence;
  try {
    await playSignWord(bones, tempKey as keyof typeof signSequences, playbackSpeed, disabledPoses);
  } finally {
    delete (signSequences as Record<string, readonly string[]>)[tempKey];
  }
};

export interface SimpleModelViewerRef {
  /** Resolves when the sign sequence or single pose finishes (or immediately if bones/model not ready). */
  animate: (animationName: string, disabledPoses?: number[]) => Promise<void>;
}

interface SimpleModelViewerProps {
  modelPath?: string;
  initialHeadRotation?: { x: number; y: number; z: number };
  initialLegRotation?: { x: number; y: number; z: number };
  initialArmRotation?: { x: number; y: number; z: number };
  floating?: boolean;
  initialPosition?: { x: number; y: number };
  /** Same as home Model Controls slider (default 1). */
  playbackSpeed?: number;
}

const SimpleModelViewer = forwardRef<SimpleModelViewerRef, SimpleModelViewerProps>(
  ({ modelPath = "/human.glb", playbackSpeed = 1, ...props }, ref) => {
    const bonesRef = useRef<{ [key: string]: THREE.Bone }>({});

    useImperativeHandle(ref, () => ({
      animate: (animationName: string, disabledPoses?: number[]) =>
        handleAnimate(animationName, disabledPoses),
    }));

    const handleBonesLoaded = (bones: { [key: string]: THREE.Bone }, model: THREE.Group) => {
      bonesRef.current = bones;
      void model;
    };

    const handleAnimate = async (animationName: string, disabledPoses?: number[]) => {
      const ready = await waitForBonesReady(bonesRef);
      if (!ready) {
        toast.error("Model is still loading — wait a moment and try Sign again.");
        return;
      }

      const sequence = getSignSequence(animationName);
      if (sequence?.length) {
        await playSequenceFromTempKey(bonesRef.current, sequence, playbackSpeed, disabledPoses);
        return;
      }

      const poseConfig = poses[animationName as keyof typeof poses];
      if (poseConfig) {
        await playIndividualPose(bonesRef.current, poseConfig, playbackSpeed);
        return;
      }

      toast.error(`Animation "${animationName}" not found in signSequences or poses`);
    };

    return <ModelViewer {...props} onBonesLoaded={handleBonesLoaded} modelPath={modelPath} />;
  }
);

SimpleModelViewer.displayName = "SimpleModelViewer";

export default SimpleModelViewer;
