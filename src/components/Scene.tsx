// src/components/Scene.tsx
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  exchanges as exchangeData, // Rename to avoid conflicts
  cloudRegions as regionData, // Rename to avoid conflicts
  generateLatencyData,
  latLonToVector3,
} from '@/lib/Data';
import type { LatencyData, CloudProvider } from '@/lib/Data';
import Marker from './Marker';
import LatencyLine from './LatencyLine';
import HeatmapOverlay from './HeatmapOverlay';
import Starfield from './Starfield';
import AtmosphereGlow from './AtmosphereGlow';
import SunLight from './SunLight';
import NetworkTopology from './NetworkTopology';
import OrderFlow from './OrderFlow';

// Use the globe radius from your data function's default
const GLOBE_RADIUS = 5;

// Camera controller component
function CameraController({ target }: { target?: [number, number, number] | null }) {
  const { camera } = useThree();
  const orbitControlsRef = useRef<any>(null);

  useEffect(() => {
    orbitControlsRef.current = (window as any).orbitControlsRef;
  }, []);

  useFrame(() => {
    if (target && orbitControlsRef.current) {
      const [x, y, z] = target;
      // Smoothly move camera towards target
      const targetPos = new THREE.Vector3(x, y, z);
      camera.position.lerp(targetPos, 0.05);
      // Look at the center of the globe
      orbitControlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      orbitControlsRef.current.update();
    }
  });

  return null;
}

export interface SceneProps {
  filters: CloudProvider[];
  onLinkClick: (link: LatencyData) => void;
  showHeatmap: boolean;
  showTopology: boolean;
  showOrderFlow: boolean;
  latencyData: LatencyData[];
  selectedLocation?: { id: string } | null;
  cameraTarget?: [number, number, number] | null;
  latencyRange?: { min: number; max: number };
}

