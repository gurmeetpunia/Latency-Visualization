'use client';

import { motion } from 'framer-motion';

/**
 * GlobeLegend - Fixed legend component for the bottom-right corner
 * Explains latency color ranges for the globe visualization
 */
export default function GlobeLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="pointer-events-auto rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800/60 shadow-2xl p-4 min-w-[200px]"
    >
      <h3 className="text-sm font-semibold text-white mb-3">Latency Ranges</h3>
      <ul className="space-y-2.5">
        <li className="flex items-center gap-3">
          <span className="inline-block h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"></span>
          <span className="text-xs text-slate-300">Green: 0-50 ms</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="inline-block h-3 w-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50"></span>
          <span className="text-xs text-slate-300">Yellow: 51-150 ms</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="inline-block h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></span>
          <span className="text-xs text-slate-300">Red: 151 ms+</span>
        </li>
      </ul>
    </motion.div>
  );
}

