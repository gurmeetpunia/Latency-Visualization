// src/components/DynamicScene.tsx
'use client';

import dynamic from 'next/dynamic';
import type { CloudProvider, LatencyData } from '@/lib/Data';

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#111',
        color: 'white',
      }}
    >
      <p>Loading 3D Scene...</p>
    </div>
  ),
});

interface DynamicSceneProps {
  filters: CloudProvider[];
  onLinkClick: (link: LatencyData) => void;
  showHeatmap: boolean;
  showTopology: boolean;
  latencyData: LatencyData[];
  selectedLocation?: { id: string } | null;
  cameraTarget?: [number, number, number] | null;
  latencyRange?: { min: number; max: number };
}

export default function DynamicScene({
  filters,
  onLinkClick,
  showHeatmap,
  showTopology,
  latencyData,
  selectedLocation,
  cameraTarget,
  latencyRange,
}: DynamicSceneProps) {
  return (
    <Scene
      filters={filters}
      onLinkClick={onLinkClick}
      showHeatmap={showHeatmap}
      showTopology={showTopology}
      latencyData={latencyData}
      selectedLocation={selectedLocation}
      cameraTarget={cameraTarget}
      latencyRange={latencyRange}
    />
  );
}