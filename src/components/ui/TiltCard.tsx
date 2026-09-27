"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { useFinePointer } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  max?: number;
}

/**
 * Card with a subtle perspective tilt and a pointer-following light.
 * Tilt is disabled on touch devices; motion is disabled for reduced-motion
 * users by the global MotionConfig.
 */
export function TiltCard({ children, className, max = 6 }: TiltCardProps) {
  const fine = useFinePointer();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const lx = useTransform(px, (v) => `${v * 100}%`);
  const ly = useTransform(py, (v) => `${v * 100}%`);
  const light = useMotionTemplate`radial-gradient(420px circle at ${lx} ${ly}, rgb(79 140 255 / 0.12), transparent 60%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!fine) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="h-full [perspective:1200px]">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={fine ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className={cn(
          "group relative h-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-850/80 transition-colors duration-500 hover:border-line-strong",
          className,
        )}
      >
        {fine && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: light }}
          />
        )}
        {children}
      </motion.div>
    </div>
  );
}
