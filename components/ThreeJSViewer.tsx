import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { playSignWord, playIndividualPose } from "./animations/handAnimations";
import { poses } from "./animations/poses";
import { signSequences, getSignSequence } from "./animations/sequences";
import { ModelViewer } from "./viewer/ModelViewer";
import { ModelController } from "./viewer/ModelController";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ThreeJSViewerProps {
  modelPath?: string;
}

export interface ThreeJSViewerRef {
  animate: (animationName: string, disabledPoses?: number[]) => void;
}

const ThreeJSViewer = forwardRef<ThreeJSViewerRef, ThreeJSViewerProps>(({ modelPath = "/human.glb" }, ref) => {
  const bonesRef = useRef<{ [key: string]: THREE.Bone }>({});
  const floatingBonesRef = useRef<{ [key: string]: THREE.Bone }>({});
  const modelRef = useRef<THREE.Group | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showFloatingViewer, setShowFloatingViewer] = useState(false);

  useImperativeHandle(ref, () => ({
    animate: (animationName: string, disabledPoses?: number[]) => {
      void handleAnimate(animationName, disabledPoses);
    },
  }));

  const handleBonesLoaded = (bones: { [key: string]: THREE.Bone }, model: THREE.Group) => {
    bonesRef.current = bones;
    modelRef.current = model;
  };

  const handleFloatingBonesLoaded = (bones: { [key: string]: THREE.Bone }) => {
    floatingBonesRef.current = bones;
  };

  const playSequenceArray = async (
    bones: { [key: string]: THREE.Bone },
    sequence: string[],
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

  const handleAnimate = async (animationName: string, disabledPoses?: number[]) => {
    const playOnBones = async (bones: { [key: string]: THREE.Bone }) => {
      if (!bones) return;

      const sequence = getSignSequence(animationName);
      if (sequence?.length) {
        await playSequenceArray(bones, sequence, disabledPoses);
        return;
      }

      const poseConfig = poses[animationName as keyof typeof poses];
      if (poseConfig) {
        await playIndividualPose(bones, poseConfig, playbackSpeed);
        return;
      }

      console.error(`Animation "${animationName}" not found in sequences or poses`);
    };
    if (bonesRef.current) await playOnBones(bonesRef.current);
    if (showFloatingViewer && floatingBonesRef.current) await playOnBones(floatingBonesRef.current);
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-80 flex-col">
        <div className="flex items-center justify-between border-b p-2">
          <h2 className="text-lg font-semibold">Model Controls</h2>
        </div>
        <div className="flex items-center space-x-2 border-b p-2">
          <Switch id="floating-mode" checked={showFloatingViewer} onCheckedChange={setShowFloatingViewer} />
          <Label htmlFor="floating-mode">Floating Avatar</Label>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <ModelController
            bonesRef={bonesRef}
            onAnimate={handleAnimate}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
          />
        </div>
      </div>
      <div className="h-full flex-1">
        <ModelViewer onBonesLoaded={handleBonesLoaded} modelPath={modelPath} />
      </div>
      {showFloatingViewer && (
        <ModelViewer
          onBonesLoaded={handleFloatingBonesLoaded}
          floating={true}
          initialPosition={{ x: window.innerWidth - 190, y: window.innerHeight - 240 }}
          modelPath={modelPath}
        />
      )}
    </div>
  );
});

ThreeJSViewer.displayName = "ThreeJSViewer";

export default ThreeJSViewer;
