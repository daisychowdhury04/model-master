export type RotationValue = number | { [boneName: string]: number };

export interface AnimationConfig {
  duration: number;
  bones: string[];
  getRotation: (progress: number) => { x?: RotationValue; y?: RotationValue; z?: RotationValue };
}