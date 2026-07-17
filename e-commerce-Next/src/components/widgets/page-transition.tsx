"use client";

import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function LocaleTransition({ children }: { children: ReactNode }) {
  const locale = useLocale();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={locale}
        initial={{ opacity: 0, rotateX: 6, scale: 0.96 }}
        animate={{ opacity: 1, rotateX: 0, scale: 1 }}
        exit={{ opacity: 0, rotateX: -6, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
