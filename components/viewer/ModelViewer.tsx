import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { SceneSetup } from './three/SceneSetup';
import { ModelLoader } from './three/ModelLoader';
import { AnimationLoop } from './three/AnimationLoop';
import { cn } from '@/lib/utils';

// Export the ModelViewer component interface for reuse
export interface ModelViewerProps {
  onBonesLoaded: (bones: { [key: string]: THREE.Bone }, model: THREE.Group) => void;
  initialHeadRotation?: { x: number; y: number; z: number };
  initialLegRotation?: { x: number; y: number; z: number };
  initialArmRotation?: { x: number; y: number; z: number };
  floating?: boolean;
  initialPosition?: { x: number; y: number };
  modelPath?: string;
}

export const ModelViewer = ({
  onBonesLoaded,
  initialHeadRotation,
  initialLegRotation,
  initialArmRotation,
  floating = false,
  initialPosition = { x: 20, y: 20 },
  modelPath = '/human.glb'
}: ModelViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleSceneReady = (
    newScene: THREE.Scene,
    newCamera: THREE.PerspectiveCamera,
    newRenderer: THREE.WebGLRenderer
  ) => {
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    
    // Adjust camera position to focus on upper body when in floating mode
    if (floating && newCamera) {
      newCamera.position.y = 1.2; // Higher camera position to focus on face 
      newCamera.position.z = 2.0; // Closer to the avatar
      newCamera.fov = 40; // Narrower field of view for better framing
      newCamera.lookAt(0, 1.0, 0); // Look higher up toward the face
      newCamera.updateProjectionMatrix(); // Update after changing FOV
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!floating || !containerRef.current) return;
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    if (floating) {
      // Using a function that closes over the current state instead of
      // depending on the function reference
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging || !floating) return;
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      };
      
      const onMouseUp = () => {
        setIsDragging(false);
      };
      
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
    }
  }, [floating, isDragging, dragOffset]);

  useEffect(() => {
    // Adjust camera when floating state changes
    if (camera && floating) {
      camera.position.y = 1.2;
      camera.position.z = 2.0;
      camera.fov = 40;
      camera.lookAt(0, 1.0, 0);
      camera.updateProjectionMatrix();
    }
  }, [floating, camera]);

  // Update position via CSS variables whenever position changes
  useEffect(() => {
    if (containerRef.current && floating) {
      containerRef.current.style.setProperty('--float-x', `${position.x}px`);
      containerRef.current.style.setProperty('--float-y', `${position.y}px`);
    }
  }, [position, floating]);

  return (
    <div 
      ref={containerRef} 
      onMouseDown={handleMouseDown}
      className={cn(
        floating ? "floating-container" : "flex-1 relative",
        isDragging && floating && "grabbing"
      )}
    >
      {floating && (
        <div className="floating-grabber" />
      )}
      <canvas ref={canvasRef} className="w-full h-full" />
      <SceneSetup canvasRef={canvasRef} onSceneReady={handleSceneReady} />
      {scene && camera && renderer && (
        <>
          <ModelLoader
            scene={scene}
            onBonesLoaded={onBonesLoaded}
            initialHeadRotation={initialHeadRotation}
            initialLegRotation={initialLegRotation}
            initialArmRotation={initialArmRotation}
            showUpperBodyOnly={floating}
            modelPath={modelPath}
          />
          <AnimationLoop scene={scene} camera={camera} renderer={renderer} />
        </>
      )}
    </div>
  );
};