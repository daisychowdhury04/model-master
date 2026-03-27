# Avatar coordinates reference

All rotation values below are **Euler angles in degrees** (local bone space, Three.js / glTF rig).  
**x / y / z** are **not** world axes — they are **per-bone local** rotations.  
Poses that use `coefficient * progress` list the **target at full completion** (`progress = 1`).  
Palm and arm poses that use **sin easing** list the **maximum target** (reached when eased factor = 1).

Source files: `components/boneName.ts`, `components/animations/poses/Data/**`.

---

## 1. Skeleton: bone keys → glTF node names

| Key | glTF name |
|-----|-----------|
| Root | GLTF_created_0_rootJoint |
| Hips | Hips_66 |
| Spine | Spine_55 |
| Spine1 | Spine1_54 |
| Spine2 | Spine2_53 |
| Neck | Neck_4 |
| Head | Head_3 |
| HeadTop | HeadTop_End_0 |
| LeftEye | LeftEye_1 |
| RightEye | RightEye_2 |
| LeftShoulder | LeftShoulder_28 |
| LeftArm | LeftArm_27 |
| LeftForeArm | LeftForeArm_26 |
| LeftHand | LeftHand_25 |
| LeftThumb1…LeftThumb4 | LeftHandThumb1_8 … LeftHandThumb4_5 |
| LeftIndex1…LeftIndex4 | LeftHandIndex1_12 … LeftHandIndex4_9 |
| LeftMiddle1…LeftMiddle4 | LeftHandMiddle1_16 … LeftHandMiddle4_13 |
| LeftRing1…LeftRing4 | LeftHandRing1_20 … LeftHandRing4_17 |
| LeftPinky1…LeftPinky4 | LeftHandPinky1_24 … LeftHandPinky4_21 |
| RightShoulder | RightShoulder_52 |
| RightArm | RightArm_51 |
| RightForeArm | RightForeArm_50 |
| RightHand | RightHand_49 |
| RightThumb1…RightThumb4 | RightHandThumb1_32 … RightHandThumb4_29 |
| RightIndex1…RightIndex4 | RightHandIndex1_36 … RightHandIndex4_33 |
| RightMiddle1…RightMiddle4 | RightHandMiddle1_40 … RightHandMiddle4_37 |
| RightRing1…RightRing4 | RightHandRing1_44 … RightHandRing4_41 |
| RightPinky1…RightPinky4 | RightHandPinky1_48 … RightHandPinky4_45 |
| LeftUpLeg | LeftUpLeg_60 |
| LeftLeg | LeftLeg_59 |
| LeftFoot | LeftFoot_58 |
| LeftToeBase | LeftToeBase_57 |
| LeftToeEnd | LeftToe_End_56 |
| RightUpLeg | RightUpLeg_65 |
| RightLeg | RightLeg_64 |
| RightFoot | RightFoot_63 |
| RightToeBase | RightToeBase_62 |
| RightToeEnd | RightToe_End_61 |

*Most pose data only drives **right arm + right hand + fingers**; head/legs are unchanged unless you add poses for them.*

---

## 2. Neutral (`RIGHT_HAND_NEUTRAL`) — duration 800 ms

Bones: RightShoulder, RightArm, RightForeArm (fixed targets, no progress ramp in `getRotation`).

| Bone | X | Y | Z |
|------|---|---|---|
| RightShoulder | 89 | 2 | 91 |
| RightArm | 75 | 0 | 0 |
| RightForeArm | -6 | -1 | -26 |

---

## 3. Palm poses (`RightHand` only) — duration 800 ms

End targets (eased to full at end of clip):

| Pose name | X | Y | Z |
|-----------|---|---|---|
| PALM_NORTH_FACING | -75 | 43 | -83 |
| PALM_NORTH_FACING_BACK | 110 | -12 | -83 |
| PALM_EAST_FACING | -55 | 160 | -10 |
| PALM_EAST_FACING_BACK | -55 | -35 | 10 |
| PALM_SOUTH_FACING | -75 | -100 | -95 |
| PALM_SOUTH_FACING_BACK | 110 | 110 | -83 |
| PALM_WEST_FACING | -55 | 160 | 180 |
| PALM_WEST_FACING_BACK | -55 | -35 | 180 |

