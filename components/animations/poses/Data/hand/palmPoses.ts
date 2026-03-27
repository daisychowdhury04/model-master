import { createPose } from '../../utils/rotationUtils';
import { boneNames } from '../../../../boneName';

// Focus only on the main hand bone for palm orientation
const PALM_BONES = [boneNames.RightHand];
const PALM_DURATION = 800;

// Simple rotation creator for basic poses
const createSimpleRotation = (x: number[], y: number[], z: number[]) => (progress: number) => {
    const easedProgress = Math.sin(progress * Math.PI / 2);
    return {
        x: {
            [boneNames.RightHand]: x[0] * easedProgress
        },
        y: {
            [boneNames.RightHand]: y[0] * easedProgress
        },
        z: {
            [boneNames.RightHand]: z[0] * easedProgress
        }
    };
};

export const palmPoses = {
    "PALM_NORTH_FACING": createPose(
        PALM_DURATION,
        PALM_BONES,
        createSimpleRotation([-75], [43], [-83])
    ),

    "PALM_NORTH_FACING_BACK": createPose(
        PALM_DURATION,
        PALM_BONES,
        createSimpleRotation([110], [-12], [-83])
    ),

    "PALM_EAST_FACING": createPose(
        PALM_DURATION,
        PALM_BONES,
        createSimpleRotation([-55], [160], [-10])
    ),

    "PALM_EAST_FACING_BACK": createPose(
        PALM_DURATION,
        PALM_BONES,
        createSimpleRotation([-55], [-35], [10])
    ),

    "PALM_SOUTH_FACING": createPose(
        PALM_DURATION,
        PALM_BONES,
        createSimpleRotation([-75], [-100], [-95])
    ),

    "PALM_SOUTH_FACING_BACK": createPose(
        PALM_DURATION,
        PALM_BONES,
        createSimpleRotation([110], [110], [-83])
    ),

    "PALM_WEST_FACING": createPose(
        PALM_DURATION,
        PALM_BONES,
        createSimpleRotation([-55], [160], [180])
    ),

    "PALM_WEST_FACING_BACK": createPose(
        PALM_DURATION,
        PALM_BONES,
        createSimpleRotation([-55], [-35], [180])
    )

};