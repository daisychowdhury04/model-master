import React from 'react';
import * as THREE from 'three';

interface AnimationLoopProps {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

export const AnimationLoop = ({ scene, camera, renderer }: AnimationLoopProps) => {
  React.useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scene, camera, renderer]);

  return null;
}; 