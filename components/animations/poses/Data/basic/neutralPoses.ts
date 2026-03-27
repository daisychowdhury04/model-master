import { createPose } from '../../utils/rotationUtils';
import { boneNames } from '../../../../boneName';

const RIGHT_ARM_BONES = [boneNames.RightShoulder, boneNames.RightArm, boneNames.RightForeArm];
const NEUTRAL_DURATION = 800;

const createRotation = (x: number[], y: number[], z: number[]) => () => ({
    x: {
        [boneNames.RightShoulder]: x[0],
        [boneNames.RightArm]: x[1],
        [boneNames.RightForeArm]: x[2]
    },
    y: {
        [boneNames.RightShoulder]: y[0],
        [boneNames.RightArm]: y[1],
        [boneNames.RightForeArm]: y[2]
    },
    z: {
        [boneNames.RightShoulder]: z[0],
        [boneNames.RightArm]: z[1],
        [boneNames.RightForeArm]: z[2]
    }
});

/** Palm + all finger phalanges — bind-pose rest (0°) so hand opens between words. */
const RIGHT_PALM_FINGER_BONES = [
    boneNames.RightHand,
    boneNames.RightThumb1, boneNames.RightThumb2, boneNames.RightThumb3, boneNames.RightThumb4,
    boneNames.RightIndex1, boneNames.RightIndex2, boneNames.RightIndex3, boneNames.RightIndex4,
    boneNames.RightMiddle1, boneNames.RightMiddle2, boneNames.RightMiddle3, boneNames.RightMiddle4,
    boneNames.RightRing1, boneNames.RightRing2, boneNames.RightRing3, boneNames.RightRing4,
    boneNames.RightPinky1, boneNames.RightPinky2, boneNames.RightPinky3, boneNames.RightPinky4,
] as const;

const createFullNeutralRotation = () => {
    const arm = createRotation(
        [89, 75, -6],
        [2, 0, -1],
        [91, 0, -26]
    )();
    const x: Record<string, number> = { ...arm.x as Record<string, number> };
    const y: Record<string, number> = { ...arm.y as Record<string, number> };
    const z: Record<string, number> = { ...arm.z as Record<string, number> };
    for (const b of RIGHT_PALM_FINGER_BONES) {
        x[b] = 0;
        y[b] = 0;
        z[b] = 0;
    }
    return () => ({ x, y, z });
};

const RIGHT_FULL_NEUTRAL_BONES = [...RIGHT_ARM_BONES, ...RIGHT_PALM_FINGER_BONES];

export const neutralPoses = {
    "RIGHT_HAND_NEUTRAL": createPose(
        NEUTRAL_DURATION,
        RIGHT_ARM_BONES,
        createRotation(
            [89, 75, -6],
            [2, 0, -1],
            [91, 0, -26]
        )
    ),
    /** Arm to signing neutral + palm & fingers to rest — use between spaced words. */
    "RIGHT_HAND_FULL_NEUTRAL": createPose(
        NEUTRAL_DURATION,
        RIGHT_FULL_NEUTRAL_BONES,
        createFullNeutralRotation()
    )
};