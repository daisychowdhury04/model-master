import React, { useState } from 'react';
import Link from 'next/link';
import { boneGroups } from '../boneConfig';
import * as THREE from 'three';
import { GroupSelector } from './controller/GroupSelector';
import { PartSelector } from './controller/PartSelector';
import { RotationSliders } from './controller/RotationSliders';
import { PlaybackSpeedSlider } from './controller/PlaybackSpeedSlider';
import { SignInput } from './controller/SignInput';
import { CurrentPoseDisplay } from './controller/CurrentPoseDisplay';
import { TestPosesDialog } from './controller/TestPosesDialog';
import { CoordsDialog } from './controller/CoordsDialog';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { playSignPhrase } from "@/lib/playSignPhrase";

interface ModelControllerProps {
  bonesRef: React.MutableRefObject<{ [key: string]: THREE.Bone }>;
  onAnimate: (animationName: string, disabledPoses?: number[]) => Promise<void>;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

export const ModelController = ({ bonesRef, onAnimate, playbackSpeed, setPlaybackSpeed }: ModelControllerProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [text, setText] = useState('');
  const [showCoords, setShowCoords] = useState(false);
  const [showTestPoses, setShowTestPoses] = useState(false);
  const [coordinates, setCoordinates] = useState('');

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setRotation(prev => {
      const newRotation = { ...prev, [axis]: value };
      if (selectedGroup && selectedPart && bonesRef.current) {
        const config = boneGroups[selectedGroup][selectedPart];
        config.bones.forEach(boneName => {
          const bone = bonesRef.current[boneName];
          if (bone) {
            bone.rotation[axis] = THREE.MathUtils.degToRad(value);
          }
        });
      }
      return newRotation;
    });
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await playSignPhrase(onAnimate, text, { sanitize: false });
    setText('');
  };

  const handleGenerateCoordinates = () => {
    const bones = bonesRef.current;
    const coords: Record<string, { x: number, y: number, z: number }> = {};
    Object.entries(bones).forEach(([boneName, bone]) => {
      if (boneName.startsWith('Right')) {
        coords[boneName] = {
          x: Math.round(bone.rotation.x * (180 / Math.PI)),
          y: Math.round(bone.rotation.y * (180 / Math.PI)),
          z: Math.round(bone.rotation.z * (180 / Math.PI))
        };
      }
    });
    setCoordinates(JSON.stringify(coords, null, 2));
    setShowCoords(true);
  };


  const handlePlayTestPose = (poseName: string) => {
    // Play individual pose
    onAnimate(poseName);
    setShowTestPoses(false);
  };

  return (
    <>
      <div className="w-full max-w-xs border-r">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center gap-2">
              <h3 className="text-lg font-semibold">Bone Controls</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={handleGenerateCoordinates}>
                  Generate Coords
                </Button>
              </div>
            </div>


            {/* Test Poses */}
            <div className="flex flex-col gap-2">
              <Button
                variant="default"
                className="w-full"
                size="lg"
                onClick={() => setShowTestPoses(true)}
              >
                🎯 Test Poses
              </Button>
              <Link href="/poses" className="w-full">
                <Button variant="outline" className="w-full" size="sm">
                  View all poses (separate page)
                </Button>
              </Link>
            </div>
            <TestPosesDialog
              open={showTestPoses}
              onOpenChange={setShowTestPoses}
              onPlayPose={handlePlayTestPose}
            />

            <GroupSelector selectedGroup={selectedGroup} onGroupChange={setSelectedGroup} />
            <PartSelector selectedGroup={selectedGroup} selectedPart={selectedPart} onPartChange={setSelectedPart} />
            <RotationSliders selectedGroup={selectedGroup} selectedPart={selectedPart} rotation={rotation} onRotationChange={handleRotationChange} />
            <CurrentPoseDisplay bonesRef={bonesRef} />
            <SignInput text={text} setText={setText} onSubmit={handleTextSubmit} />
            <PlaybackSpeedSlider playbackSpeed={playbackSpeed} setPlaybackSpeed={setPlaybackSpeed} />
          </div>
        </ScrollArea>
      </div>
      <CoordsDialog open={showCoords} setOpen={setShowCoords} coordinates={coordinates} />
    </>
  );
}; 