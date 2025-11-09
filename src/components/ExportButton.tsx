'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { LatencyData } from '@/lib/Data';

interface ExportButtonProps {
  latencyData: LatencyData[];
}

export default function ExportButton({ latencyData }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = () => {
    setIsExporting(true);

    try {
      // Format the data for export
      const formattedData = latencyData.map((data) => ({
        from: data.from,
        to: data.to,
        latency: data.latency.toFixed(2),
        timestamp: new Date(data.timestamp).toISOString(),
      }));

      // Create CSV content
      const csvContent = [
        ['From', 'To', 'Latency (ms)', 'Timestamp'].join(','),
        ...formattedData.map((row) =>
          [row.from, row.to, row.latency, row.timestamp].join(',')
        ),
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `latency-data-${new Date().toISOString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={exportData}
      disabled={isExporting}
      className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-sky-500/20 transition-all duration-200 hover:bg-sky-500 hover:shadow-sky-500/30 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
    >
      {isExporting ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Exporting...
        </span>
      ) : (
        'Export CSV'
      )}
    </motion.button>
  );
}