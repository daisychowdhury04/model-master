import { createPose } from "../../utils/rotationUtils";
import { boneNames } from "../../../../boneName";

/**
 * Composite hand shapes (palm + fingers in one pose).
 * These are not pure “finger only” — use `/poses` “extra” group or sequences by name.
 */

/** Same palm end state as `PALM_NORTH_FACING` (no extra yaw). */
const PALM_NORTH = { x: -75, y: 43, z: -83 } as const;

export const extraHandPoses = {
  /**
   * ASL “C”: palm = north-facing (same as `PALM_NORTH_FACING`), plus C arc on thumb + fingers (MCP).
   */
  RIGHT_EXTRA_ASL_C_HAND: createPose(400, [
    boneNames.RightHand,
    boneNames.RightThumb1,
    boneNames.RightIndex1,
    boneNames.RightMiddle1,
    boneNames.RightRing1,
    boneNames.RightPinky1,
  ], (progress) => ({
    x: {
      [boneNames.RightHand]: PALM_NORTH.x * progress,
      [boneNames.RightThumb1]: 34 * progress,
      [boneNames.RightIndex1]: 30 * progress,
      [boneNames.RightMiddle1]: 34 * progress,
      [boneNames.RightRing1]: 38 * progress,
      [boneNames.RightPinky1]: 42 * progress,
    },
    y: {
      [boneNames.RightHand]: PALM_NORTH.y * progress,
      [boneNames.RightThumb1]: -5 * progress,
      [boneNames.RightIndex1]: 4 * progress,
      [boneNames.RightMiddle1]: 6 * progress,
      [boneNames.RightRing1]: 8 * progress,
      [boneNames.RightPinky1]: 10 * progress,
    },
    z: {
      [boneNames.RightHand]: PALM_NORTH.z * progress,
      [boneNames.RightThumb1]: -37 * progress,
      [boneNames.RightIndex1]: -5 * progress,
      [boneNames.RightMiddle1]: -4.5 * progress,
      [boneNames.RightRing1]: -4 * progress,
      [boneNames.RightPinky1]: -3.5 * progress,
    },
  })),
} as const;
