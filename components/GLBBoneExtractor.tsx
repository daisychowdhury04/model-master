'use client';

import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface BoneInfo {
  name: string;
  index: number;
  parent?: string;
  id: string; // Unique identifier
}

export default function GLBBoneExtractor() {
  const [bones, setBones] = useState<BoneInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractBonesFromGLB = async (file: File) => {
    setLoading(true);
    setError('');
    setBones([]);

    try {
      const loader = new GLTFLoader();
      const arrayBuffer = await file.arrayBuffer();

      return new Promise<BoneInfo[]>((resolve, reject) => {
        loader.parse(
          arrayBuffer,
          '',
          (gltf) => {
            try {
              const boneMap = new Map<string, BoneInfo>();

              // Helper function to add bone if not already present
              const addBone = (bone: THREE.Bone | THREE.Object3D, globalIndex: number) => {
                const boneKey = bone.uuid || bone.name || `bone_${globalIndex}`;
                if (!boneMap.has(boneKey)) {
                  boneMap.set(boneKey, {
                    name: bone.name || `Bone_${globalIndex}`,
                    index: globalIndex,
                    parent: bone.parent?.name,
                    id: boneKey
                  });
                }
              };

              // Traverse all scenes and objects to find skeletons
              gltf.scene.traverse((object) => {
                if (object.type === 'SkinnedMesh' && (object as THREE.SkinnedMesh).skeleton) {
                  const skeleton = (object as THREE.SkinnedMesh).skeleton;
                  const bones = skeleton.bones;

                  bones.forEach((bone, index) => {
                    addBone(bone, index);
                  });
                }

                // Also check if the object itself is a bone
                if (object.type === 'Bone') {
                  const bone = object as THREE.Bone;
                  addBone(bone, boneMap.size);
                }
              });

              // If no bones found in skinned meshes, check for any bones in the hierarchy
              if (boneMap.size === 0) {
                const collectBones = (object: THREE.Object3D, collected: BoneInfo[]) => {
                  if (object.type === 'Bone') {
                    const boneKey = object.uuid || object.name || `fallback_${collected.length}`;
                    collected.push({
                      name: object.name || `Bone_${collected.length}`,
                      index: collected.length,
                      parent: object.parent?.name,
                      id: boneKey
                    });
                  }
                  object.children.forEach(child => collectBones(child, collected));
                };

                const allBones: BoneInfo[] = [];
                collectBones(gltf.scene, allBones);
                resolve(allBones);
              } else {
                resolve(Array.from(boneMap.values()));
              }
            } catch (parseError) {
              reject(parseError);
            }
          },
          (error) => {
            reject(error);
          }
        );
      });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb')) {
      setError('Please select a GLB file');
      return;
    }

    setFileName(file.name);

    try {
      const extractedBones = await extractBonesFromGLB(file);
      setBones(extractedBones);
      setError('');
    } catch (err) {
      console.error('Error extracting bones:', err);
      setError('Failed to extract bones from GLB file. Make sure it\'s a valid GLB file.');
      setBones([]);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file && file.name.toLowerCase().endsWith('.glb')) {
      setFileName(file.name);
      try {
        const extractedBones = await extractBonesFromGLB(file);
        setBones(extractedBones);
        setError('');
      } catch (err) {
        console.error('Error extracting bones:', err);
        setError('Failed to extract bones from GLB file. Make sure it\'s a valid GLB file.');
        setBones([]);
      }
    } else {
      setError('Please drop a GLB file');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const reset = () => {
    setBones([]);
    setError('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        GLB Bone Name Extractor
      </h2>

      {/* File Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 mb-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Select GLB file"
        />
        <div className="text-gray-600 dark:text-gray-400">
          {fileName ? (
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                Selected: {fileName}
              </p>
              <p className="text-sm">Click to select a different file or drag & drop</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">Drop your GLB file here</p>
              <p className="text-sm">or click to browse</p>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Extracting bones...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Reset Button */}
      {(bones.length > 0 || error) && (
        <div className="text-center mb-6">
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Reset
          </button>
        </div>
      )}

      {/* Bones List */}
      {bones.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Extracted Bones ({bones.length})
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="grid gap-2">
              {bones.map((bone) => (
                <div
                  key={bone.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {bone.name}
                    </span>
                    {bone.parent && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        (parent: {bone.parent})
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Index: {bone.index}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Copy to Clipboard */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                const boneNames = bones.map(bone => bone.name).join('\n');
                navigator.clipboard.writeText(boneNames);
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Copy Bone Names to Clipboard
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!bones.length && !loading && !error && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">Upload a GLB file to extract bone names from 3D models with skeletons.</p>
          <p className="text-sm">Supports GLB files with skinned meshes and bone hierarchies.</p>
        </div>
      )}
    </div>
  );
}
