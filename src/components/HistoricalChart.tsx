// src/components/HistoricalChart.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { LatencyData } from '@/lib/Data';

type TimeRange = '1h' | '24h' | '7d' | '30d';

interface HistoricalDataPoint {
  name: string;
  latency: number;
  timestamp: number;
}

function generateHistoricalData(baseLatency: number, timeRange: TimeRange): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const now = Date.now();
  let points = 30;
  let interval = 60 * 1000; // 1 minute in milliseconds

  switch (timeRange) {
    case '1h':
      points = 60;
      interval = 60 * 1000; // 1 minute
      break;
    case '24h':
      points = 144;
      interval = 10 * 60 * 1000; // 10 minutes
      break;
    case '7d':
      points = 168;
      interval = 60 * 60 * 1000; // 1 hour
      break;
    case '30d':
      points = 180;
      interval = 4 * 60 * 60 * 1000; // 4 hours
      break;
  }

  for (let i = points; i >= 0; i--) {
    const timestamp = now - i * interval;
    const jitter = (Math.random() - 0.5) * 20;
    data.push({
      name: new Date(timestamp).toLocaleString(),
      latency: parseFloat((baseLatency + jitter).toFixed(2)),
      timestamp,
    });
  }

  return data;
}

interface HistoricalChartProps {
  link: LatencyData;
  onClose: () => void;
}

export default function HistoricalChart({
  link,
  onClose,
}: HistoricalChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>([]);
  const [stats, setStats] = useState({
    min: 0,
    max: 0,
    avg: 0,
  });

  useEffect(() => {
    const data = generateHistoricalData(link.latency, timeRange);
    setChartData(data);

    const latencies = data.map(d => d.latency);
    setStats({
      min: Math.min(...latencies),
      max: Math.max(...latencies),
      avg: latencies.reduce((a, b) => a + b, 0) / latencies.length,
    });
  }, [link.latency, timeRange]);

  return (
    <div className="absolute bottom-6 right-6 z-10 w-full max-w-2xl rounded-2xl bg-slate-800/95 border border-slate-700/60 p-6 text-white shadow-2xl backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            Historical Latency
          </h3>
          <p className="text-xs text-slate-400">{link.from} → {link.to}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-900/60 p-1 border border-slate-700/60">
            {(['1h', '24h', '7d', '30d'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  timeRange === range
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-700/50 border border-slate-600/50 px-3 py-1.5 text-sm text-slate-300 transition-all duration-200 hover:bg-slate-700 hover:text-white"
            aria-label="Close chart"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="mb-5 grid grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-700/40">
          <div className="text-xs text-slate-400 mb-1">Current</div>
          <div className="font-bold text-emerald-400">{link.latency.toFixed(2)} ms</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-700/40">
          <div className="text-xs text-slate-400 mb-1">Min</div>
          <div className="font-bold text-sky-400">{stats.min.toFixed(2)} ms</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-700/40">
          <div className="text-xs text-slate-400 mb-1">Max</div>
          <div className="font-bold text-rose-400">{stats.max.toFixed(2)} ms</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-700/40">
          <div className="text-xs text-slate-400 mb-1">Average</div>
          <div className="font-bold text-yellow-400">{stats.avg.toFixed(2)} ms</div>
        </div>
      </div>
      <div style={{ width: '100%', height: 300 }} className="rounded-lg bg-slate-900/30 p-3">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tick={{ fill: '#94a3b8' }}
              unit="ms"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
              labelStyle={{ color: '#cbd5e1' }}
            />
            <Legend wrapperStyle={{ color: '#cbd5e1', fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="latency"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}