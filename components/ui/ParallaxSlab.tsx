"use client";

import { motion, useTransform, useSpring, MotionValue } from "motion/react";
import { ReactNode } from "react";

interface ParallaxSlabProps {
  children: ReactNode;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  depth: number; // 1 = bottom (least shift), 3 = top (most shift)
  className?: string;
}

export default function ParallaxSlab({
  children,
  mouseX,
  mouseY,
  depth,
  className,
}: ParallaxSlabProps) {
  const shiftX = useSpring(
    useTransform(mouseX, [0, 1], [-depth * 4, depth * 4]),
    { stiffness: 150, damping: 20 }
  );
  const shiftY = useSpring(
    useTransform(mouseY, [0, 1], [-depth * 2, depth * 2]),
    { stiffness: 150, damping: 20 }
  );

  return (
    <motion.div style={{ x: shiftX, y: shiftY }} className={className}>
      {children}
    </motion.div>
  );
}
