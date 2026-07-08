"use client";

// Section: Imports
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

interface StatCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function StatCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  duration = 1800
}: StatCounterProps) {
  const shouldReduceMotion = useReducedMotion();
  const targetRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const node = targetRef.current;

    if (!node || hasAnimatedRef.current) {
      return;
    }

    const runAnimation = () => {
      if (hasAnimatedRef.current) {
        return;
      }

      hasAnimatedRef.current = true;

      if (shouldReduceMotion) {
        setDisplayValue(value);
        return;
      }

      const startTime = performance.now();

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        setDisplayValue(value * eased);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: [0.5] }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [duration, shouldReduceMotion, value]);

  const formattedValue = displayValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return (
    <span ref={targetRef} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