export default function Scene({
  filters,
  onLinkClick,
  showHeatmap = false,
  showTopology = false,
  latencyData,
  selectedLocation,
  cameraTarget,
  latencyRange = { min: 0, max: 500 },
}: SceneProps) {
  const [orderFlowEnabled, setOrderFlowEnabled] = useState(true);
  // Load texture with error handling
  const mapTexture = useLoader(
    THREE.TextureLoader,
    '/textures/world-map.jpg',
    (loader) => {
      // Texture loading callback
    },
    (error) => {
      console.warn('Texture loading error, using fallback:', error);
    }
  );

  // Configure texture
  if (mapTexture) {
    mapTexture.wrapS = THREE.RepeatWrapping;
    mapTexture.wrapT = THREE.RepeatWrapping;
  }

  // Combine both data arrays
  const allLocations = useMemo(
    () => [...exchangeData, ...regionData],
    []
  );

  // Pre-calculate 3D positions using new structure
  const locationPositions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    allLocations.forEach((loc) => {
      const [lat, lon, elevation] = loc.position;
      const [x, y, z] = latLonToVector3(lat, lon, GLOBE_RADIUS);
      const vec = new THREE.Vector3(x, y, z).normalize();
      const pos = vec.multiplyScalar(GLOBE_RADIUS + elevation);
      map.set(loc.id, pos);
    });
    return map;
  }, [allLocations]);

  // Calculate topology lines
  const topologyLines = useMemo(() => {
    if (!showTopology) return [];
    
    const lines: { start: THREE.Vector3; end: THREE.Vector3; color: string }[] = [];
    const processed = new Set<string>();

    exchangeData.forEach((exchange1) => {
      exchangeData.forEach((exchange2) => {
        if (exchange1.id !== exchange2.id) {
          const key = [exchange1.id, exchange2.id].sort().join('-');
          if (!processed.has(key) && 
              filters.includes(exchange1.provider) && 
              filters.includes(exchange2.provider)) {
            const start = locationPositions.get(exchange1.id)!;
            const end = locationPositions.get(exchange2.id)!;
            lines.push({
              start,
              end,
              color: '#666666',
            });
            processed.add(key);
          }
        }
      });
    });

    return lines;
  }, [showTopology, filters, locationPositions]);

  return (
    <Canvas
      style={{ background: '#000000' }}
      camera={{ position: [0, 0, 12], fov: 60 }}
      gl={{ 
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      }}
    >
      {/* Starfield Background - Renders first (behind everything) */}
      <Starfield />

      {/* Dynamic Sun Lighting with day/night simulation */}
      <SunLight autoRotate={true} rotationSpeed={0.0003} />

      {/* Earth Globe with enhanced material for realism */}
      <Sphere args={[GLOBE_RADIUS, 128, 128]} renderOrder={0}>
        <meshStandardMaterial
          map={mapTexture}
          roughness={0.9}
          metalness={0.05}
          emissive={new THREE.Color(0x000000)}
          emissiveIntensity={0}
          color={new THREE.Color(0xffffff)}
        />
      </Sphere>

      {/* Atmosphere Glow - Renders after globe */}
      <AtmosphereGlow radius={GLOBE_RADIUS} />

      {/* Network Topology Visualization */}
      {showTopology && <NetworkTopology filters={filters} opacity={0.15} />}

      {/* Order Flow Visualization */}
      {orderFlowEnabled && <OrderFlow latencyData={latencyData} radius={GLOBE_RADIUS} />}

      {/* Filter markers based on filters prop - Render on top */}
      {allLocations
        .filter((loc) => {
          // Filter logic now works on providers for BOTH types
          if (!filters.includes(loc.provider)) {
            return false;
          }
          return true;
        })
        .map((loc) => (
          <Marker 
            key={loc.id} 
            data={loc} 
            radius={GLOBE_RADIUS}
            isSelected={selectedLocation?.id === loc.id}
          />
        ))}

      {/* Render latency lines - filtered by range - Render on top */}
      {latencyData
        .filter((link) => {
          // Filter by latency range
          return link.latency >= latencyRange.min && link.latency <= latencyRange.max;
        })
        .map((link) => {
          // Find the matching locations
          const fromExchange = exchangeData.find((e) => e.id === link.from);
          const toExchange = exchangeData.find((e) => e.id === link.to);

          // Get their pre-calculated positions
          const start = locationPositions.get(link.from);
          const end = locationPositions.get(link.to);

          // Don't render if link is filtered out
          if (
            !start ||
            !end ||
            !fromExchange ||
            !toExchange ||
            !filters.includes(fromExchange.provider) ||
            !filters.includes(toExchange.provider)
          ) {
            return null;
          }

          return (
            <LatencyLine
              key={`${link.from}-${link.to}`}
              start={start}
              end={end}
              latency={link.latency}
              onClick={() => onLinkClick(link)}
            />
          );
        })}

      {/* Render topology lines */}
      {showTopology &&
        topologyLines.map((line, index) => (
          <line key={`topology-${index}`}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                args={[new Float32Array([
                  line.start.x,
                  line.start.y,
                  line.start.z,
                  line.end.x,
                  line.end.y,
                  line.end.z,
                ]), 3]}
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  line.start.x,
                  line.start.y,
                  line.start.z,
                  line.end.x,
                  line.end.y,
                  line.end.z,
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color={line.color} transparent opacity={0.3} />
          </line>
        ))}

      {/* Heatmap overlay */}
      {showHeatmap && (
        <HeatmapOverlay
          latencyData={latencyData}
          radius={GLOBE_RADIUS}
          visible={showHeatmap}
        />
      )}

      <OrbitControls
        ref={(ref) => {
          if (ref) {
            // Store ref for camera controller
            (window as any).orbitControlsRef = ref;
          }
        }}
        enableZoom={true}
        enablePan={true}
        autoRotate={false}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={GLOBE_RADIUS + 1}
        maxDistance={GLOBE_RADIUS * 3}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
      />
      <CameraController target={cameraTarget} />
    </Canvas>
  );
}