---

## 4. Hand movements — duration 500 ms

Bones: RightShoulder, RightArm, RightForeArm (order: shoulder, arm, forearm per axis).

### RIGHT_HAND_TO_FOREHEAD

| | X | Y | Z |
|--|---|---|---|
| RightShoulder | 18 | 52 | 61 |
| RightArm | 13 | -30 | -29 |
| RightForeArm | 91 | 11 | -107 |

### RIGHT_HAND_TO_CHEST

| | X | Y | Z |
|--|---|---|---|
| RightShoulder | 99 | 52 | 61 |
| RightArm | 4 | -33 | -29 |
| RightForeArm | 69 | 11 | -107 |

### RIGHT_HAND_TO_DISTANCE_FROM_FOREHEAD

| | X | Y | Z |
|--|---|---|---|
| RightShoulder | 18 | 52 | 61 |
| RightArm | 13 | -30 | 5 |
| RightForeArm | 91 | 11 | -107 |

### RIGHT_HAND_TO_DISTANCE_FROM_FACE

| | X | Y | Z |
|--|---|---|---|
| RightShoulder | 18 | 52 | 31 |
| RightArm | 13 | -30 | 14 |
| RightForeArm | 91 | 11 | -160 |

### RIGHT_MUSCLE_POSE

| | X | Y | Z |
|--|---|---|---|
| RightShoulder | 4 | 52 | 74 |
| RightArm | -30 | -30 | -40 |
| RightForeArm | 92 | 11 | -110 |

---

## 5. Extra composite (`RIGHT_EXTRA_ASL_C_HAND`) — duration 400 ms

Palm matches **PALM_NORTH_FACING**; fingers MCP (Thumb1…Pinky1). Targets at `progress = 1`:

| Bone | X | Y | Z |
|------|---|---|---|
| RightHand | -75 | 43 | -83 |
| RightThumb1 | 34 | -5 | -37 |
| RightIndex1 | 30 | 4 | -5 |
| RightMiddle1 | 34 | 6 | -4.5 |
| RightRing1 | 38 | 8 | -4 |
| RightPinky1 | 42 | 10 | -3.5 |

---

## 6. Finger poses (MCP: RightThumb1, RightIndex1, RightMiddle1, RightRing1, RightPinky1) — duration 250 ms

Columns: **T, I, M, R, P** = Thumb1, Index1, Middle1, Ring1, Pinky1.  
Each cell is **(X, Y, Z)** in degrees at full pose.

### THUMB_OPEN_OTHERS_CLOSE

| Axis | T | I | M | R | P |
|------|---|---|---|---|---|
| X | 18 | 95 | 93 | 97 | 91 |
| Y | -7 | 2 | 8 | 16 | 24 |
| Z | -49 | -3 | -2 | 1 | 6 |

### INDEX_OPEN_OTHERS_CLOSE

| Axis | T | I | M | R | P |
|------|---|---|---|---|---|
| X | 70 | 11 | 93 | 97 | 91 |
| Y | -7 | 5 | 8 | 16 | 24 |
| Z | -27 | -9 | -2 | 1 | 6 |

### MIDDLE_OPEN_OTHERS_CLOSE

| Axis | T | I | M | R | P |
|------|---|---|---|---|---|
| X | 70 | 95 | 5 | 97 | 91 |
| Y | -7 | 2 | 8 | 16 | 24 |
| Z | -27 | -3 | -2 | 1 | 6 |

### RING_OPEN_OTHERS_CLOSE

| Axis | T | I | M | R | P |
|------|---|---|---|---|---|
| X | 70 | 95 | 93 | 7 | 91 |
| Y | -7 | 2 | 8 | 7 | 24 |
| Z | -27 | -3 | -2 | 6 | 6 |

### PINKY_OPEN_OTHERS_CLOSE

