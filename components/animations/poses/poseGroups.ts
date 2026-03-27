import { handMovements } from './Data/hand/handMovements';
import { palmPoses } from './Data/hand/palmPoses';
import { fingerPoses } from "./Data/hand/fingerPoses";
import { extraHandPoses } from "./Data/hand/extra";

const rightHandNames = Object.keys(handMovements) as string[];
const leftHandNames = rightHandNames.map((k) => k.replace('RIGHT_', 'LEFT_'));

const rightPalmNames = Object.keys(palmPoses) as string[];
const leftPalmNames = rightPalmNames.map((k) => 'LEFT_' + k);

const rightFingerNames = Object.keys(fingerPoses) as string[];
const leftFingerNames = rightFingerNames.map((k) => 'LEFT_' + k);

const rightExtraNames = Object.keys(extraHandPoses) as string[];
const leftExtraNames = rightExtraNames.map((k) => k.replace('RIGHT_', 'LEFT_'));

export const poseGroups = {
  hand: {
    label: 'Hand movements',
    poseNames: [...rightHandNames, ...leftHandNames],
  },
  palm: {
    label: 'Palm poses',
    poseNames: [...rightPalmNames, ...leftPalmNames],
  },
  finger: {
    label: "Finger poses",
    poseNames: [...rightFingerNames, ...leftFingerNames],
  },
  extra: {
    label: "Extra (palm + hand shape)",
    poseNames: [...rightExtraNames, ...leftExtraNames],
  },
} as const;

export type PoseGroupKey = keyof typeof poseGroups;
