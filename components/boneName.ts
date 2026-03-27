export const boneNames = {
    // Right Hand and Fingers
    RightHand: 'RightHand_49',
    RightThumb1: 'RightHandThumb1_32',
    RightThumb2: 'RightHandThumb2_31',
    RightThumb3: 'RightHandThumb3_30',
    RightThumb4: 'RightHandThumb4_29',
    RightIndex1: 'RightHandIndex1_36',
    RightIndex2: 'RightHandIndex2_35',
    RightIndex3: 'RightHandIndex3_34',
    RightIndex4: 'RightHandIndex4_33',
    RightMiddle1: 'RightHandMiddle1_40',
    RightMiddle2: 'RightHandMiddle2_39',
    RightMiddle3: 'RightHandMiddle3_38',
    RightMiddle4: 'RightHandMiddle4_37',
    RightRing1: 'RightHandRing1_44',
    RightRing2: 'RightHandRing2_43',
    RightRing3: 'RightHandRing3_42',
    RightRing4: 'RightHandRing4_41',
    RightPinky1: 'RightHandPinky1_48',
    RightPinky2: 'RightHandPinky2_47',
    RightPinky3: 'RightHandPinky3_46',
    RightPinky4: 'RightHandPinky4_45',

    // Right Arm
    RightShoulder: 'RightShoulder_52',
    RightArm: 'RightArm_51',
    RightForeArm: 'RightForeArm_50',

    // Left Hand and Fingers
    LeftHand: 'LeftHand_25',
    LeftThumb1: 'LeftHandThumb1_8',
    LeftThumb2: 'LeftHandThumb2_7',
    LeftThumb3: 'LeftHandThumb3_6',
    LeftThumb4: 'LeftHandThumb4_5',
    LeftIndex1: 'LeftHandIndex1_12',
    LeftIndex2: 'LeftHandIndex2_11',
    LeftIndex3: 'LeftHandIndex3_10',
    LeftIndex4: 'LeftHandIndex4_9',
    LeftMiddle1: 'LeftHandMiddle1_16',
    LeftMiddle2: 'LeftHandMiddle2_15',
    LeftMiddle3: 'LeftHandMiddle3_14',
    LeftMiddle4: 'LeftHandMiddle4_13',
    LeftRing1: 'LeftHandRing1_20',
    LeftRing2: 'LeftHandRing2_19',
    LeftRing3: 'LeftHandRing3_18',
    LeftRing4: 'LeftHandRing4_17',
    LeftPinky1: 'LeftHandPinky1_24',
    LeftPinky2: 'LeftHandPinky2_23',
    LeftPinky3: 'LeftHandPinky3_22',
    LeftPinky4: 'LeftHandPinky4_21',

    // Left Arm
    LeftShoulder: 'LeftShoulder_28',
    LeftArm: 'LeftArm_27',
    LeftForeArm: 'LeftForeArm_26',

    // Head
    Head: 'Head_3',
    HeadTop: 'HeadTop_End_0',
    Neck: 'Neck_4',
    LeftEye: 'LeftEye_1',
    RightEye: 'RightEye_2',

    // Spine
    Root: 'GLTF_created_0_rootJoint',
    Hips: 'Hips_66',
    Spine: 'Spine_55',
    Spine1: 'Spine1_54',
    Spine2: 'Spine2_53',

    // Legs
    RightUpLeg: 'RightUpLeg_65',
    RightLeg: 'RightLeg_64',
    RightFoot: 'RightFoot_63',
    RightToeBase: 'RightToeBase_62',
    RightToeEnd: 'RightToe_End_61',
    LeftUpLeg: 'LeftUpLeg_60',
    LeftLeg: 'LeftLeg_59',
    LeftFoot: 'LeftFoot_58',
    LeftToeBase: 'LeftToeBase_57',
    LeftToeEnd: 'LeftToe_End_56'
} as const;

export type BoneName = keyof typeof boneNames;