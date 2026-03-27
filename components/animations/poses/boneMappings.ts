import { boneNames } from '../../boneName';

export const boneMapping: Record<string, string> = {
    // Hand and Fingers
    [boneNames.RightHand]: boneNames.LeftHand,
    [boneNames.RightThumb1]: boneNames.LeftThumb1,
    [boneNames.RightThumb2]: boneNames.LeftThumb2,
    [boneNames.RightThumb3]: boneNames.LeftThumb3,
    [boneNames.RightThumb4]: boneNames.LeftThumb4,
    [boneNames.RightIndex1]: boneNames.LeftIndex1,
    [boneNames.RightIndex2]: boneNames.LeftIndex2,
    [boneNames.RightIndex3]: boneNames.LeftIndex3,
    [boneNames.RightIndex4]: boneNames.LeftIndex4,
    [boneNames.RightMiddle1]: boneNames.LeftMiddle1,
    [boneNames.RightMiddle2]: boneNames.LeftMiddle2,
    [boneNames.RightMiddle3]: boneNames.LeftMiddle3,
    [boneNames.RightMiddle4]: boneNames.LeftMiddle4,
    [boneNames.RightRing1]: boneNames.LeftRing1,
    [boneNames.RightRing2]: boneNames.LeftRing2,
    [boneNames.RightRing3]: boneNames.LeftRing3,
    [boneNames.RightRing4]: boneNames.LeftRing4,
    [boneNames.RightPinky1]: boneNames.LeftPinky1,
    [boneNames.RightPinky2]: boneNames.LeftPinky2,
    [boneNames.RightPinky3]: boneNames.LeftPinky3,
    [boneNames.RightPinky4]: boneNames.LeftPinky4,

    // Arms
    [boneNames.RightShoulder]: boneNames.LeftShoulder,
    [boneNames.RightArm]: boneNames.LeftArm,
    [boneNames.RightForeArm]: boneNames.LeftForeArm,

    // Legs
    [boneNames.RightUpLeg]: boneNames.LeftUpLeg,
    [boneNames.RightLeg]: boneNames.LeftLeg,
    [boneNames.RightFoot]: boneNames.LeftFoot,
    [boneNames.RightToeBase]: boneNames.LeftToeBase,
    [boneNames.RightToeEnd]: boneNames.LeftToeEnd
};