| Axis | T | I | M | R | P |
|------|---|---|---|---|---|
| X | 70 | 95 | 93 | 97 | 10 |
| Y | -7 | 2 | 8 | 16 | 10 |
| Z | -27 | -3 | -2 | 1 | 17 |

### THUMB_CLOSE_OTHERS_OPEN

| Axis | T | I | M | R | P |
|------|---|---|---|---|---|
| X | 70 | 11 | 5 | 7 | 10 |
| Y | -7 | 5 | 8 | 7 | 10 |
| Z | -27 | -9 | -2 | 6 | 17 |

### INDEX_CLOSE_OTHERS_OPEN

| Axis | T | I | M | R | P |
|------|---|---|---|---|---|
| X | 18 | 95 | 5 | 7 | 10 |
| Y | -7 | 2 | 8 | 7 | 10 |
| Z | -49 | -3 | -2 | 6 | 17 |

### MIDDLE_CLOSE_OTHERS_OPEN

| Axis | T | I | M | R | P |
|------|---|---|---|---|---|
| X | 18 | 11 | 93 | 7 | 10 |
| Y | -7 | 5 | 8 | 7 | 10 |
| Z | -49 | -9 | -2 | 6 | 17 |

### RING_CLOSE_OTHERS_OPEN

| Axis | T | I | M | R | P |
|------|---|---|---|---|---|
| X | 18 | 11 | 5 | 97 | 10 |
| Y | -7 | 5 | 8 | 16 | 10 |
| Z | -49 | -9 | -2 | 1 | 17 |

### PINKY_CLOSE_OTHERS_OPEN

| Axis | T | I | M | R | P |
|------|---|---|---|---|---|
| X | 18 | 11 | 5 | 7 | 91 |
| Y | -7 | 5 | 8 | 7 | 24 |
| Z | -49 | -9 | -2 | 6 | 6 |

### ALL_FINGERS_OPEN

| Axis | T | I | M | R | P |
|------|---|---|---|---|---|
| X | 18 | 11 | 5 | 7 | 10 |
| Y | -7 | 5 | 8 | 7 | 10 |
| Z | -49 | -9 | -2 | 6 | 17 |

### ALL_FINGERS_CLOSE

| Axis | T | I | M | R | P |
|------|---|---|---|---|---|
| X | 70 | 95 | 93 | 97 | 91 |
| Y | -7 | 2 | 8 | 16 | 24 |
| Z | -27 | -3 | -2 | 1 | 6 |

---

## 7. Aliases (same data as target)

| Alias | Target pose |
|-------|-------------|
| PALM_NORTH | PALM_NORTH_FACING |
| C_SHAPE | RIGHT_EXTRA_ASL_C_HAND |
| THUMB_OPEN | THUMB_OPEN_OTHERS_CLOSE |
| THUMB_CLOSE | THUMB_CLOSE_OTHERS_OPEN |
| INDEX_OPEN | INDEX_OPEN_OTHERS_CLOSE |
| INDEX_CLOSE | INDEX_CLOSE_OTHERS_OPEN |
| MIDDLE_OPEN | MIDDLE_OPEN_OTHERS_CLOSE |
| MIDDLE_CLOSE | MIDDLE_CLOSE_OTHERS_OPEN |
| RING_OPEN | RING_OPEN_OTHERS_CLOSE |
| RING_CLOSE | RING_CLOSE_OTHERS_OPEN |
| PINKY_OPEN | PINKY_OPEN_OTHERS_CLOSE |
| PINKY_CLOSE | PINKY_CLOSE_OTHERS_OPEN |

---

## 8. Left-hand copies

For every right-only pose name, the runtime builds **`LEFT_…`** variants (mirror mapping in `poses/index.ts` and `boneMappings.ts`). Numeric tables above are for **right**; left uses mirrored logic in code, not a second table here.

---

*Generated from source. If you change `fingerPoses.ts`, `palmPoses.ts`, `handMovements.ts`, `neutralPoses.ts`, or `extra.ts`, update this file to match.*
