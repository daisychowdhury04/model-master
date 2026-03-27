import { boneNames } from './boneName';

interface BoneConfig {
  bones: string[];
  limits: {
    x: { min: number; max: number };
    y: { min: number; max: number };
    z: { min: number; max: number };
  };
}

export const boneGroups: Record<string, Record<string, BoneConfig>> = {
  'Right Hand': {
    'Hand': {
      bones: [boneNames.RightHand],
      limits: { x: {min: -180, max: 180}, y: {min: -180, max: 180}, z: {min: -180, max: 180} }
    },
    'Thumb': {
      bones: [boneNames.RightThumb1, boneNames.RightThumb2, boneNames.RightThumb3, boneNames.RightThumb4],
      limits: { x: {min: -45, max: 45}, y: {min: -45, max: 45}, z: {min: -45, max: 45} }
    },
    'Index': {
      bones: [boneNames.RightIndex1, boneNames.RightIndex2, boneNames.RightIndex3, boneNames.RightIndex4],
      limits: { x: {min: -180, max: 180}, y: {min: -30, max: 30}, z: {min: -30, max: 30} }
    },
    'Middle': {
      bones: [boneNames.RightMiddle1, boneNames.RightMiddle2, boneNames.RightMiddle3, boneNames.RightMiddle4],
      limits: { x: {min: -180, max: 180}, y: {min: -30, max: 30}, z: {min: -30, max: 30} }
    },
    'Ring': {
      bones: [boneNames.RightRing1, boneNames.RightRing2, boneNames.RightRing3, boneNames.RightRing4],
      limits: { x: {min: -180, max: 180}, y: {min: -30, max: 30}, z: {min: -30, max: 30} }
    },
    'Pinky': {
      bones: [boneNames.RightPinky1, boneNames.RightPinky2, boneNames.RightPinky3, boneNames.RightPinky4],
      limits: { x: {min: -180, max: 180}, y: {min: -30, max: 30}, z: {min: -30, max: 30} }
    }
  },
  'Left Hand': {
    'Hand': {
      bones: [boneNames.LeftHand],
      limits: { x: {min: -90, max: 90}, y: {min: -90, max: 90}, z: {min: -90, max: 90} }
    },
    'Thumb': {
      bones: [boneNames.LeftThumb1, boneNames.LeftThumb2, boneNames.LeftThumb3, boneNames.LeftThumb4],
      limits: { x: {min: -45, max: 45}, y: {min: -45, max: 45}, z: {min: -45, max: 45} }
    },
    'Index': {
      bones: [boneNames.LeftIndex1, boneNames.LeftIndex2, boneNames.LeftIndex3, boneNames.LeftIndex4],
      limits: { x: {min: -90, max: 90}, y: {min: -30, max: 30}, z: {min: -30, max: 30} }
    },
    'Middle': {
      bones: [boneNames.LeftMiddle1, boneNames.LeftMiddle2, boneNames.LeftMiddle3, boneNames.LeftMiddle4],
      limits: { x: {min: -90, max: 90}, y: {min: -30, max: 30}, z: {min: -30, max: 30} }
    },
    'Ring': {
      bones: [boneNames.LeftRing1, boneNames.LeftRing2, boneNames.LeftRing3, boneNames.LeftRing4],
      limits: { x: {min: -90, max: 90}, y: {min: -30, max: 30}, z: {min: -30, max: 30} }
    },
    'Pinky': {
      bones: [boneNames.LeftPinky1, boneNames.LeftPinky2, boneNames.LeftPinky3, boneNames.LeftPinky4],
      limits: { x: {min: -90, max: 90}, y: {min: -30, max: 30}, z: {min: -30, max: 30} }
    }
  },
  'Arms': {
    'Right Shoulder': {
      bones: [boneNames.RightShoulder],
      limits: { x: {min: -180, max: 180}, y: {min: -45, max: 180}, z: {min: -90, max: 90} }
    },
    'Right Upper Arm': {
      bones: [boneNames.RightArm],
      limits: { x: {min: -180, max: 180}, y: {min: -45, max: 180}, z: {min: -90, max: 90} }
    },
    'Right Forearm': {
      bones: [boneNames.RightForeArm],
      limits: { x: {min: -180, max: 180}, y: {min: -180, max: 180}, z: {min: -180, max: 180} }
    },
    'Left Shoulder': {
      bones: [boneNames.LeftShoulder],
      limits: { x: {min: -180, max: 180}, y: {min: -180, max: 180}, z: {min: -180, max: 180} }
    },
    'Left Upper Arm': {
      bones: [boneNames.LeftArm],
      limits: { x: {min: -180, max: 180}, y: {min: -180, max: 180}, z: {min: -180, max: 180} }
    },
    'Left Forearm': {
      bones: [boneNames.LeftForeArm],
      limits: { x: {min: -180, max: 180}, y: {min: -180, max: 180}, z: {min: -180, max: 180} }
    }
  },
  'Legs': {
    'Right Upper Leg': {
      bones: [boneNames.RightUpLeg],
      limits: { x: {min: -90, max: 90}, y: {min: -45, max: 45}, z: {min: -45, max: 45} }
    },
    'Right Lower Leg': {
      bones: [boneNames.RightLeg],
      limits: { x: {min: 0, max: 150}, y: {min: -10, max: 10}, z: {min: -10, max: 10} }
    },
    'Right Foot': {
      bones: [boneNames.RightFoot, boneNames.RightToeBase, boneNames.RightToeEnd],
      limits: { x: {min: -45, max: 45}, y: {min: -30, max: 30}, z: {min: -30, max: 30} }
    },
    'Left Upper Leg': {
      bones: [boneNames.LeftUpLeg],
      limits: { x: {min: -90, max: 90}, y: {min: -45, max: 45}, z: {min: -45, max: 45} }
    },
    'Left Lower Leg': {
      bones: [boneNames.LeftLeg],
      limits: { x: {min: 0, max: 150}, y: {min: -10, max: 10}, z: {min: -10, max: 10} }
    },
    'Left Foot': {
      bones: [boneNames.LeftFoot, boneNames.LeftToeBase, boneNames.LeftToeEnd],
      limits: { x: {min: -45, max: 45}, y: {min: -30, max: 30}, z: {min: -30, max: 30} }
    }
  },
  'Torso': {
    'Root': {
      bones: [boneNames.Root],
      limits: { x: {min: -45, max: 45}, y: {min: -180, max: 180}, z: {min: -45, max: 45} }
    },
    'Spine': {
      bones: [boneNames.Hips, boneNames.Spine, boneNames.Spine1, boneNames.Spine2],
      limits: { x: {min: -45, max: 45}, y: {min: -45, max: 45}, z: {min: -45, max: 45} }
    }
  },
  'Head': {
    'Neck': {
      bones: [boneNames.Neck],
      limits: { x: {min: -45, max: 45}, y: {min: -90, max: 90}, z: {min: -45, max: 45} }
    },
    'Head': {
      bones: [boneNames.Head, boneNames.HeadTop],
      limits: { x: {min: -45, max: 45}, y: {min: -90, max: 90}, z: {min: -45, max: 45} }
    },
    'Eyes': {
      bones: [boneNames.LeftEye, boneNames.RightEye],
      limits: { x: {min: -30, max: 30}, y: {min: -30, max: 30}, z: {min: 0, max: 0} }
    }
  }
}; 