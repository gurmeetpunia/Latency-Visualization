'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { LatencyData } from '@/lib/Data';

interface OrderFlowProps {
  latencyData: LatencyData[];
  radius: number;
  visible?: boolean;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
}

export default function OrderFlow({ latencyData, radius, visible = true }: OrderFlowProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleSystemRef = useRef<{
    particles: Particle[];
    geometry: THREE.BufferGeometry;
    positions: Float32Array;
    colors: Float32Array;
    sizes: Float32Array;
  }>(null);

  // Initialize particle system
  useMemo(() => {
    const maxParticles = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    particleSystemRef.current = {
      particles: [],
      geometry,
      positions,
      colors,
      sizes,
    };
  }, []);

  // Update particle system each frame
  useFrame((_, delta) => {
    if (!visible || !particleSystemRef.current) return;

    const system = particleSystemRef.current;
    
    // Add new particles based on latency data
    latencyData.forEach((data) => {
      if (Math.random() > 0.1) return; // Only create particles for some data points

      const start = new THREE.Vector3(
        radius * Math.cos(data.position?.[0] || 0),
        radius * Math.sin(data.position?.[0] || 0),
        0
      );

      const end = new THREE.Vector3(
        radius * Math.cos(data.position?.[1] || 0),
        radius * Math.sin(data.position?.[1] || 0),
        0
      );

      // Create particle
      if (system.particles.length < 1000) {
        const latencyColor = new THREE.Color();
        if (data.latency < 50) {
          latencyColor.setHSL(0.3, 1, 0.5); // Green
        } else if (data.latency < 100) {
          latencyColor.setHSL(0.1, 1, 0.5); // Yellow
        } else {
          latencyColor.setHSL(0, 1, 0.5); // Red
        }

        system.particles.push({
          position: start.clone(),
          velocity: end.sub(start).normalize().multiplyScalar(2),
          life: 1.0,
          maxLife: 1.0,
          size: 2.0 + Math.random() * 2.0,
          color: latencyColor
        });
      }
    });

    // Update existing particles
    let particleCount = 0;
    system.particles = system.particles.filter((particle) => {
      particle.life -= delta;
      if (particle.life <= 0) return false;

      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      
      // Update buffers
      const i3 = particleCount * 3;
      system.positions[i3] = particle.position.x;
      system.positions[i3 + 1] = particle.position.y;
      system.positions[i3 + 2] = particle.position.z;
      
      system.colors[i3] = particle.color.r;
      system.colors[i3 + 1] = particle.color.g;
      system.colors[i3 + 2] = particle.color.b;
      
      system.sizes[particleCount] = particle.size * (particle.life / particle.maxLife);
      
      particleCount++;
      return true;
    });

    // Update geometry
    const positionAttribute = system.geometry.attributes.position;
    (positionAttribute.array as Float32Array).set(system.positions);
    positionAttribute.needsUpdate = true;
    
    const colorAttribute = system.geometry.attributes.color;
    (colorAttribute.array as Float32Array).set(system.colors);
    colorAttribute.needsUpdate = true;
    
    const sizeAttribute = system.geometry.attributes.size;
    (sizeAttribute.array as Float32Array).set(system.sizes);
    sizeAttribute.needsUpdate = true;
    
    system.geometry.setDrawRange(0, particleCount);
  });

  if (!visible) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry {...particleSystemRef.current?.geometry} />
      <pointsMaterial
        size={1}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}