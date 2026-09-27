"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { ComponentProps, PointerEvent, ReactNode } from "react";
import { useFinePointer } from "@/lib/hooks";
import { cn, isExternal } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-ink-950 hover:bg-white shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_8px_30px_-8px_rgb(79_140_255/0.6)]",
  secondary: "glass text-fg hover:border-line-strong hover:bg-white/[0.06]",
  ghost: "text-fg-muted hover:text-fg",
};

type ButtonLinkProps = Omit<ComponentProps<"a">, "children"> & {
  href: string;
  variant?: Variant;
  icon?: ReactNode;
  /** Pulls toward the pointer on hover. Only active on fine pointers. */
  magnetic?: boolean;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  icon,
  magnetic = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const external = isExternal(href);
  const classes = cn(
    "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-colors duration-300",
    variants[variant],
    className,
  );

  const content = (
    <>
      {children}
      {icon && (
        <span className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5">{icon}</span>
      )}
    </>
  );

  const linkProps = {
    href,
    className: classes,
    ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
    ...rest,
  };

  if (magnetic) return <Magnetic>{<a {...linkProps}>{content}</a>}</Magnetic>;
  return <a {...linkProps}>{content}</a>;
}

/** Wraps a child so it drifts a few pixels toward the pointer. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!fine) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span className="inline-flex" style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}
