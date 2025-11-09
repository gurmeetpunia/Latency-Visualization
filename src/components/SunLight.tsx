'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SunLightProps {
  autoRotate?: boolean;
  rotationSpeed?: number;
}

/**
 * SunLight - Dynamic sun lighting with optional rotation
 * Creates realistic day/night shading on the Earth
 */
export default function SunLight({ 
  autoRotate = true, 
  rotationSpeed = 0.0005 
}: SunLightProps) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useFrame(() => {
    if (autoRotate && lightRef.current) {
      // Rotate sun around the globe
      const time = Date.now() * rotationSpeed;
      const radius = 20;
      lightRef.current.position.x = Math.cos(time) * radius;
      lightRef.current.position.y = Math.sin(time * 0.5) * radius;
      lightRef.current.position.z = Math.sin(time) * radius;
      
      // Always point at the center
      if (targetRef.current) {
        lightRef.current.target.position.set(0, 0, 0);
        lightRef.current.target.updateMatrixWorld();
      }
    }
  });

  return (
    <>
      {/* Main sun light - bright and warm */}
      <directionalLight
        ref={lightRef}
        position={[15, 10, 5]}
        intensity={1.5}
        color={0xffffff}
        castShadow={false}
      />
      {/* Target for light to point at */}
      <object3D ref={targetRef} position={[0, 0, 0]} />
      
      {/* Fill light for shadow side - prevents complete darkness */}
      <directionalLight
        position={[-5, -5, -5]}
        intensity={0.2}
        color={0x4a90e2}
      />
      
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} color={0xffffff} />
    </>
  );
}

