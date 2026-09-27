"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useState, type RefObject } from "react";
import { NeuralCore, QUALITY } from "./NeuralCore";

export interface HeroSceneProps {
  lowPower: boolean;
  reducedMotion: boolean;
  /** Pause rendering entirely (e.g. hero scrolled off-screen). */
  paused: boolean;
  scroll: MotionValue<number>;
  pointer: RefObject<{ x: number; y: number }>;
  onReady?: () => void;
}

/** Canvas wrapper. Loaded client-side only via next/dynamic. */
export default function HeroScene({ lowPower, reducedMotion, paused, scroll, pointer, onReady }: HeroSceneProps) {
  const maxDpr = lowPower ? 1.25 : 1.75;
  const [dpr, setDpr] = useState(maxDpr);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 7.5], fov: 42, near: 0.1, far: 60 }}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: lowPower ? "low-power" : "high-performance" }}
      frameloop={paused ? "never" : reducedMotion ? "demand" : "always"}
      onCreated={() => onReady?.()}
      aria-hidden="true"
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(maxDpr, d + 0.25))}
      />
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 3, 5]} intensity={40} color="#4f8cff" />
      <pointLight position={[-5, -2, 3]} intensity={25} color="#8b7bff" />
      <pointLight position={[0, 0, 0]} intensity={6} color="#22d3ee" distance={4} />
      <NeuralCore
        quality={lowPower ? QUALITY.low : QUALITY.high}
        scroll={scroll}
        pointer={pointer}
        still={reducedMotion}
      />
    </Canvas>
  );
}
