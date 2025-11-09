'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AtmosphereGlowProps {
  radius: number;
}

/**
 * AtmosphereGlow - Creates a subtle atmospheric glow around the Earth
 * Uses a custom shader to create a light-blue rim effect
 */
export default function AtmosphereGlow({ radius }: AtmosphereGlowProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Custom shader for atmosphere glow
  const atmosphereMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.4 }, // Glow intensity
        p: { value: 2.0 }, // Glow power
        glowColor: { value: new THREE.Color(0x87ceeb) }, // Light sky blue
        viewVector: { value: new THREE.Vector3(0, 0, 0) },
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(c - dot(vNormal, vNormel), p);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, intensity * 0.5);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    return material;
  }, []);

  // Update view vector for shader
  useFrame(({ camera }) => {
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      const viewVector = new THREE.Vector3();
      camera.getWorldDirection(viewVector);
      material.uniforms.viewVector.value = viewVector;
    }
  });

  return (
    <mesh ref={meshRef} scale={[1.02, 1.02, 1.02]} renderOrder={1}>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}

