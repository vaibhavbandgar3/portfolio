"use client";

import { useInView, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useMediaQuery } from "@/lib/hooks";

const DataSurfaceScene = dynamic(() => import("./DataSurfaceScene"), { ssr: false });

/**
 * Section backdrop: mounts the WebGL scene only once the section is near,
 * and pauses it whenever it scrolls away.
 */
export function DataSurface() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "600px 0px" });
  const visible = useInView(ref);
  const reducedMotion = useReducedMotion() ?? false;
  const lowPower = useMediaQuery("(max-width: 767px), (pointer: coarse)");

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_35%,#000_85%,transparent)]"
    >
      {near && <DataSurfaceScene lowPower={lowPower} paused={!visible} reducedMotion={reducedMotion} />}
    </div>
  );
}
