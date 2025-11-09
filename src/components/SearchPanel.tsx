'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { exchanges, cloudRegions } from '@/lib/Data';
import type { Exchange, CloudRegion } from '@/lib/Data';
import { SearchIcon } from './Icons';

interface SearchPanelProps {
  onSelect: (item: Exchange | CloudRegion) => void;
}

export default function SearchPanel({ onSelect }: SearchPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<(Exchange | CloudRegion)[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    const searchResults = [...exchanges, ...cloudRegions].filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.type === 'region' && item.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setResults(searchResults);
  }, [searchTerm]);

  return (
    <div className="relative w-full lg:w-80">
      <div className="relative">
        <input
          type="text"
          aria-label="Search regions or nodes"
          placeholder="Search Regions or Nodes"
          className="w-full rounded-lg bg-slate-800/80 border border-slate-700/60 px-4 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-400 outline-none transition-all duration-200 focus:bg-slate-800 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <AnimatePresence>
        {results.length > 0 && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full max-h-64 overflow-y-auto rounded-lg bg-slate-800/95 border border-slate-700/60 shadow-xl backdrop-blur-md z-50"
          >
            {results.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-b-0"
                onClick={() => {
                  onSelect(item);
                  setSearchTerm('');
                  setIsFocused(false);
                }}
              >
                <div className="font-semibold text-white text-sm">{item.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {item.type === 'exchange' ? 'Exchange' : 'Region'} • {item.provider}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}