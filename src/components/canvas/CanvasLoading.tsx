import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function CanvasLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center space-y-4"
      >
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
        <p className="text-gray-600">Loading canvas...</p>
      </motion.div>
    </div>
  );
}
