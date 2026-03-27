import { createPose } from '../../utils/rotationUtils';
import { boneNames } from '../../../../boneName';

const RIGHT_ARM_BONES = [boneNames.RightShoulder, boneNames.RightArm, boneNames.RightForeArm];
const ANIMATION_DURATION = 500;

const createRotation = (shoulder: number[], arm: number[], forearm: number[]) => (progress: number) => {
    const easedProgress = Math.sin(progress * Math.PI / 2);
    return {
        x: {
            [boneNames.RightShoulder]: shoulder[0] * easedProgress,
            [boneNames.RightArm]: arm[0] * easedProgress,
            [boneNames.RightForeArm]: forearm[0] * easedProgress,
        },
        y: {
            [boneNames.RightShoulder]: shoulder[1] * easedProgress,
            [boneNames.RightArm]: arm[1] * easedProgress,
            [boneNames.RightForeArm]: forearm[1] * easedProgress,
        },
        z: {
            [boneNames.RightShoulder]: shoulder[2] * easedProgress,
            [boneNames.RightArm]: arm[2] * easedProgress,
            [boneNames.RightForeArm]: forearm[2] * easedProgress,
        }
    };
};

export const handMovements = {
    "RIGHT_HAND_TO_FOREHEAD": createPose(
        ANIMATION_DURATION,
        RIGHT_ARM_BONES,
        createRotation(
            [18, 13, 91], 
            [52, -30, 11],
            [61, -29, -107]
        )
    ),
    "RIGHT_HAND_TO_CHEST": createPose(
        ANIMATION_DURATION,
        RIGHT_ARM_BONES,
        createRotation(
            [99, 4, 69],    
            [52, -33, 11], 
            [61, -29, -107] 
        )
    ),
    "RIGHT_HAND_TO_DISTANCE_FROM_FOREHEAD": createPose(
        ANIMATION_DURATION,
        RIGHT_ARM_BONES,
        createRotation(
            [18, 13, 91], 
            [52, -30, 11], 
            [61, 5, -107] 
        )
    ),
    "RIGHT_HAND_TO_DISTANCE_FROM_FACE": createPose(
        ANIMATION_DURATION,
        RIGHT_ARM_BONES,
        createRotation(
            [18, 13, 91], 
            [52, -30, 75], 
            [31, 14, -160] 
        )
    ),
    "RIGHT_MUSCLE_POSE": createPose(
        ANIMATION_DURATION,
        RIGHT_ARM_BONES,
        createRotation(
            [4, -30, 92], 
            [52, -30, 11], 
            [74, -40, -110] 
        )
    )
};