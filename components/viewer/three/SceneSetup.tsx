import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/components/theme/provider';

interface SceneSetupProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onSceneReady: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => void;
}

export const SceneSetup = ({ canvasRef, onSceneReady }: SceneSetupProps) => {
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!sceneRef.current) {
      sceneRef.current = new THREE.Scene();
      cameraRef.current = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      rendererRef.current = new THREE.WebGLRenderer({ canvas, antialias: true });
      
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;

      camera.position.z = 3;

      // Set initial background color based on theme - much darker for dark theme
      const bgColor = resolvedTheme === 'dark' ? 0x0a0a0a : 0xffffff;
      renderer.setClearColor(bgColor);
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);

      // Theme-aware lighting setup
      const isDark = resolvedTheme === 'dark';

      // Adjust lighting based on theme - brighter for dark background
      const lightColor = isDark ? 0xffffff : 0xffffff; // White lights for both themes
      const hemiIntensity = isDark ? 2.0 : 1.2;
      const mainIntensity = isDark ? 2.5 : 1.5;
      const ambientIntensity = isDark ? 1.5 : 0.8;

      const hemiLight = new THREE.HemisphereLight(lightColor, 0x444444, hemiIntensity);
      hemiLight.position.set(0, 20, 0);
      scene.add(hemiLight);

      // Main directional light from the front
      const mainLight = new THREE.DirectionalLight(lightColor, mainIntensity);
      mainLight.position.set(0, 10, 5);
      mainLight.castShadow = true;
      scene.add(mainLight);

      // Fill light from the side
      const fillLight = new THREE.DirectionalLight(lightColor, 0.8);
      fillLight.position.set(5, 5, 3);
      scene.add(fillLight);

      // Back light for rim lighting
      const rimLight = new THREE.DirectionalLight(lightColor, 0.6);
      rimLight.position.set(0, 8, -5);
      scene.add(rimLight);

      // Ambient light adjusted for theme
      const ambientLight = new THREE.AmbientLight(lightColor, ambientIntensity);
      scene.add(ambientLight);

      // Additional front fill light
      const frontFillLight = new THREE.DirectionalLight(lightColor, 0.7);
      frontFillLight.position.set(-3, 3, 4);
      scene.add(frontFillLight);

      onSceneReady(scene, camera, renderer);
    }

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;

      const camera = cameraRef.current;
      const renderer = rendererRef.current;

      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, onSceneReady, resolvedTheme]);

  // Update background and lighting when theme changes
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current) return;

    const renderer = rendererRef.current;
    const scene = sceneRef.current;

    // Update background color - much darker for dark theme
    const bgColor = resolvedTheme === 'dark' ? 0x0a0a0a : 0xffffff;
    renderer.setClearColor(bgColor);

    // Update lighting intensities based on theme - brighter for dark background
    const isDark = resolvedTheme === 'dark';
    const newAmbientIntensity = isDark ? 1.5 : 0.8;
    const newMainIntensity = isDark ? 2.5 : 1.5;
    const newHemiIntensity = isDark ? 2.0 : 1.2;

    // Update existing lights
    scene.children.forEach((child) => {
      if (child instanceof THREE.AmbientLight) {
        child.intensity = newAmbientIntensity;
      }
      if (child instanceof THREE.DirectionalLight && child.position.z > 0) {
        // Main front light
        child.intensity = newMainIntensity;
      }
      if (child instanceof THREE.HemisphereLight) {
        child.intensity = newHemiIntensity;
      }
    });
  }, [resolvedTheme]);

  return null;
}; 