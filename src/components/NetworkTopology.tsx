'use client';

import { useMemo } from 'react';
import { Line, QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import type { CloudProvider, Exchange } from '@/lib/Data';
import { exchanges, cloudRegions } from '@/lib/Data';

interface NetworkTopologyProps {
  filters: CloudProvider[];
  opacity?: number;
}

export default function NetworkTopology({ filters, opacity = 0.4 }: NetworkTopologyProps) {
  const topology = useMemo(() => {
    const connections: Array<{
      start: THREE.Vector3;
      end: THREE.Vector3;
      type: 'exchange-exchange' | 'exchange-region';
      provider: CloudProvider;
    }> = [];
    
    // Connect exchanges to their respective regions
    exchanges.forEach(exchange => {
      if (!filters.includes(exchange.provider)) return;

      const region = cloudRegions.find(r => r.code === exchange.region && r.provider === exchange.provider);
      if (region) {
        const [lat1, lon1] = exchange.position;
        const [lat2, lon2] = region.position;
        
        // Convert to 3D coordinates
        const start = new THREE.Vector3(
          5 * Math.cos(lat1 * Math.PI / 180) * Math.cos(lon1 * Math.PI / 180),
          5 * Math.sin(lat1 * Math.PI / 180),
          5 * Math.cos(lat1 * Math.PI / 180) * Math.sin(lon1 * Math.PI / 180)
        );
        
        const end = new THREE.Vector3(
          5 * Math.cos(lat2 * Math.PI / 180) * Math.cos(lon2 * Math.PI / 180),
          5 * Math.sin(lat2 * Math.PI / 180),
          5 * Math.cos(lat2 * Math.PI / 180) * Math.sin(lon2 * Math.PI / 180)
        );

        connections.push({
          start,
          end,
          type: 'exchange-region',
          provider: exchange.provider
        });
      }
    });

    // Connect regions within the same provider
    cloudRegions.forEach((region1, i) => {
      if (!filters.includes(region1.provider)) return;

      cloudRegions.slice(i + 1).forEach(region2 => {
        if (region1.provider === region2.provider) {
          const [lat1, lon1] = region1.position;
          const [lat2, lon2] = region2.position;

          const start = new THREE.Vector3(
            5 * Math.cos(lat1 * Math.PI / 180) * Math.cos(lon1 * Math.PI / 180),
            5 * Math.sin(lat1 * Math.PI / 180),
            5 * Math.cos(lat1 * Math.PI / 180) * Math.sin(lon1 * Math.PI / 180)
          );
          
          const end = new THREE.Vector3(
            5 * Math.cos(lat2 * Math.PI / 180) * Math.cos(lon2 * Math.PI / 180),
            5 * Math.sin(lat2 * Math.PI / 180),
            5 * Math.cos(lat2 * Math.PI / 180) * Math.sin(lon2 * Math.PI / 180)
          );

          connections.push({
            start,
            end,
            type: 'exchange-exchange',
            provider: region1.provider
          });
        }
      });
    });

    return connections;
  }, [filters]);

  const providerColors = {
    AWS: '#ff9900',
    GCP: '#4285f4',
    Azure: '#0078d4'
  };

  return (
    <group>
      {topology.map((connection, index) => {
        const mid = new THREE.Vector3().addVectors(connection.start, connection.end).multiplyScalar(0.5);
        mid.normalize().multiplyScalar(connection.start.length() * 1.2);

        return (
          <group key={index}>
            {/* Main connection line */}
            <QuadraticBezierLine
              start={connection.start}
              end={connection.end}
              mid={mid}
              color={providerColors[connection.provider]}
              lineWidth={1}
              transparent
              opacity={opacity}
              dashed={connection.type === 'exchange-exchange'}
              dashSize={connection.type === 'exchange-exchange' ? 0.1 : 0}
              gapSize={connection.type === 'exchange-exchange' ? 0.1 : 0}
            />
            
            {/* Glow effect */}
            <QuadraticBezierLine
              start={connection.start}
              end={connection.end}
              mid={mid}
              color={providerColors[connection.provider]}
              lineWidth={3}
              transparent
              opacity={opacity * 0.3}
            />
          </group>
        );
      })}
    </group>
  );
}