import * as THREE from 'three';
import { poses, PoseName } from './poses';
import { signSequences } from './signSequences';
import { AnimationConfig } from './types';

export const playSignWord = async (
  bones: { [key: string]: THREE.Bone },
  word: keyof typeof signSequences,
  playbackSpeed: number = 1,
  disabledPoses?: number[]
) => {
  const sequence = signSequences[word];
  
  // Filter out disabled poses if provided
  const filteredSequence = disabledPoses && disabledPoses.length > 0
    ? sequence.filter((_, index) => !disabledPoses.includes(index))
    : sequence;
    
  const currentRotations: { [boneName: string]: { x: number, y: number, z: number } } = {};
  
  // Initial rotations setup...
  Object.entries(bones).forEach(([name, bone]) => {
    currentRotations[name] = {
      x: THREE.MathUtils.radToDeg(bone.rotation.x),
      y: THREE.MathUtils.radToDeg(bone.rotation.y),
      z: THREE.MathUtils.radToDeg(bone.rotation.z)
    };
  });

  for (const poseName of filteredSequence) {
    // Handle combined poses with '+'
    const combinedPoses = poseName.split('+');
    const configs = combinedPoses.map(p => poses[p as PoseName]).filter(Boolean);
    
    if (configs.length === 0) {
      console.error(`No valid poses found in "${poseName}"`);
      continue;
    }

    await new Promise(resolve => setTimeout(resolve, 50));

    await new Promise<void>((resolve) => {
      const startRotations = JSON.parse(JSON.stringify(currentRotations));
      const duration = configs[0].duration / playbackSpeed;
      let startTime: number | null = null;

      const animate = () => {
        if (startTime === null) startTime = Date.now();
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Apply all poses in the combination
        configs.forEach(config => {
          const targetRotation = config.getRotation(progress);

          config.bones.forEach(boneName => {
            const bone = bones[boneName];
            if (bone) {
              const start = startRotations[boneName];
              if (!start) return;

              const targetX = typeof targetRotation.x === 'object' ? targetRotation.x[boneName] : targetRotation.x;
              const targetY = typeof targetRotation.y === 'object' ? targetRotation.y[boneName] : targetRotation.y;
              const targetZ = typeof targetRotation.z === 'object' ? targetRotation.z[boneName] : targetRotation.z;

              if (targetX !== undefined) {
                const x = start.x + (targetX - start.x) * progress;
                bone.rotation.x = THREE.MathUtils.degToRad(x);
                currentRotations[boneName].x = x;
              }
              if (targetY !== undefined) {
                const y = start.y + (targetY - start.y) * progress;
                bone.rotation.y = THREE.MathUtils.degToRad(y);
                currentRotations[boneName].y = y;
              }
              if (targetZ !== undefined) {
                const z = start.z + (targetZ - start.z) * progress;
                bone.rotation.z = THREE.MathUtils.degToRad(z);
                currentRotations[boneName].z = z;
              }
              // Same as playIndividualPose — required for skinned meshes to show full motion each frame
              bone.updateMatrix();
              bone.updateMatrixWorld(true);
            }
          });
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }
};

export type SignWord = keyof typeof signSequences;

// New type for animation with disabled poses
export const playIndividualPose = async (
  bones: { [key: string]: THREE.Bone },
  poseConfig: AnimationConfig,
  playbackSpeed: number = 1
) => {
  const currentRotations: { [boneName: string]: { x: number, y: number, z: number } } = {};

  // Initial rotations setup
  Object.entries(bones).forEach(([name, bone]) => {
    currentRotations[name] = {
      x: THREE.MathUtils.radToDeg(bone.rotation.x),
      y: THREE.MathUtils.radToDeg(bone.rotation.y),
      z: THREE.MathUtils.radToDeg(bone.rotation.z)
    };
  });

  await new Promise<void>((resolve) => {
    const startRotations = JSON.parse(JSON.stringify(currentRotations));
    const duration = poseConfig.duration / playbackSpeed;
    let startTime: number | null = null; // start clock on first frame so re-renders don't skip the animation

    const animate = () => {
      if (startTime === null) startTime = Date.now();
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      const targetRotation = poseConfig.getRotation(progress);

      poseConfig.bones.forEach((boneName: string) => {
        const bone = bones[boneName];
        if (bone) {
          const start = startRotations[boneName];
          if (!start) return;

          const targetX = typeof targetRotation.x === 'object' ? targetRotation.x[boneName] : targetRotation.x;
          const targetY = typeof targetRotation.y === 'object' ? targetRotation.y[boneName] : targetRotation.y;
          const targetZ = typeof targetRotation.z === 'object' ? targetRotation.z[boneName] : targetRotation.z;

          if (targetX !== undefined) {
            const x = start.x + (targetX - start.x) * progress;
            bone.rotation.x = THREE.MathUtils.degToRad(x);
            currentRotations[boneName].x = x;
          }
          if (targetY !== undefined) {
            const y = start.y + (targetY - start.y) * progress;
            bone.rotation.y = THREE.MathUtils.degToRad(y);
            currentRotations[boneName].y = y;
          }
          if (targetZ !== undefined) {
            const z = start.z + (targetZ - start.z) * progress;
            bone.rotation.z = THREE.MathUtils.degToRad(z);
            currentRotations[boneName].z = z;
          }
          bone.updateMatrix();
          bone.updateMatrixWorld(true);
        }
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
};

export type AnimationWithDisabledPoses = (word: SignWord, disabledPoses?: number[]) => void;
export type IndividualPosePlayer = (poseName: string) => void;