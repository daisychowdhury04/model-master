import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { boneNames } from '../../boneName';

interface ModelLoaderProps {
  scene: THREE.Scene;
  onBonesLoaded: (bones: { [key: string]: THREE.Bone }, model: THREE.Group) => void;
  initialHeadRotation?: { x: number; y: number; z: number };
  initialLegRotation?: { x: number; y: number; z: number };
  initialArmRotation?: { x: number; y: number; z: number };
  showUpperBodyOnly?: boolean;
  modelPath?: string;
}

export const ModelLoader = ({
  scene,
  onBonesLoaded,
  initialHeadRotation = { x: 2, y: 0, z: 0 },
  initialLegRotation = { x: 30, y: 0, z: 0 },
  initialArmRotation = { x: 75, y: 0, z: 0 },
  showUpperBodyOnly = false,
  modelPath = '/human.glb'
}: ModelLoaderProps) => {
  // Keep callback in a ref so the load effect does not re-run when parent re-renders (e.g. train page adding a pose)
  const onBonesLoadedRef = useRef(onBonesLoaded);
  useEffect(() => {
    onBonesLoadedRef.current = onBonesLoaded;
  }, [onBonesLoaded]);

  // Define separate initial positions based on mode using useMemo
  const floatingPositions = useMemo(() => ({
    head: { x: -20, y: 0, z: 0 },
    arm: { x: 80, y: 0, z: 0 },
    leg: { x: 0, y: 0, z: 0 }
  }), []);

  React.useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      // Remove any previous model with the same name
      scene.children.forEach(child => {
        if (child.type === 'Group' && child.name === 'HumanModel') {
          scene.remove(child);
        }
      });

      const model = gltf.scene;
      model.name = 'HumanModel';
      
      // Set different scale for floating avatar
      if (showUpperBodyOnly) {
        model.scale.set(1.2, 1.2, 1.2); // Even smaller scale for floating view
      } else {
        model.scale.set(2, 2, 2); // Original scale
      }
      
      // Adjust the model position based on whether we're showing upper body only
      if (showUpperBodyOnly) {
        model.position.y = -0.5; // Position higher to see face better in small container
        // model.position.x = -0.2;
      } else {
        model.position.y = -1.8; // Original position showing full body
      }
      
      model.rotation.x = 0;
      model.rotation.z = 0;
      
      const bones: { [key: string]: THREE.Bone } = {};
      const boneMap = new Map<string, THREE.Bone>();

      // First pass: collect all bones
      model.traverse((object) => {
        if (object instanceof THREE.Bone) {
          bones[object.name] = object;
          boneMap.set(object.name, object);
          
          // Hide leg bones in floating mode
          if (showUpperBodyOnly) {
            if (
              object.name.includes('Leg') || 
              object.name.includes('Foot') || 
              object.name.includes('Toe') ||
              object.name.includes('Ankle') ||
              object.name.includes('Knee')
            ) {
              // Make the object invisible if possible
              if (object.visible !== undefined) {
                object.visible = false;
              }
            }
          }
        }

        // Also hide mesh parts for lower body in floating mode
        if (showUpperBodyOnly && object instanceof THREE.Mesh) {
          if (
            object.name.toLowerCase().includes('leg') ||
            object.name.toLowerCase().includes('foot') ||
            object.name.toLowerCase().includes('toe')
          ) {
            object.visible = false;
          }
        }
      });

      // Second pass: apply rotations with different values for floating vs main avatar
      model.traverse((object) => {
        if (object instanceof THREE.Bone) {
          // Apply head rotation - use separate values for floating mode
          if (object.name === boneNames.Head || object.name === boneNames.HeadTop) {
            const headRotation = showUpperBodyOnly ? floatingPositions.head : initialHeadRotation;
            object.rotation.x = THREE.MathUtils.degToRad(headRotation.x);
            object.rotation.y = THREE.MathUtils.degToRad(headRotation.y);
            object.rotation.z = THREE.MathUtils.degToRad(headRotation.z);
          }
          
          // Apply leg rotations - use separate values for floating mode (if not hidden)
          if (object.name === boneNames.RightLeg || object.name === boneNames.LeftLeg) {
            const legRotation = showUpperBodyOnly ? floatingPositions.leg : initialLegRotation;
            object.rotation.x = THREE.MathUtils.degToRad(legRotation.x);
            object.rotation.y = THREE.MathUtils.degToRad(legRotation.y);
            object.rotation.z = THREE.MathUtils.degToRad(legRotation.z);
          }

          // Apply arm rotations - use separate values for floating mode
          if (object.name === boneNames.RightArm || object.name === boneNames.LeftArm) {
            const armRotation = showUpperBodyOnly ? floatingPositions.arm : initialArmRotation;
            object.rotation.x = THREE.MathUtils.degToRad(armRotation.x);
            object.rotation.y = THREE.MathUtils.degToRad(armRotation.y);
            object.rotation.z = THREE.MathUtils.degToRad(armRotation.z);
          }

          // Update matrix
          object.updateMatrix();
          object.updateMatrixWorld(true);
        }
      });

      // Update all bone matrices
      model.updateMatrix();
      model.updateMatrixWorld(true);
      
      onBonesLoadedRef.current(bones, model);
      scene.add(model);
    });
  }, [scene, initialHeadRotation, initialLegRotation, initialArmRotation, showUpperBodyOnly, floatingPositions, modelPath]);

  return null;
}; 