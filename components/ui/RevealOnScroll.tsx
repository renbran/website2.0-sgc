"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  focusPull?: boolean;
}

export default function RevealOnScroll({ children, className = "", delay = 0, focusPull = false }: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={focusPull
        ? { opacity: 0, y: shouldReduceMotion ? 0 : 36, scale: shouldReduceMotion ? 1 : 0.97, filter: shouldReduceMotion ? "none" : "blur(8px)" }
        : { opacity: 0, y: shouldReduceMotion ? 0 : 36, scale: shouldReduceMotion ? 1 : 0.97 }
      }
      whileInView={focusPull
        ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
        : { opacity: 1, y: 0, scale: 1 }
      }
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
