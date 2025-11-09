'use client';

import { motion } from 'framer-motion';

/**
 * SignalStrength - Animated signal strength/ping indicator
 * Shows a pulsing waveform animation
 */
export default function SignalStrength() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="w-1 bg-cyan-400 rounded-full"
          initial={{ height: 4 }}
          animate={{
            height: [4, 8, 4],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.15,
            ease: 'easeInOut',
          }}
          style={{ height: 4 + index * 2 }}
        />
      ))}
    </div>
  );
}

