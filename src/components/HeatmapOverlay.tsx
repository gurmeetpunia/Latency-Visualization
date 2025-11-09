'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import type { LatencyData } from '@/lib/Data';
import { latLonToVector3 } from '@/lib/utils';

interface HeatmapOverlayProps {
  latencyData: LatencyData[];
  radius: number;
  visible: boolean;
}

export default function HeatmapOverlay({ latencyData, radius, visible }: HeatmapOverlayProps) {
  const heatmapTexture = useMemo(() => {
    const size = 512; // Reduced resolution for better performance
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Clear canvas
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, size, size);

    // Use Uint8Array for better memory efficiency
    const intensityMap = new Uint8Array(size * size);
    
    // Draw heatmap based on latency data
    latencyData.forEach((data) => {
      // Convert lat/lon to UV coordinates
      const u = ((data.position?.[1] ?? 0) + 180) / 360;
      const v = ((data.position?.[0] ?? 0) + 90) / 180;
      
      const x = Math.floor(u * size);
      const y = Math.floor(v * size);
      
      // Optimized intensity calculation
      const radius = size / 8; // Smaller radius for better performance
      const radiusSquared = radius * radius;
      const radiusInt = Math.ceil(radius);
      const baseIntensity = Math.min(data.latency / 150, 1) * 255; // Scale to 0-255 range
      
      // Use integer bounds for faster iteration
      const xMin = Math.max(0, x - radiusInt);
      const xMax = Math.min(size - 1, x + radiusInt);
      const yMin = Math.max(0, y - radiusInt);
      const yMax = Math.min(size - 1, y + radiusInt);

      for (let py = yMin; py <= yMax; py++) {
        const dy = py - y;
        const dySquared = dy * dy;
        
        for (let px = xMin; px <= xMax; px++) {
          const dx = px - x;
          const distSquared = dx * dx + dySquared;
          
          if (distSquared <= radiusSquared) {
            const dist = Math.sqrt(distSquared);
            // Ensure minimum intensity and smoother falloff
            const falloff = Math.pow(1 - dist / radius, 1.5);
            const minIntensity = 0.2 * baseIntensity; // Ensure minimum intensity
            const intensity = Math.round(minIntensity + (falloff * baseIntensity * 0.8));
            const index = py * size + px;
            intensityMap[index] = Math.max(intensityMap[index], intensity);
          }
        }
      }
    });

    // Pre-calculate color lookup table for better performance
    const colorLookup = new Uint8Array(256 * 4);
    for (let i = 0; i < 256; i++) {
      const normalizedIntensity = i / 255;
      // Use more red-focused color range
      const hue = (1 - normalizedIntensity) * 30 / 360; // 30° for orange-red to 0° for deep red
      const saturation = 0.9; // Higher saturation for more vivid colors
      const lightness = 0.4 + (0.2 * (1 - normalizedIntensity)); // Brighter for lower intensities
      const [r, g, b] = hslToRgb(hue, saturation, lightness);
      const i4 = i * 4;
      colorLookup[i4] = r;
      colorLookup[i4 + 1] = g;
      colorLookup[i4 + 2] = b;
      colorLookup[i4 + 3] = Math.min(255, 50 + (i * 1.5)); // Higher base opacity
    }

    // Apply colors using lookup table
    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < intensityMap.length; i++) {
      const intensity = intensityMap[i];
      if (intensity > 0) {
        const i4 = i * 4;
        const c4 = intensity * 4;
        imageData.data[i4] = colorLookup[c4];
        imageData.data[i4 + 1] = colorLookup[c4 + 1];
        imageData.data[i4 + 2] = colorLookup[c4 + 2];
        imageData.data[i4 + 3] = colorLookup[c4 + 3];
      }
        }
        
        ctx.putImageData(imageData, 0, 0);
    
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
  }, [latencyData]);

  // Helper function to convert HSL to RGB
  function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  return visible ? (
    <Sphere args={[radius * 1.001, 64, 64]}>
      <meshBasicMaterial
        map={heatmapTexture}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </Sphere>
  ) : null;
}