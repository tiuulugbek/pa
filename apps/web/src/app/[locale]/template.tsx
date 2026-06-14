'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/** Subtle fade/slide transition applied on every route change. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
