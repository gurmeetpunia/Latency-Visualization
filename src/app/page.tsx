// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ControlPanel';
import HistoricalChart from '@/components/HistoricalChart';
import SearchPanel from '@/components/SearchPanel';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import ExportButton from '@/components/ExportButton';
import GlobeLegend from '@/components/GlobeLegend';
import type { CloudProvider, LatencyData, Exchange, CloudRegion } from '@/lib/Data';
import { ALL_PROVIDERS } from '@/components/ControlPanel';
import { generateLatencyData, latLonToVector3 } from '@/lib/Data';

const DynamicScene = dynamic(() => import('@/components/DynamicScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-sky-500" />
        <p className="text-sm text-slate-400">Loading 3D Scene...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [filters, setFilters] = useState<CloudProvider[]>([...ALL_PROVIDERS]);
  const [selectedLink, setSelectedLink] = useState<LatencyData | null>(null);
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [viewMode, setViewMode] = useState<'heatmap' | 'topology'>('topology');
  const [selectedLocation, setSelectedLocation] = useState<Exchange | CloudRegion | null>(null);
  const [latencyRange, setLatencyRange] = useState<{ min: number; max: number }>({ min: 0, max: 500 });
  const [cameraTarget, setCameraTarget] = useState<{ position: [number, number, number] | null }>({ position: null });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOrderFlow, setShowOrderFlow] = useState(true);

  // Update latency data periodically
  useEffect(() => {
    const updateLatency = () => {
      const newData = generateLatencyData();
      setLatencyData(newData);
    };

    updateLatency();
    const interval = setInterval(updateLatency, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (provider: CloudProvider) => {
    setFilters((prevFilters) =>
      prevFilters.includes(provider)
        ? prevFilters.filter((p) => p !== provider)
        : [...prevFilters, provider]
    );
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased">
      {/* Background overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08)_0%,rgba(0,0,0,0)_70%)]" />

      {/* Layout Container - Flexbox for responsive design */}
      <div className="flex h-full w-full">
        {/* Sidebar - Always visible on desktop */}
        <aside className="hidden lg:flex flex-col w-80 min-w-[320px] bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/60 shadow-2xl z-20 overflow-y-auto">
          <div className="flex flex-col gap-4 p-6">
            {/* Control Panel */}
            <ControlPanel 
              filters={filters} 
              onFilterChange={handleFilterChange}
              latencyRange={latencyRange}
              onLatencyRangeChange={setLatencyRange}
              showOrderFlow={showOrderFlow}
              onOrderFlowToggle={setShowOrderFlow}
            />

            {/* Performance Metrics */}
            <PerformanceMetrics latencyData={latencyData} />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Header - Fixed top */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-30 flex items-center justify-between gap-4 px-4 lg:px-8 py-4 border-b border-slate-800/60 bg-slate-900/95 backdrop-blur-xl"
          >
            {/* Left: Title */}
            <div className="flex items-center gap-4 min-w-0">
              {/* Menu button - only visible on mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="min-w-0">
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white truncate font-display">
                  LATENCY VISUALIZER
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block font-mono tracking-wide">
                  Real-time network performance across cloud providers
                </p>
              </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <SearchPanel
                onSelect={(item: Exchange | CloudRegion) => {
                  setSelectedLocation(item);
                  const [lat, lon] = item.position;
                  const [x, y, z] = latLonToVector3(lat, lon, 5);
                  const distance = 8;
                  const cameraX = x * 1.5;
                  const cameraY = y * 1.5;
                  const cameraZ = z * 1.5;
                  setCameraTarget({ position: [cameraX, cameraY, cameraZ] });
                  setTimeout(() => {
                    setCameraTarget({ position: null });
                    setSelectedLocation(null);
                  }, 3000);
                }}
              />
            </div>

            {/* Right: View Toggle + Export */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Segmented Control for View Mode */}
              <div className="hidden sm:flex items-center gap-1 rounded-lg bg-slate-800/60 p-1 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('heatmap')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'heatmap'
                      ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                      : 'bg-transparent text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  Heatmap
                </button>
                <button
                  onClick={() => setViewMode('topology')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'topology'
                      ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                      : 'bg-transparent text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  Topology
                </button>
              </div>
              <ExportButton latencyData={latencyData} />
            </div>
          </motion.header>

          {/* Mobile Search - Below header */}
          <div className="md:hidden px-4 py-3 border-b border-slate-800/60 bg-slate-900/95 backdrop-blur-xl z-20">
            <SearchPanel
              onSelect={(item: Exchange | CloudRegion) => {
                setSelectedLocation(item);
                const [lat, lon] = item.position;
                const [x, y, z] = latLonToVector3(lat, lon, 5);
                const distance = 8;
                const cameraX = x * 1.5;
                const cameraY = y * 1.5;
                const cameraZ = z * 1.5;
                setCameraTarget({ position: [cameraX, cameraY, cameraZ] });
                setTimeout(() => {
                  setCameraTarget({ position: null });
                  setSelectedLocation(null);
                }, 3000);
              }}
            />
          </div>

          {/* Mobile View Toggle */}
          <div className="md:hidden px-4 py-3 border-b border-slate-800/60 bg-slate-900/95 backdrop-blur-xl z-20">
            <div className="flex items-center gap-1 rounded-lg bg-slate-800/60 p-1">
              <button
                onClick={() => setViewMode('heatmap')}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  viewMode === 'heatmap'
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                    : 'bg-transparent text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                Heatmap
              </button>
              <button
                onClick={() => setViewMode('topology')}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  viewMode === 'topology'
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                    : 'bg-transparent text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                Topology
              </button>
            </div>
          </div>

          {/* 3D Globe Scene - Full viewport */}
          <div className="flex-1 relative z-0">
            <DynamicScene
              filters={filters}
              onLinkClick={(link) => setSelectedLink(link)}
              showHeatmap={viewMode === 'heatmap'}
              showTopology={viewMode === 'topology'}
              latencyData={latencyData}
              selectedLocation={selectedLocation}
              cameraTarget={cameraTarget.position}
              latencyRange={latencyRange}
            />
          </div>

          {/* Globe Legend - Bottom Right */}
          <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
            <GlobeLegend />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/60 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
                <h2 className="text-lg font-bold text-white">Filters & Metrics</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                  aria-label="Close sidebar"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col gap-4 p-6">
                <ControlPanel 
                  filters={filters} 
                  onFilterChange={handleFilterChange}
                  latencyRange={latencyRange}
                  onLatencyRangeChange={setLatencyRange}
                />
                <PerformanceMetrics latencyData={latencyData} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Historical chart */}
      {selectedLink && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="pointer-events-auto fixed inset-4 z-50"
        >
          <HistoricalChart
            link={selectedLink}
            onClose={() => setSelectedLink(null)}
          />
        </motion.div>
      )}
    </main>
  );
}