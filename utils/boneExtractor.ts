import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Path to your GLB model in the public directory
const MODEL_PATH = '/model.glb';

export interface BoneInfo {
  name: string;
  children: string[];
  parent: string | null;
}

export interface ModelBoneStructure {
  bones: BoneInfo[];
  hierarchy: Record<string, string[]>;
}

let currentBoneStructure: ModelBoneStructure | null = null;

/**
 * Extracts bone information from a GLB/GLTF model
 * @returns Promise containing the bone structure information
 */
export const extractBoneStructure = (): Promise<ModelBoneStructure> => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    const bones: BoneInfo[] = [];
    const hierarchy: Record<string, string[]> = {};

    loader.load(
      MODEL_PATH,
      (gltf) => {
        // Try to find bones in different ways
        const skeleton = findSkeleton(gltf.scene);
        const bonesFromScene = findBonesInScene(gltf.scene);
        
        if (!skeleton && bonesFromScene.length === 0) {
          reject(new Error('No bones found in the model'));
          return;
        }

        // Use bones from skeleton if available, otherwise use bones found in scene
        const boneObjects = skeleton ? skeleton.bones : bonesFromScene;

        // Process each bone
        boneObjects.forEach((bone) => {
          const boneInfo: BoneInfo = {
            name: bone.name,
            children: bone.children.map(child => child.name),
            parent: bone.parent ? bone.parent.name : null
          };
          bones.push(boneInfo);

          // Build hierarchy
          if (bone.parent && bone.parent.type === 'Bone') {
            if (!hierarchy[bone.parent.name]) {
              hierarchy[bone.parent.name] = [];
            }
            hierarchy[bone.parent.name].push(bone.name);
          }
        });

        currentBoneStructure = {
          bones,
          hierarchy
        };

        resolve(currentBoneStructure);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Recursively finds bones in the scene
 */
const findBonesInScene = (object: THREE.Object3D): THREE.Bone[] => {
  const bones: THREE.Bone[] = [];
  
  object.traverse((child) => {
    if (child.type === 'Bone') {
      console.log('Found bone:', child.name);
      bones.push(child as THREE.Bone);
    }
  });

  return bones;
};

/**
 * Recursively finds the first SkinnedMesh in the scene
 */
const findSkeleton = (object: THREE.Object3D): THREE.Skeleton | null => {
  // Check if current object is a SkinnedMesh
  if ((object as THREE.SkinnedMesh).isSkinnedMesh) {
    return (object as THREE.SkinnedMesh).skeleton;
  }

  // Check if current object has a skeleton
  if ((object as THREE.Object3D & { skeleton?: THREE.Skeleton }).skeleton) {
    return (object as THREE.Object3D & { skeleton: THREE.Skeleton }).skeleton;
  }

  // Recursively check children
  for (const child of object.children) {
    const result = findSkeleton(child);
    if (result) return result;
  }

  return null;
};

export const getCurrentBoneStructure = (): ModelBoneStructure | null => {
  return currentBoneStructure;
}; 