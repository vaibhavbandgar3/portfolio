"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "01<>/{}[]=+*#$%&_ABCDEFabcdef";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** ms per character to settle. */
  speed?: number;
  /** Start only once the element scrolls into view. */
  onView?: boolean;
}

/**
 * "Decrypts" text from random glyphs into the real string.
 * The real text is always exposed to assistive tech; only the visual layer scrambles.
 */
export function ScrambleText({ text, className, speed = 28, onView = true }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (reduced || (onView && !inView)) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const settled = Math.floor((now - start) / speed);
      let next = "";
      for (let i = 0; i < text.length; i++) {
        if (i < settled || text[i] === " ") next += text[i];
        else next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOutput(next);
      if (settled < text.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, speed, inView, onView, reduced]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{output}</span>
    </span>
  );
}

/** Cycles through phrases, decoding each one, with a blinking terminal cursor. */
export function RotatingScramble({ phrases, interval = 2600 }: { phrases: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || phrases.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), interval);
    return () => clearInterval(id);
  }, [phrases.length, interval, reduced]);

  return (
    <span aria-live="off">
      <ScrambleText key={index} text={phrases[index]} onView={false} speed={35} />
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-accent-2/80"
      />
    </span>
  );
}
