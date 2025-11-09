// src/components/LatencyLine.tsx
'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import { getLatencyColor } from '@/lib/Data'; // <-- IMPORT NEW FUNCTION

interface LatencyLineProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  latency: number;
  onClick: () => void;
}

export default function LatencyLine({
  start,
  end,
  latency,
  onClick,
}: LatencyLineProps) {
  const lineRef = useRef<any>(null);

  const midPoint = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(start.length() * 1.2);
    return mid;
  }, [start, end]);

  // Use the new color function
  const color = useMemo(() => getLatencyColor(latency), [latency]);

  useFrame(() => {
    if (lineRef.current) {
      const pulse = (Math.sin(Date.now() * 0.005) + 1) / 2;
      lineRef.current.material.opacity = 0.3 + pulse * 0.7;
    }
  });

  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [start, midPoint, end]);

  // Create a glow effect - use the same color but with lower opacity for the glow layer
  // The color from getLatencyColor is already a hex string or rgb string
  const glowColor = useMemo(() => {
    // If it's a hex color, return as is (QuadraticBezierLine handles hex)
    // If it's rgb/rgba, return as is
    return color;
  }, [color]);

  return (
    <group>
      {/* Glow layer - thicker, more transparent line for shadow/glow effect */}
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={midPoint}
        color={glowColor}
        lineWidth={3}
        transparent
        opacity={0.15}
      />
      {/* Main arc line */}
      <QuadraticBezierLine
        ref={lineRef}
        start={start}
        end={end}
        mid={midPoint}
        color={color}
        lineWidth={1.5}
        transparent
        opacity={0.6}
      />
      {/* Invisible clickable mesh for interaction */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <tubeGeometry args={[curve, 20, 0.01, 8, false]} />
        <meshBasicMaterial transparent opacity={0} wireframe />
      </mesh>
    </group>
  );
}