"use client";

import { useInView, useReducedMotion, type MotionValue } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";

// Three.js is ~150 kB gzipped: keep it out of the initial bundle and off the server.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

let webglCache: boolean | null = null;
function detectWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement("canvas");
    webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}
const noopSubscribe = () => () => {};

/** Static stand-in with the same silhouette: shown while loading and when WebGL is unavailable. */
function Fallback({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-1000 lg:justify-items-end lg:pr-[8%]",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="relative aspect-square w-[min(70vw,420px)]">
        <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(79_140_255/0.45),rgb(11_29_74/0.6)_45%,transparent_70%)] blur-sm" />
        <div className="absolute inset-[10%] rotate-[25deg] rounded-full border border-accent-2/30 [transform:rotateX(65deg)]" />
        <div className="absolute inset-0 rounded-full border border-accent-3/15" />
        <div className="absolute inset-[30%] animate-pulse-soft rounded-full bg-accent/10 blur-2xl" />
      </div>
    </div>
  );
}

export function HeroVisual({ scroll }: { scroll: MotionValue<number> }) {
  const container = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  const webgl = useSyncExternalStore(noopSubscribe, detectWebGL, () => false);
  const reducedMotion = useReducedMotion() ?? false;
  const coarse = useMediaQuery("(pointer: coarse)");
  const narrow = useMediaQuery("(max-width: 767px)");
  const lowPower = coarse || narrow;
  const inView = useInView(container, { margin: "0px 0px 0px 0px" });

  // Pointer tracking on window so the text layer above the canvas doesn't block it.
  useEffect(() => {
    if (coarse || reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [coarse, reducedMotion]);

  return (
    <div ref={container} className="absolute inset-0">
      <Fallback visible={!ready} />
      {webgl && (
        <div
          className={cn("absolute inset-0 transition-opacity duration-[1400ms]", ready ? "opacity-100" : "opacity-0")}
        >
          <HeroScene
            lowPower={lowPower}
            reducedMotion={reducedMotion}
            paused={!inView}
            scroll={scroll}
            pointer={pointer}
            onReady={() => setReady(true)}
          />
        </div>
      )}
    </div>
  );
}
