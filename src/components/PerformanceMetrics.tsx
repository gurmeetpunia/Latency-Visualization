'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { LatencyData } from '@/lib/Data';

interface PerformanceMetricsProps {
  latencyData: LatencyData[];
}

interface MetricsData {
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  activeConnections: number;
  packetsPerSecond: number;
}

/**
 * PulsingDot - Animated pulsing indicator for live status
 */
function PulsingDot() {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="w-2 h-2 rounded-full bg-cyan-400"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-cyan-400"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

/**
 * CircularGauge - Mini circular progress indicator
 */
function CircularGauge({ percentage, id = 'main' }: { percentage: number; id?: string }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const gradientId = `gaugeGradient-${id}`;

  return (
    <div className="relative w-12 h-12">
      <svg className="transform -rotate-90 w-12 h-12">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="text-slate-700/50"
        />
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-slate-300">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

/**
 * StatCard - Enhanced metric card with neon accents
 */
function StatCard({ label, value, unit, color = 'neutral' }: {
  label: string;
  value: number | string;
  unit?: string;
  color?: 'neutral' | 'red' | 'blue';
}) {
  const colorClasses = {
    neutral: 'bg-slate-800/40 text-slate-200 border-slate-700/40',
    red: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`p-5 rounded-xl border ${colorClasses[color]} transition-all duration-200 shadow-sm flex flex-col gap-3 min-w-[120px]`}
    >
      <div className="text-xs font-medium text-slate-400 uppercase tracking-wider leading-none font-mono">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold metric-value">{value}</div>
        {unit && <div className="text-sm font-medium text-slate-400 font-mono">{unit}</div>}
      </div>
    </motion.div>
  );
}

/**
 * PerformanceMetrics - Redesigned metrics component
 * Groups latency metrics separately from throughput metrics
 * Color coding: neutral for avg/min, red for max, blue for packets/sec
 */
export default function PerformanceMetrics({ latencyData }: PerformanceMetricsProps) {
  const [metrics, setMetrics] = useState<MetricsData>({
    avgLatency: 0,
    minLatency: 0,
    maxLatency: 0,
    activeConnections: 0,
    packetsPerSecond: 0,
  });

  useEffect(() => {
    if (latencyData.length === 0) return;

    const latencies = latencyData.map((data) => data.latency);
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const minLatency = Math.min(...latencies);
    const maxLatency = Math.max(...latencies);

    // Simulate some additional metrics
    const activeConnections = latencyData.length;
    const packetsPerSecond = Math.floor(Math.random() * 1000 + 500); // Simulated value

    setMetrics({
      avgLatency,
      minLatency,
      maxLatency,
      activeConnections,
      packetsPerSecond,
    });
  }, [latencyData]);

  const progressPercentage = Math.min(100, (metrics.avgLatency / 200) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 p-6 shadow-[0_0_20px_rgba(0,255,255,0.1)] backdrop-blur-sm"
    >
      {/* Header with Pulsing Dot */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Live Status</h3>
            <PulsingDot />
          </div>
          <p className="text-xs text-slate-400">Live Network Overview</p>
        </div>
        <div className="text-xs text-slate-400">
          <span className="font-semibold text-slate-200">{metrics.activeConnections}</span> connections
        </div>
      </div>

      {/* Latency Metrics Group - Glassy Panel */}
      <div className="mb-6 p-4 rounded-xl bg-slate-800/60 backdrop-blur-sm shadow-inner border border-slate-700/40">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Latency Metrics</h4>
        <div className="flex flex-col gap-4">
          <StatCard label="AVERAGE" value={metrics.avgLatency.toFixed(1)} unit="ms" color="neutral" />
          <StatCard label="MIN" value={metrics.minLatency.toFixed(1)} unit="ms" color="neutral" />
          <StatCard label="MAX" value={metrics.maxLatency.toFixed(1)} unit="ms" color="red" />
        </div>
      </div>

      {/* Throughput Metrics Group */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Throughput</h4>
        <StatCard label="Packets/sec" value={metrics.packetsPerSecond.toLocaleString()} color="blue" />
      </div>

      {/* Average Latency Threshold with Circular Gauge */}
      <div className="space-y-3 pt-4 border-t border-slate-700/60">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Average Latency Threshold</span>
          <CircularGauge percentage={progressPercentage} id="latency-threshold" />
        </div>
        <div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-2 bg-linear-to-r from-emerald-400 to-emerald-500 rounded-full shadow-lg shadow-emerald-500/30"
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Based on 200ms threshold</span>
          <span className="font-semibold text-slate-300">{progressPercentage.toFixed(0)}%</span>
        </div>
      </div>
    </motion.div>
  );
}