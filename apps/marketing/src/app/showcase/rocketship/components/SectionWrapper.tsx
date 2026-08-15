'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isActive: boolean;
  sectionKey: string;
}

export default function SectionWrapper({ title, subtitle, children, isActive, sectionKey }: SectionWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={sectionKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full"
        >
          {/* Section intro */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
