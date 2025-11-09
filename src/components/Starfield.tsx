'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Starfield - Creates a realistic starfield background
 * Uses an inverted sphere with procedurally generated stars
 * Includes parallax effect for immersive rotation
 */
export default function Starfield() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  // Create starfield texture procedurally
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Fill with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Generate random stars
    const numStars = 5000;
    ctx.fillStyle = '#ffffff';
    
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 1.5 + 0.5;
      const brightness = Math.random();
      
      // Create star with varying brightness
      ctx.globalAlpha = brightness;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add some brighter stars with glow
      if (brightness > 0.7) {
        ctx.globalAlpha = brightness * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Parallax effect - starfield rotates slower than camera
  useFrame(() => {
    if (meshRef.current) {
      // Rotate starfield at 10% of camera rotation speed for parallax
      const rotationSpeed = 0.0001;
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={-1}>
      {/* Large sphere for starfield background - rendered from inside */}
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial
        map={starTexture}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

