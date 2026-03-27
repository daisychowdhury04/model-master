import { createPose } from '../../utils/rotationUtils';
import { boneNames } from '../../../../boneName';

export const fingerPoses = {
    "THUMB_OPEN_OTHERS_CLOSE": createPose(250, [
        boneNames.RightThumb1, boneNames.RightIndex1,
        boneNames.RightMiddle1, boneNames.RightRing1,
        boneNames.RightPinky1
    ], (progress) => ({
        x: {
            [boneNames.RightThumb1]: 18 * progress,    // Thumb OPEN - Linear
            [boneNames.RightIndex1]: 95 * progress,   // Index CLOSE - Linear
            [boneNames.RightMiddle1]: 93 * progress,  // Middle CLOSE - Linear
            [boneNames.RightRing1]: 97 * progress,    // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 91 * progress    // Pinky CLOSE - Linear
        },
        y: {
            [boneNames.RightThumb1]: -7 * progress,   // Thumb OPEN - Linear
            [boneNames.RightIndex1]: 2 * progress,    // Index CLOSE - Linear
            [boneNames.RightMiddle1]: 8 * progress,   // Middle CLOSE - Linear
            [boneNames.RightRing1]: 16 * progress,    // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 24 * progress    // Pinky CLOSE - Linear
        },
        z: {
            [boneNames.RightThumb1]: -49 * progress,  // Thumb OPEN - Linear
            [boneNames.RightIndex1]: -3 * progress,   // Index CLOSE - Linear
            [boneNames.RightMiddle1]: -2 * progress,  // Middle CLOSE - Linear
            [boneNames.RightRing1]: 1 * progress,     // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 6 * progress     // Pinky CLOSE - Linear
        }
    })),

    "INDEX_OPEN_OTHERS_CLOSE": createPose(250, [
        boneNames.RightThumb1, boneNames.RightIndex1,
        boneNames.RightMiddle1, boneNames.RightRing1,
        boneNames.RightPinky1
    ], (progress) => ({
        x: {
            [boneNames.RightThumb1]: 70 * progress,    // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: 11 * progress,    // Index OPEN - Linear
            [boneNames.RightMiddle1]: 93 * progress,   // Middle CLOSE - Linear
            [boneNames.RightRing1]: 97 * progress,     // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 91 * progress     // Pinky CLOSE - Linear
        },
        y: {
            [boneNames.RightThumb1]: -7 * progress,    // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: 5 * progress,     // Index OPEN - Linear
            [boneNames.RightMiddle1]: 8 * progress,    // Middle CLOSE - Linear
            [boneNames.RightRing1]: 16 * progress,     // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 24 * progress     // Pinky CLOSE - Linear
        },
        z: {
            [boneNames.RightThumb1]: -27 * progress,   // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: -9 * progress,    // Index OPEN - Linear
            [boneNames.RightMiddle1]: -2 * progress,   // Middle CLOSE - Linear
            [boneNames.RightRing1]: 1 * progress,      // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 6 * progress      // Pinky CLOSE - Linear
        }
    })),

    "MIDDLE_OPEN_OTHERS_CLOSE": createPose(250, [
        boneNames.RightThumb1, boneNames.RightIndex1,
        boneNames.RightMiddle1, boneNames.RightRing1,
        boneNames.RightPinky1
    ], (progress) => ({
        x: {
            [boneNames.RightThumb1]: 70 * progress,    // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: 95 * progress,    // Index CLOSE - Linear
            [boneNames.RightMiddle1]: 5 * progress,    // Middle OPEN - Linear
            [boneNames.RightRing1]: 97 * progress,     // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 91 * progress     // Pinky CLOSE - Linear
        },
        y: {
            [boneNames.RightThumb1]: -7 * progress,    // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: 2 * progress,     // Index CLOSE - Linear
            [boneNames.RightMiddle1]: 8 * progress,    // Middle OPEN - Linear
            [boneNames.RightRing1]: 16 * progress,     // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 24 * progress     // Pinky CLOSE - Linear
        },
        z: {
            [boneNames.RightThumb1]: -27 * progress,   // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: -3 * progress,    // Index CLOSE - Linear
            [boneNames.RightMiddle1]: -2 * progress,   // Middle OPEN - Linear
            [boneNames.RightRing1]: 1 * progress,      // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 6 * progress      // Pinky CLOSE - Linear
        }
    })),

    "RING_OPEN_OTHERS_CLOSE": createPose(250, [
        boneNames.RightThumb1, boneNames.RightIndex1,
        boneNames.RightMiddle1, boneNames.RightRing1,
        boneNames.RightPinky1
    ], (progress) => ({
        x: {
            [boneNames.RightThumb1]: 70 * progress,    // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: 95 * progress,    // Index CLOSE - Linear
            [boneNames.RightMiddle1]: 93 * progress,   // Middle CLOSE - Linear
            [boneNames.RightRing1]: 7 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 91 * progress     // Pinky CLOSE - Linear
        },
        y: {
            [boneNames.RightThumb1]: -7 * progress,    // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: 2 * progress,     // Index CLOSE - Linear
            [boneNames.RightMiddle1]: 8 * progress,    // Middle CLOSE - Linear
            [boneNames.RightRing1]: 7 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 24 * progress     // Pinky CLOSE - Linear
        },
        z: {
            [boneNames.RightThumb1]: -27 * progress,   // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: -3 * progress,    // Index CLOSE - Linear
            [boneNames.RightMiddle1]: -2 * progress,   // Middle CLOSE - Linear
            [boneNames.RightRing1]: 6 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 6 * progress      // Pinky CLOSE - Linear
        }
    })),

    "PINKY_OPEN_OTHERS_CLOSE": createPose(250, [
        boneNames.RightThumb1, boneNames.RightIndex1,
        boneNames.RightMiddle1, boneNames.RightRing1,
        boneNames.RightPinky1
    ], (progress) => ({
        x: {
            [boneNames.RightThumb1]: 70 * progress,    // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: 95 * progress,    // Index CLOSE - Linear
            [boneNames.RightMiddle1]: 93 * progress,   // Middle CLOSE - Linear
            [boneNames.RightRing1]: 97 * progress,     // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 10 * progress     // Pinky OPEN - Linear
        },
        y: {
            [boneNames.RightThumb1]: -7 * progress,    // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: 2 * progress,     // Index CLOSE - Linear
            [boneNames.RightMiddle1]: 8 * progress,    // Middle CLOSE - Linear
            [boneNames.RightRing1]: 16 * progress,     // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 10 * progress     // Pinky OPEN - Linear
        },
        z: {
            [boneNames.RightThumb1]: -27 * progress,   // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: -3 * progress,    // Index CLOSE - Linear
            [boneNames.RightMiddle1]: -2 * progress,   // Middle CLOSE - Linear
            [boneNames.RightRing1]: 1 * progress,      // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 17 * progress     // Pinky OPEN - Linear
        }
    })),

    "THUMB_CLOSE_OTHERS_OPEN": createPose(250, [
        boneNames.RightThumb1, boneNames.RightIndex1,
        boneNames.RightMiddle1, boneNames.RightRing1,
        boneNames.RightPinky1
    ], (progress) => ({
        x: {
            [boneNames.RightThumb1]: 70 * progress,    // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: 11 * progress,    // Index OPEN - Linear
            [boneNames.RightMiddle1]: 5 * progress,    // Middle OPEN - Linear
            [boneNames.RightRing1]: 7 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 10 * progress     // Pinky OPEN - Linear
        },
        y: {
            [boneNames.RightThumb1]: -7 * progress,    // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: 5 * progress,     // Index OPEN - Linear
            [boneNames.RightMiddle1]: 8 * progress,    // Middle OPEN - Linear
            [boneNames.RightRing1]: 7 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 10 * progress     // Pinky OPEN - Linear
        },
        z: {
            [boneNames.RightThumb1]: -27 * progress,   // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: -9 * progress,    // Index OPEN - Linear
            [boneNames.RightMiddle1]: -2 * progress,   // Middle OPEN - Linear
            [boneNames.RightRing1]: 6 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 17 * progress     // Pinky OPEN - Linear
        }
    })),

    "INDEX_CLOSE_OTHERS_OPEN": createPose(250, [
        boneNames.RightThumb1, boneNames.RightIndex1,
        boneNames.RightMiddle1, boneNames.RightRing1,
        boneNames.RightPinky1
    ], (progress) => ({
        x: {
            [boneNames.RightThumb1]: 18 * progress,    // Thumb OPEN - Linear
            [boneNames.RightIndex1]: 95 * progress,    // Index CLOSE - Linear
            [boneNames.RightMiddle1]: 5 * progress,    // Middle OPEN - Linear
            [boneNames.RightRing1]: 7 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 10 * progress     // Pinky OPEN - Linear
        },
        y: {
            [boneNames.RightThumb1]: -7 * progress,    // Thumb OPEN - Linear
            [boneNames.RightIndex1]: 2 * progress,     // Index CLOSE - Linear
            [boneNames.RightMiddle1]: 8 * progress,    // Middle OPEN - Linear
            [boneNames.RightRing1]: 7 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 10 * progress     // Pinky OPEN - Linear
        },
        z: {
            [boneNames.RightThumb1]: -49 * progress,   // Thumb OPEN - Linear
            [boneNames.RightIndex1]: -3 * progress,    // Index CLOSE - Linear
            [boneNames.RightMiddle1]: -2 * progress,   // Middle OPEN - Linear
            [boneNames.RightRing1]: 6 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 17 * progress     // Pinky OPEN - Linear
        }
    })),

    "MIDDLE_CLOSE_OTHERS_OPEN": createPose(250, [
        boneNames.RightThumb1, boneNames.RightIndex1,
        boneNames.RightMiddle1, boneNames.RightRing1,
        boneNames.RightPinky1
    ], (progress) => ({
        x: {
            [boneNames.RightThumb1]: 18 * progress,    // Thumb OPEN - Linear
            [boneNames.RightIndex1]: 11 * progress,    // Index OPEN - Linear
            [boneNames.RightMiddle1]: 93 * progress,   // Middle CLOSE - Linear
            [boneNames.RightRing1]: 7 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 10 * progress     // Pinky OPEN - Linear
        },
        y: {
            [boneNames.RightThumb1]: -7 * progress,    // Thumb OPEN - Linear
            [boneNames.RightIndex1]: 5 * progress,     // Index OPEN - Linear
            [boneNames.RightMiddle1]: 8 * progress,    // Middle CLOSE - Linear
            [boneNames.RightRing1]: 7 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 10 * progress     // Pinky OPEN - Linear
        },
        z: {
            [boneNames.RightThumb1]: -49 * progress,   // Thumb OPEN - Linear
            [boneNames.RightIndex1]: -9 * progress,    // Index OPEN - Linear
            [boneNames.RightMiddle1]: -2 * progress,   // Middle CLOSE - Linear
            [boneNames.RightRing1]: 6 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 17 * progress     // Pinky OPEN - Linear
        }
    })),

    "RING_CLOSE_OTHERS_OPEN": createPose(250, [
        boneNames.RightThumb1, boneNames.RightIndex1,
        boneNames.RightMiddle1, boneNames.RightRing1,
        boneNames.RightPinky1
    ], (progress) => ({
        x: {
            [boneNames.RightThumb1]: 18 * progress,    // Thumb OPEN - Linear
            [boneNames.RightIndex1]: 11 * progress,    // Index OPEN - Linear
            [boneNames.RightMiddle1]: 5 * progress,    // Middle OPEN - Linear
            [boneNames.RightRing1]: 97 * progress,     // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 10 * progress     // Pinky OPEN - Linear
        },
        y: {
            [boneNames.RightThumb1]: -7 * progress,    // Thumb OPEN - Linear
            [boneNames.RightIndex1]: 5 * progress,     // Index OPEN - Linear
            [boneNames.RightMiddle1]: 8 * progress,    // Middle OPEN - Linear
            [boneNames.RightRing1]: 16 * progress,     // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 10 * progress     // Pinky OPEN - Linear
        },
        z: {
            [boneNames.RightThumb1]: -49 * progress,   // Thumb OPEN - Linear
            [boneNames.RightIndex1]: -9 * progress,    // Index OPEN - Linear
            [boneNames.RightMiddle1]: -2 * progress,   // Middle OPEN - Linear
            [boneNames.RightRing1]: 1 * progress,      // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 17 * progress     // Pinky OPEN - Linear
        }
    })),

    "PINKY_CLOSE_OTHERS_OPEN": createPose(250, [
        boneNames.RightThumb1, boneNames.RightIndex1,
        boneNames.RightMiddle1, boneNames.RightRing1,
        boneNames.RightPinky1
    ], (progress) => ({
        x: {
            [boneNames.RightThumb1]: 18 * progress,    // Thumb OPEN - Linear
            [boneNames.RightIndex1]: 11 * progress,    // Index OPEN - Linear
            [boneNames.RightMiddle1]: 5 * progress,    // Middle OPEN - Linear
            [boneNames.RightRing1]: 7 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 91 * progress     // Pinky CLOSE - Linear
        },
        y: {
            [boneNames.RightThumb1]: -7 * progress,    // Thumb OPEN - Linear
            [boneNames.RightIndex1]: 5 * progress,     // Index OPEN - Linear
            [boneNames.RightMiddle1]: 8 * progress,    // Middle OPEN - Linear
            [boneNames.RightRing1]: 7 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 24 * progress     // Pinky CLOSE - Linear
        },
        z: {
            [boneNames.RightThumb1]: -49 * progress,   // Thumb OPEN - Linear
            [boneNames.RightIndex1]: -9 * progress,    // Index OPEN - Linear
            [boneNames.RightMiddle1]: -2 * progress,   // Middle OPEN - Linear
            [boneNames.RightRing1]: 6 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 6 * progress      // Pinky CLOSE - Linear
        }
    })),

    "ALL_FINGERS_OPEN": createPose(250, [
        boneNames.RightThumb1, boneNames.RightIndex1,
        boneNames.RightMiddle1, boneNames.RightRing1,
        boneNames.RightPinky1
    ], (progress) => ({
        x: {
            [boneNames.RightThumb1]: 18 * progress,    // Thumb OPEN - Linear
            [boneNames.RightIndex1]: 11 * progress,    // Index OPEN - Linear
            [boneNames.RightMiddle1]: 5 * progress,    // Middle OPEN - Linear
            [boneNames.RightRing1]: 7 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 10 * progress     // Pinky OPEN - Linear
        },
        y: {
            [boneNames.RightThumb1]: -7 * progress,    // Thumb OPEN - Linear
            [boneNames.RightIndex1]: 5 * progress,     // Index OPEN - Linear
            [boneNames.RightMiddle1]: 8 * progress,    // Middle OPEN - Linear
            [boneNames.RightRing1]: 7 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 10 * progress     // Pinky OPEN - Linear
        },
        z: {
            [boneNames.RightThumb1]: -49 * progress,   // Thumb OPEN - Linear
            [boneNames.RightIndex1]: -9 * progress,    // Index OPEN - Linear
            [boneNames.RightMiddle1]: -2 * progress,   // Middle OPEN - Linear
            [boneNames.RightRing1]: 6 * progress,      // Ring OPEN - Linear
            [boneNames.RightPinky1]: 17 * progress     // Pinky OPEN - Linear
        }
    })),

    "ALL_FINGERS_CLOSE": createPose(250, [
        boneNames.RightThumb1, boneNames.RightIndex1,
        boneNames.RightMiddle1, boneNames.RightRing1,
        boneNames.RightPinky1
    ], (progress) => ({
        x: {
            [boneNames.RightThumb1]: 70 * progress,    // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: 95 * progress,    // Index CLOSE - Linear
            [boneNames.RightMiddle1]: 93 * progress,   // Middle CLOSE - Linear
            [boneNames.RightRing1]: 97 * progress,     // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 91 * progress     // Pinky CLOSE - Linear
        },
        y: {
            [boneNames.RightThumb1]: -7 * progress,    // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: 2 * progress,     // Index CLOSE - Linear
            [boneNames.RightMiddle1]: 8 * progress,    // Middle CLOSE - Linear
            [boneNames.RightRing1]: 16 * progress,     // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 24 * progress     // Pinky CLOSE - Linear
        },
        z: {
            [boneNames.RightThumb1]: -27 * progress,   // Thumb CLOSE - Linear
            [boneNames.RightIndex1]: -3 * progress,    // Index CLOSE - Linear
            [boneNames.RightMiddle1]: -2 * progress,   // Middle CLOSE - Linear
            [boneNames.RightRing1]: 1 * progress,      // Ring CLOSE - Linear
            [boneNames.RightPinky1]: 6 * progress      // Pinky CLOSE - Linear
        }
    })),

};