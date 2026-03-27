import { neutralPoses } from './Data/basic/neutralPoses';
import { palmPoses, fingerPoses, handMovements, extraHandPoses } from "./Data/hand";
import { boneMapping } from './boneMappings';
import { createMirroredRotation, type Rotation } from './utils/rotationUtils';
import { AnimationConfig } from '../types';

// Combine all pose definitions
const poseDefinitions = {
  ...neutralPoses,
  ...palmPoses,
  ...fingerPoses,
  ...handMovements,
  ...extraHandPoses,
} as const;

// Create the final poses object with both right and left poses
export const poses = { ...poseDefinitions } as Record<string, AnimationConfig>;

function createLeftPoseConfig(value: AnimationConfig): AnimationConfig {
    return {
        duration: value.duration,
        bones: value.bones.map(bone => boneMapping[bone] || bone.replace('Right', 'Left')),
        getRotation: (progress: number) => {
            const rotation = value.getRotation(progress) as Rotation;
            const mirroredRotation = createMirroredRotation(rotation);
            if (typeof mirroredRotation.x === 'object') {
                mirroredRotation.x = Object.fromEntries(
                    Object.entries(mirroredRotation.x).map(([bone, val]) =>
                        [boneMapping[bone] || bone.replace('Right', 'Left'), val]
                    )
                );
            }
            if (typeof mirroredRotation.y === 'object') {
                mirroredRotation.y = Object.fromEntries(
                    Object.entries(mirroredRotation.y).map(([bone, val]) =>
                        [boneMapping[bone] || bone.replace('Right', 'Left'), val]
                    )
                );
            }
            if (typeof mirroredRotation.z === 'object') {
                mirroredRotation.z = Object.fromEntries(
                    Object.entries(mirroredRotation.z).map(([bone, val]) =>
                        [boneMapping[bone] || bone.replace('Right', 'Left'), val]
                    )
                );
            }
            return mirroredRotation;
        }
    };
}

// Create mirrored left poses for RIGHT_* keys
Object.entries(poseDefinitions).forEach(([key, value]) => {
    if (key.startsWith('RIGHT_')) {
        poses[key.replace('RIGHT_', 'LEFT_')] = createLeftPoseConfig(value);
    }
});

// Create mirrored left poses for palm (LEFT_PALM_*) and finger (LEFT_*)
Object.entries(palmPoses).forEach(([key, value]) => {
    // Keep explicit right naming for readability in sequences.
    poses['RIGHT_' + key] = value;
    poses['LEFT_' + key] = createLeftPoseConfig(value);
});
Object.entries(fingerPoses).forEach(([key, value]) => {
    // Keep explicit right naming for readability in sequences.
    poses['RIGHT_' + key] = value;
    poses['LEFT_' + key] = createLeftPoseConfig(value);
});

// Aliases for test sequences and JSON: shorthand names -> actual pose config
const poseAliases: [string, string][] = [
    ['PALM_NORTH', 'PALM_NORTH_FACING'],
    ["C_SHAPE", "RIGHT_EXTRA_ASL_C_HAND"],
    ['THUMB_OPEN', 'THUMB_OPEN_OTHERS_CLOSE'],
    ['THUMB_CLOSE', 'THUMB_CLOSE_OTHERS_OPEN'],
    ['INDEX_OPEN', 'INDEX_OPEN_OTHERS_CLOSE'],
    ['INDEX_CLOSE', 'INDEX_CLOSE_OTHERS_OPEN'],
    ['MIDDLE_OPEN', 'MIDDLE_OPEN_OTHERS_CLOSE'],
    ['MIDDLE_CLOSE', 'MIDDLE_CLOSE_OTHERS_OPEN'],
    ['RING_OPEN', 'RING_OPEN_OTHERS_CLOSE'],
    ['RING_CLOSE', 'RING_CLOSE_OTHERS_OPEN'],
    ['PINKY_OPEN', 'PINKY_OPEN_OTHERS_CLOSE'],
    ['PINKY_CLOSE', 'PINKY_CLOSE_OTHERS_OPEN'],
];
poseAliases.forEach(([alias, target]) => {
    if (poses[target]) poses[alias] = poses[target];
});

export type PoseName = keyof typeof poses;