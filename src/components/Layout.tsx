'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl bg-gray-900/60 p-4 shadow-xl backdrop-blur-md',
        'border border-gray-700/50',
        'transition-all duration-200 ease-in-out',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 text-lg font-semibold text-gray-200">
      {children}
    </h2>
  );
}

export function Badge({ children, color = 'blue' }: { children: ReactNode; color?: string }) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
  }[color] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';

  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
      'border',
      colorClasses
    )}>
      {children}
    </span>
  );
}

export function MetricCard({ label, value, unit, trend }: {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold tracking-tight">
        {value}
        {unit && <span className="ml-1 text-sm text-gray-400">{unit}</span>}
      </p>
      {trend && (
        <p className={cn('text-sm', trendColors[trend])}>
          {trend === 'up' && '↑'}
          {trend === 'down' && '↓'}
          {trend === 'neutral' && '→'}
        </p>
      )}
    </div>
  );
}