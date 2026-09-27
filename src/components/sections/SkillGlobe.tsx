"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { skillGroups } from "@/data";
import { cn } from "@/lib/utils";

interface SkillGlobeProps {
  /** Group whose skills are highlighted. */
  activeGroup?: string;
  className?: string;
}

/**
 * A sphere of skill labels rendered with CSS 3D (real text, no WebGL).
 * Auto-rotates, can be dragged / flicked, pauses off-screen, and renders
 * a still pose for reduced-motion users. Decorative: the same skills are
 * listed accessibly next to it.
 */
export function SkillGlobe({ activeGroup, className }: SkillGlobeProps) {
  const stage = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLSpanElement | null)[]>([]);
  const inView = useInView(stage, { margin: "100px" });
  const reduced = useReducedMotion();

  const skills = useMemo(() => {
    const flat = skillGroups.flatMap((g) => g.skills.map((name) => ({ name, group: g.id })));
    // Fibonacci sphere: an even spread for any number of labels.
    const golden = Math.PI * (3 - Math.sqrt(5));
    return flat.map((s, i) => {
      const y = 1 - (i / Math.max(flat.length - 1, 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      return { ...s, x: Math.cos(golden * i) * r, y, z: Math.sin(golden * i) * r };
    });
  }, []);

  // Rotation state lives in a ref: the loop writes styles directly, no React re-renders.
  const motion = useRef({ yaw: 0.4, pitch: -0.25, vYaw: 0.18, vPitch: 0, dragging: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const m = motion.current;

    const draw = () => {
      const radius = el.clientWidth * 0.4;
      const cy = Math.cos(m.yaw),
        sy = Math.sin(m.yaw);
      const cp = Math.cos(m.pitch),
        sp = Math.sin(m.pitch);
      skills.forEach((s, i) => {
        const node = items.current[i];
        if (!node) return;
        // Rotate around Y (yaw), then X (pitch).
        const x1 = s.x * cy + s.z * sy;
        const z1 = -s.x * sy + s.z * cy;
        const y2 = s.y * cp - z1 * sp;
        const z2 = s.y * sp + z1 * cp;
        const depth = (z2 + 1) / 2; // 0 = back, 1 = front
        node.style.transform = `translate(-50%, -50%) translate3d(${x1 * radius}px, ${y2 * radius}px, ${z2 * radius}px)`;
        node.style.opacity = String(0.15 + depth * 0.85);
        node.style.zIndex = String(Math.round(depth * 100));
        node.style.filter = depth < 0.35 ? `blur(${(0.35 - depth) * 4}px)` : "none";
      });
    };

    draw();
    if (reduced || !inView) return;

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!m.dragging) {
        // Ease back to a gentle idle spin after a flick.
        m.vYaw += (0.18 - m.vYaw) * dt * 1.5;
        m.vPitch += (0 - m.vPitch) * dt * 2;
        m.pitch += (-0.25 - m.pitch) * dt * 0.5;
      }
      m.yaw += m.vYaw * dt;
      m.pitch = Math.max(-1.2, Math.min(1.2, m.pitch + m.vPitch * dt));
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const down = (e: PointerEvent) => {
      m.dragging = true;
      m.lastX = e.clientX;
      m.lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!m.dragging) return;
      const dx = e.clientX - m.lastX;
      const dy = e.clientY - m.lastY;
      m.lastX = e.clientX;
      m.lastY = e.clientY;
      m.yaw += dx * 0.008;
      m.pitch -= dy * 0.008;
      m.vYaw = dx * 0.5;
      m.vPitch = -dy * 0.5;
    };
    const up = () => {
      m.dragging = false;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [skills, inView, reduced]);

  return (
    <div
      ref={stage}
      aria-hidden="true"
      className={cn(
        "relative aspect-square w-full cursor-grab touch-pan-y select-none [perspective:900px] active:cursor-grabbing",
        className,
      )}
    >
      {/* Orbit rings and core glow */}
      <div className="pointer-events-none absolute inset-[9%] rounded-full border border-line" />
      <div className="pointer-events-none absolute inset-[9%] rounded-full border border-accent-2/20 [transform:rotateX(72deg)]" />
      <div className="pointer-events-none absolute inset-[9%] rounded-full border border-accent-3/15 [transform:rotateY(72deg)]" />
      <div className="pointer-events-none absolute inset-[32%] rounded-full bg-[radial-gradient(closest-side,rgb(79_140_255/0.25),transparent)] blur-md" />

      <div className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]">
        {skills.map((s, i) => {
          const active = s.group === activeGroup;
          return (
            <span
              key={`${s.group}-${s.name}`}
              ref={(n) => {
                items.current[i] = n;
              }}
              className={cn(
                "absolute top-0 left-0 rounded-full border px-2.5 py-1 font-mono text-[11px] whitespace-nowrap transition-[color,background-color,border-color,box-shadow] duration-500 will-change-transform sm:text-xs",
                active
                  ? "border-accent-2/60 bg-accent-2/15 text-fg shadow-[0_0_18px_-2px_rgb(34_211_238/0.55)]"
                  : "border-line bg-ink-900/80 text-fg-muted",
              )}
            >
              {s.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
