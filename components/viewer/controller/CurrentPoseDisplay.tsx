import React, { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { boneNames } from '../../boneName';

interface CurrentPoseDisplayProps {
    bonesRef: React.MutableRefObject<{ [key: string]: THREE.Bone }>;
}

// Easy to modify bone combinations
const BONE_COMBINATIONS = {
    "Hand": [
        boneNames.RightHand
    ],
    "Fingers": [
        boneNames.RightThumb1,
        boneNames.RightIndex1,
        boneNames.RightMiddle1,
        boneNames.RightRing1,
        boneNames.RightPinky1
    ],
    "Hand + Fingers": [
        boneNames.RightHand,
        boneNames.RightThumb1,
        boneNames.RightIndex1,
        boneNames.RightMiddle1,
        boneNames.RightRing1,
        boneNames.RightPinky1
    ],
    "All Right Bones": [
        boneNames.RightShoulder,
        boneNames.RightArm,
        boneNames.RightForeArm,
        boneNames.RightHand,
        boneNames.RightThumb1,
        boneNames.RightIndex1,
        boneNames.RightMiddle1,
        boneNames.RightRing1,
        boneNames.RightPinky1
    ]
} as const;

// Description of what each combination is for
const COMBINATION_DESCRIPTIONS = {
    "Hand": "Palm Only",
    "Fingers": "All Finger Base Bones",
    "Hand + Fingers": "Palm + All Fingers",
    "All Right Bones": "Complete Right Side"
} as const;

export const CurrentPoseDisplay = ({ bonesRef }: CurrentPoseDisplayProps) => {
    const [selectedCombination, setSelectedCombination] = useState<keyof typeof BONE_COMBINATIONS>("Hand + Fingers");
    const [rawCoordinates, setRawCoordinates] = useState<string>("");

    const getCurrentPose = useCallback(() => {
        const bones = bonesRef.current;
        const pose: Record<string, { x: number; y: number; z: number }> = {};

        BONE_COMBINATIONS[selectedCombination].forEach(boneName => {
            const bone = bones[boneName];
            if (bone) {
                pose[boneName] = {
                    x: Math.round(bone.rotation.x * (180 / Math.PI)),
                    y: Math.round(bone.rotation.y * (180 / Math.PI)),
                    z: Math.round(bone.rotation.z * (180 / Math.PI))
                };
            }
        });

        return pose;
    }, [selectedCombination, bonesRef]);


    const formatRawCoordinates = useCallback(() => {
        const pose = getCurrentPose();
        return JSON.stringify(pose, null, 2);
    }, [getCurrentPose]);

    // Add live tracking
    useEffect(() => {
        const updatePose = () => {
            setRawCoordinates(formatRawCoordinates());
            requestAnimationFrame(updatePose);
        };
        const animationId = requestAnimationFrame(updatePose);
        return () => cancelAnimationFrame(animationId);
    }, [formatRawCoordinates]);

    const copyRawCoordinates = () => {
        navigator.clipboard.writeText(rawCoordinates);
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Current Pose Coordinates</h3>
                <div className="flex gap-2">
                    <Select value={selectedCombination} onValueChange={(value) => setSelectedCombination(value as keyof typeof BONE_COMBINATIONS)}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Select bones" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(BONE_COMBINATIONS).map((key) => (
                                <SelectItem key={key} value={key}>
                                    {key} - {COMBINATION_DESCRIPTIONS[key as keyof typeof COMBINATION_DESCRIPTIONS]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Raw Coordinates Display */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h4 className="text-xs font-medium text-muted-foreground">Raw Coordinates (JSON)</h4>
                    <Button variant="outline" size="sm" onClick={copyRawCoordinates}>
                        Copy JSON
                    </Button>
                </div>
                <ScrollArea className="h-[120px] w-full rounded-md border p-2 bg-muted/30">
                    <pre className="text-xs text-muted-foreground">
                        {rawCoordinates}
                    </pre>
                </ScrollArea>
            </div>


            <div className="text-xs text-muted-foreground text-center">
                Use these coordinates to manually set bone positions
            </div>
        </div>
    );
}; 