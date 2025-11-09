'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { CloudProvider } from '@/lib/Data';
import { AWSIcon, GCPIcon, AzureIcon } from './ProviderIcons';
import SignalStrength from './SignalStrength';

export const ALL_PROVIDERS: CloudProvider[] = ['AWS', 'GCP', 'Azure'];

interface ControlPanelProps {
  filters: CloudProvider[];
  onFilterChange: (provider: CloudProvider) => void;
  latencyRange?: { min: number; max: number };
  onLatencyRangeChange?: (range: { min: number; max: number }) => void;
  showOrderFlow?: boolean;
  onOrderFlowToggle?: (show: boolean) => void;
}

const providerIcons = {
  AWS: AWSIcon,
  GCP: GCPIcon,
  Azure: AzureIcon,
};

const providerGradients = {
  AWS: 'from-orange-500 to-amber-600',
  GCP: 'from-blue-500 to-cyan-600',
  Azure: 'from-cyan-500 to-blue-600',
};

/**
 * CloudProviderToggle - Pill-style toggle button for cloud providers
 */
function CloudProviderToggle({
  provider,
  isActive,
  onClick,
}: {
  provider: CloudProvider;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = providerIcons[provider];
  const gradient = providerGradients[provider];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 ${
        isActive
          ? `bg-linear-to-r ${gradient} text-white shadow-lg ${
              provider === 'AWS' 
                ? 'shadow-orange-500/30' 
                : provider === 'GCP' 
                ? 'shadow-blue-500/30' 
                : 'shadow-cyan-500/30'
            }`
          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/60 border border-slate-600/50'
      }`}
    >
      <div className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="flex-1 text-sm font-semibold capitalize text-left">{provider}</span>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="w-2 h-2 rounded-full bg-white"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/**
 * LatencyControls - Enhanced latency range controls with gradient slider
 */
function LatencyControls({
  latencyRange,
  onLatencyRangeChange,
}: {
  latencyRange: { min: number; max: number };
  onLatencyRangeChange: (range: { min: number; max: number }) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="border-t border-slate-700/60 pt-6"
    >
      <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
        Latency Controls
        <span className="text-[10px] font-normal text-cyan-400">⚡</span>
      </h4>
      <p className="text-xs text-slate-400 mb-4">Adjust the latency range filter</p>

      <div className="space-y-4 p-4 rounded-xl bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
        {/* Animated Range Display */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
          <motion.span
            key={latencyRange.min}
            initial={{ scale: 1.1, color: '#60a5fa' }}
            animate={{ scale: 1, color: '#60a5fa' }}
            className="text-xs font-semibold text-sky-400"
          >
            Min: {latencyRange.min}ms
          </motion.span>
          <span className="text-xs text-slate-500">—</span>
          <motion.span
            key={latencyRange.max}
            initial={{ scale: 1.1, color: '#60a5fa' }}
            animate={{ scale: 1, color: '#60a5fa' }}
            className="text-xs font-semibold text-sky-400"
          >
            Max: {latencyRange.max}ms
          </motion.span>
        </div>

        {/* Gradient Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400 font-medium">Minimum (ms)</label>
              <motion.span
                key={latencyRange.min}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-xs font-semibold text-sky-400"
              >
                {latencyRange.min}
              </motion.span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              value={latencyRange.min}
              onChange={(e) => onLatencyRangeChange({ ...latencyRange, min: Number(e.target.value) })}
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(34 197 94) ${(latencyRange.min / 500) * 100}%, rgb(239 68 68) ${(latencyRange.min / 500) * 100}%, rgb(51 65 85) ${(latencyRange.min / 500) * 100}%, rgb(51 65 85) 100%)`,
              }}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400 font-medium">Maximum (ms)</label>
              <motion.span
                key={latencyRange.max}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-xs font-semibold text-sky-400"
              >
                {latencyRange.max}
              </motion.span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              value={latencyRange.max}
              onChange={(e) => onLatencyRangeChange({ ...latencyRange, max: Number(e.target.value) })}
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(239 68 68) ${(latencyRange.max / 500) * 100}%, rgb(239 68 68) ${(latencyRange.max / 500) * 100}%, rgb(51 65 85) ${(latencyRange.max / 500) * 100}%, rgb(51 65 85) 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * ControlPanel - Futuristic dashboard-style sidebar component
 * Features animated signal strength, pill-style provider toggles, and enhanced latency controls
 */
export default function ControlPanel({
  filters,
  onFilterChange,
  latencyRange = { min: 0, max: 500 },
  onLatencyRangeChange,
  showOrderFlow = false,
  onOrderFlowToggle,
}: ControlPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 p-6 shadow-[0_0_20px_rgba(0,255,255,0.1)] backdrop-blur-sm"
    >
      {/* Cloud Providers Section with Signal Strength */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Cloud Providers</h3>
            <SignalStrength />
          </div>
          <p className="text-xs text-slate-400 mb-4">Toggle providers to filter nodes</p>

          {/* Visualization Toggles */}
          <div className="flex items-center justify-between gap-2 mb-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">Order Flow</span>
              <span className="text-[10px] text-cyan-400">BETA</span>
            </div>
            <button
              onClick={() => onOrderFlowToggle?.(!showOrderFlow)}
              className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                showOrderFlow ? 'bg-sky-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ${
                  showOrderFlow ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
          {ALL_PROVIDERS.map((provider) => (
            <CloudProviderToggle
              key={provider}
              provider={provider}
              isActive={filters.includes(provider)}
              onClick={() => onFilterChange(provider)}
            />
          ))}
        </div>
      </div>

      {/* Latency Controls Section */}
      {onLatencyRangeChange && (
        <LatencyControls
          latencyRange={latencyRange}
          onLatencyRangeChange={onLatencyRangeChange}
        />
      )}
    </motion.div>
  );
}