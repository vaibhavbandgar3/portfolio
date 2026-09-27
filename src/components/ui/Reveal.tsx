"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

interface BaseProps {
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
}

/** Fades + lifts its children in the first time they scroll into view. */
export function Reveal({ delay = 0, ...rest }: BaseProps & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{ delay }}
      {...rest}
    />
  );
}

const groupTags = { div: motion.div, ul: motion.ul, ol: motion.ol };

/** Staggers direct `RevealItem` children as the group enters view. */
export function RevealGroup({
  as = "div",
  gap = 0.08,
  ...rest
}: BaseProps & { as?: keyof typeof groupTags; gap?: number }) {
  const Component = groupTags[as];
  return <Component initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger(gap)} {...rest} />;
}

const itemTags = { div: motion.div, li: motion.li };

export function RevealItem({ as = "div", ...rest }: BaseProps & { as?: keyof typeof itemTags }) {
  const Component = itemTags[as];
  return <Component variants={fadeUp} {...rest} />;
}
