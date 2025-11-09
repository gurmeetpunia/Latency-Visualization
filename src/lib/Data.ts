// src/lib/data.ts

// 1. ADDED this type export for our UI
export type CloudProvider = 'AWS' | 'GCP' | 'Azure';

export interface Exchange {
  type: 'exchange'; // 2. ADDED this for filter logic
  id: string;
  name: string;
  position: [number, number, number]; // [lat, lon, elevation]
  provider: 'AWS' | 'GCP' | 'Azure';
  region: string;
  color: string;
}

export interface CloudRegion {
  type: 'region'; // 2. ADDED this for filter logic
  id: string;
  name: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  position: [number, number, number];
  code: string;
  serverCount: number;
}

export interface LatencyData {
  from: string;
  to: string;
  latency: number;
  timestamp: number;
  position?: [number, number]; // [lat, lon]
}

export const exchanges: Exchange[] = [
  {
    type: 'exchange', // 2. ADDED
    id: 'binance-tokyo',
    name: 'Binance',
    position: [35.6762, 139.6503, 0.1],
    provider: 'AWS',
    region: 'ap-northeast-1',
    color: '#F3BA2F',
  },
  {
    type: 'exchange', // 2. ADDED
    id: 'okx-singapore',
    name: 'OKX',
    position: [1.3521, 103.8198, 0.1],
    provider: 'AWS',
    region: 'ap-southeast-1',
    color: '#00D092',
  },
  {
    type: 'exchange', // 2. ADDED
    id: 'deribit-amsterdam',
    name: 'Deribit',
    position: [52.3676, 4.9041, 0.1],
    provider: 'GCP',
    region: 'europe-west4',
    color: '#2962FF',
  },
  {
    type: 'exchange', // 2. ADDED
    id: 'bybit-hongkong',
    name: 'Bybit',
    position: [22.3193, 114.1694, 0.1],
    provider: 'Azure',
    region: 'eastasia',
    color: '#F7A600',
  },
  {
    type: 'exchange', // 2. ADDED
    id: 'coinbase-us-east',
    name: 'Coinbase',
    position: [37.7749, -122.4194, 0.1],
    provider: 'AWS',
    region: 'us-west-1',
    color: '#0052FF',
  },
  {
    type: 'exchange', // 2. ADDED
    id: 'kraken-us-west',
    name: 'Kraken',
    position: [47.6062, -122.3321, 0.1],
    provider: 'GCP',
    region: 'us-west1',
    color: '#5741D9',
  },
  {
    type: 'exchange', // 2. ADDED
    id: 'bitfinex-london',
    name: 'Bitfinex',
    position: [51.5074, -0.1278, 0.1],
    provider: 'Azure',
    region: 'uksouth',
    color: '#16B157',
  },
  {
    type: 'exchange', // 2. ADDED
    id: 'huobi-seoul',
    name: 'Huobi',
    position: [37.5665, 126.9780, 0.1],
    provider: 'AWS',
    region: 'ap-northeast-2',
    color: '#2BA8E0',
  },
];

export const cloudRegions: CloudRegion[] = [
  {
    type: 'region', // 2. ADDED
    id: 'aws-tokyo',
    name: 'AWS Tokyo',
    provider: 'AWS',
    position: [35.6762, 139.6503, 0.05],
    code: 'ap-northeast-1',
    serverCount: 15,
  },
  {
    type: 'region', // 2. ADDED
    id: 'aws-singapore',
    name: 'AWS Singapore',
    provider: 'AWS',
    position: [1.3521, 103.8198, 0.05],
    code: 'ap-southeast-1',
    serverCount: 12,
  },
  {
    type: 'region', // 2. ADDED
    id: 'gcp-amsterdam',
    name: 'GCP Amsterdam',
    provider: 'GCP',
    position: [52.3676, 4.9041, 0.05],
    code: 'europe-west4',
    serverCount: 10,
  },
  {
    type: 'region', // 2. ADDED
    id: 'azure-hongkong',
    name: 'Azure Hong Kong',
    provider: 'Azure',
    position: [22.3193, 114.1694, 0.05],
    code: 'eastasia',
    serverCount: 8,
  },
  {
    type: 'region', // 2. ADDED
    id: 'aws-us-west',
    name: 'AWS US West',
    provider: 'AWS',
    position: [37.7749, -122.4194, 0.05],
    code: 'us-west-1',
    serverCount: 20,
  },
  {
    type: 'region', // 2. ADDED
    id: 'gcp-us-west',
    name: 'GCP US West',
    provider: 'GCP',
    position: [45.5231, -122.6765, 0.05],
    code: 'us-west1',
    serverCount: 18,
  },
  {
    type: 'region', // 2. ADDED
    id: 'azure-uk-south',
    name: 'Azure UK South',
    provider: 'Azure',
    position: [51.5074, -0.1278, 0.05],
    code: 'uksouth',
    serverCount: 14,
  },
];

// Helper function to convert lat/lon to 3D coordinates
export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number = 5
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}

// Generate mock latency data
export function generateLatencyData(): LatencyData[] {
  const data: LatencyData[] = [];

  for (let i = 0; i < exchanges.length; i++) {
    for (let j = i + 1; j < exchanges.length; j++) {
      data.push({
        from: exchanges[i].id,
        to: exchanges[j].id,
        latency: Math.random() * 200 + 10, // 10-210ms
        timestamp: Date.now(),
      });
    }
  }

  return data;
}

// Get latency color based on value
export function getLatencyColor(latency: number): string {
  if (latency < 50) return '#00ff88'; // Green - Low
  if (latency < 100) return '#ffff00'; // Yellow - Medium
  if (latency < 150) return '#ff9900'; // Orange - High
  return '#ff0000'; // Red - Very High
}

export const providerColors = {
  AWS: '#FF9900',
  GCP: '#4285F4',
  Azure: '#0089D6',
};