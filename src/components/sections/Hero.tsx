"use client";

import { ArrowDown, ArrowRight, FileText } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { profile, socials } from "@/data";
import { ease } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { RotatingScramble } from "@/components/ui/ScrambleText";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { HeroVisual } from "@/components/three/HeroVisual";

/** Splits text into words that rise in one after another. */
function WordReveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease, delay: delay + i * 0.07 }}
          >
            {word}
            {i < text.split(" ").length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 lg:justify-center lg:pt-24"
    >
      {/* Backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-70" />
        <div className="absolute top-[-20%] right-[-10%] size-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgb(79_140_255/0.16),transparent)]" />
        <div className="absolute bottom-[-30%] left-[-20%] size-[60vmax] rounded-full bg-[radial-gradient(closest-side,rgb(139_123_255/0.1),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <Container className="relative z-10">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="max-w-2xl lg:max-w-[40rem]">
          <motion.p
            {...fadeIn(0.1)}
            className="glass mb-7 inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-3 text-xs text-fg-muted sm:text-sm"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            {profile.availability}
          </motion.p>

          <h1 className="text-[clamp(2.6rem,8vw,5.25rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
            <span className="sr-only">
              {profile.name} — {profile.headline}
            </span>
            <span aria-hidden="true">
              <WordReveal text={`Hi, I'm ${profile.shortName}.`} delay={0.15} className="block" />
              <WordReveal text={profile.headline} delay={0.4} className="text-gradient block" />
            </span>
          </h1>

          <motion.p {...fadeIn(0.75)} className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
            {profile.intro}
          </motion.p>

          <motion.p {...fadeIn(0.8)} className="mt-6 font-mono text-sm text-fg-muted sm:text-base">
            <span className="text-accent-2">~/{profile.shortName.toLowerCase()}</span>
            <span className="text-fg-subtle"> $ </span>
            <span className="text-fg-subtle">building </span>
            <RotatingScramble phrases={profile.building} />
          </motion.p>

          <motion.ul {...fadeIn(0.85)} aria-label="Focus areas" className="mt-5 flex flex-wrap gap-2">
            {profile.focusAreas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-line px-3 py-1 font-mono text-[11px] tracking-wide text-fg-muted uppercase"
              >
                {area}
              </li>
            ))}
          </motion.ul>

          <motion.div {...fadeIn(0.95)} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="#projects" magnetic icon={<ArrowRight className="size-4" aria-hidden="true" />}>
              View projects
            </ButtonLink>
            <ButtonLink href="#contact" variant="secondary" magnetic>
              Get in touch
            </ButtonLink>
            <ButtonLink
              href={profile.resumeUrl}
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
              icon={<FileText className="size-4" aria-hidden="true" />}
            >
              Resume
            </ButtonLink>
          </motion.div>

          <motion.ul {...fadeIn(1.05)} aria-label="Social profiles" className="mt-8 flex items-center gap-1">
            {socials.map((s) => (
              <li key={s.platform}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  {...(s.platform !== "email" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="grid size-11 place-items-center rounded-full text-fg-subtle transition-colors hover:bg-white/[0.06] hover:text-fg"
                >
                  <SocialIcon platform={s.platform} />
                </a>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </Container>

      {/* 3D stage: below the text on small screens, full-bleed behind it on large ones. */}
      <div className="relative -mt-4 h-[46svh] min-h-72 w-full lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
        <HeroVisual scroll={scrollYProgress} />
      </div>

      <motion.a
        href="#about"
        {...fadeIn(1.4)}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-fg-subtle uppercase transition-colors hover:text-fg lg:flex"
      >
        Scroll
        <ArrowDown className="size-4 animate-bounce motion-reduce:animate-none" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
