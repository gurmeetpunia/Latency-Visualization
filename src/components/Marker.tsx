// src/components/Marker.tsx
'use client';

import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { latLonToVector3, providerColors } from '@/lib/Data'; // <-- IMPORT NEW HELPERS
import type { Exchange, CloudRegion } from '@/lib/Data';

interface MarkerProps {
  data: Exchange | CloudRegion;
  radius: number;
  isSelected?: boolean;
}

export default function Marker({ data, radius, isSelected = false }: MarkerProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Use the new data structure
  // data.position[0] = lat
  // data.position[1] = lon
  // data.position[2] = elevation
  const [position] = useState(() => {
    const [lat, lon, elevation] = data.position;
    const [x, y, z] = latLonToVector3(lat, lon, radius);
    // Apply elevation by extending the vector from the center
    const vec = new THREE.Vector3(x, y, z).normalize();
    return vec.multiplyScalar(radius + elevation);
  });

  const markerRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (isHovered || isSelected) {
      const scale = isSelected ? 2.5 : 1 + Math.sin(Date.now() * 0.005) * 0.2;
      markerRef.current.scale.set(scale, scale, scale);
    } else {
      markerRef.current.scale.set(1, 1, 1);
    }
  });

  // Use the new 'type' property
  const isCloudRegion = data.type === 'region';
  const dataColor =
    data.type === 'exchange' ? data.color : providerColors[data.provider];

  return (
    <group position={position}>
      <Sphere
        ref={markerRef}
        args={isCloudRegion ? [0.01, 32, 32] : [0.015, 32, 32]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
        }}
        onPointerOut={() => setIsHovered(false)}
        onClick={() => console.log(`Clicked on: ${data.name}`)}
      >
        <meshStandardMaterial
          color={isSelected ? '#00ff88' : dataColor}
          emissive={isSelected ? '#00ff88' : dataColor}
          emissiveIntensity={isSelected ? 2.5 : isHovered ? 1.5 : 0.5}
          transparent={isCloudRegion && !isSelected}
          opacity={isSelected ? 1.0 : isCloudRegion ? 0.8 : 1.0}
        />
      </Sphere>

      {(isHovered || isSelected) && (
        <Html distanceFactor={5}>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              width: 'max-content',
            }}
          >
            {/* Display new data fields */}
            <strong>{data.name}</strong>
            <br />
            Provider: {data.provider}
            {data.type === 'exchange' ? (
              <>
                <br />
                Region: {data.region}
              </>
            ) : (
              <>
                <br />
                Code: {data.code}
                <br />
                Servers: {data.serverCount}
              </>
            )}
            <br />
            ({data.position[0].toFixed(2)}, {data.position[1].toFixed(2)})
          </div>
        </Html>
      )}
    </group>
  );
}