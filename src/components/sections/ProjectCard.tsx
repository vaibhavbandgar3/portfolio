"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import type { Project } from "@/data";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Tag } from "@/components/ui/Tag";
import { TiltCard } from "@/components/ui/TiltCard";

const coverHues = [
  ["#4f8cff", "#22d3ee"],
  ["#8b7bff", "#4f8cff"],
  ["#22d3ee", "#8b7bff"],
] as const;

/** Procedural cover used when a project has no screenshot. */
function GeneratedCover({ project, index }: { project: Project; index: number }) {
  const [a, b] = coverHues[index % coverHues.length];
  const initials = project.title
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="absolute inset-0 bg-ink-900">
      <div
        className="absolute inset-0 opacity-70 transition-transform duration-[1200ms] ease-out-expo group-hover:scale-110"
        style={{
          background: `radial-gradient(60% 80% at 20% 10%, ${a}40, transparent 60%), radial-gradient(50% 70% at 90% 90%, ${b}33, transparent 60%)`,
        }}
      />
      <div className="bg-grid absolute inset-0 opacity-60" />
      <svg
        className="absolute inset-0 size-full opacity-40 transition-transform duration-[1200ms] ease-out-expo group-hover:rotate-6"
        viewBox="0 0 400 250"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g fill="none" stroke={a} strokeWidth="0.8">
          <circle cx="300" cy="125" r="70" />
          <circle cx="300" cy="125" r="100" strokeOpacity="0.5" />
          <circle cx="300" cy="125" r="130" strokeOpacity="0.25" />
        </g>
      </svg>
      <span className="absolute bottom-5 left-6 font-mono text-5xl font-semibold tracking-tighter text-white/15 sm:text-6xl">
        {initials}
      </span>
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm text-fg transition-colors hover:border-line-strong hover:bg-white/[0.05]"
        >
          <SocialIcon platform="github" className="size-4" />
          Code
          <span className="sr-only">for {project.title} on GitHub</span>
        </a>
      )}
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex min-h-10 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-ink-950 transition-colors hover:bg-white"
        >
          Live demo
          <ArrowUpRight className="size-4" aria-hidden="true" />
          <span className="sr-only">of {project.title}</span>
        </a>
      )}
    </div>
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const featured = project.featured;

  return (
    <TiltCard max={featured ? 4 : 6} className={cn(featured && "ring-gradient")}>
      <article className="flex h-full flex-col">
        <div
          className={cn("relative overflow-hidden border-b border-line", featured ? "aspect-[16/8]" : "aspect-[16/9]")}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-105"
            />
          ) : (
            <GeneratedCover project={project} index={index} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Tag className="bg-ink-950/60 backdrop-blur-md">{project.type}</Tag>
            <Tag className="bg-ink-950/60 backdrop-blur-md">{project.year}</Tag>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{project.title}</h3>
          <p className="mt-2 text-fg-muted">{project.tagline}</p>

          <dl className={cn("mt-6 grid gap-5 text-sm leading-relaxed", featured && "sm:grid-cols-2")}>
            <div>
              <dt className="mb-1.5 font-mono text-[11px] tracking-widest text-accent-2 uppercase">Problem</dt>
              <dd className="text-fg-muted">{project.problem}</dd>
            </div>
            <div>
              <dt className="mb-1.5 font-mono text-[11px] tracking-widest text-accent-2 uppercase">Solution</dt>
              <dd className="text-fg-muted">{project.solution}</dd>
            </div>
          </dl>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={detailsId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease }}
                className="overflow-hidden"
              >
                <dl className="grid gap-5 pt-5 text-sm leading-relaxed">
                  <div>
                    <dt className="mb-2 font-mono text-[11px] tracking-widest text-accent-2 uppercase">Key features</dt>
                    <dd>
                      <ul className="space-y-1.5 text-fg-muted">
                        {project.features.map((f) => (
                          <li key={f} className="flex gap-2.5">
                            <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent-2" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-1.5 font-mono text-[11px] tracking-widest text-accent-2 uppercase">
                      My contribution
                    </dt>
                    <dd className="text-fg-muted">{project.contribution}</dd>
                  </div>
                  {project.impact && (
                    <div>
                      <dt className="mb-1.5 font-mono text-[11px] tracking-widest text-accent-2 uppercase">Impact</dt>
                      <dd className="text-fg">{project.impact}</dd>
                    </div>
                  )}
                </dl>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={detailsId}
            className="relative z-10 mt-5 inline-flex min-h-10 items-center gap-1.5 self-start text-sm font-medium text-fg transition-colors hover:text-accent-2"
          >
            {open ? "Show less" : "Features & my role"}
            <ChevronDown
              className={cn("size-4 transition-transform duration-300", open && "rotate-180")}
              aria-hidden="true"
            />
          </button>

          <div className="mt-auto pt-6">
            <ul aria-label="Technologies" className="mb-6 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <li key={t}>
                  <Tag>{t}</Tag>
                </li>
              ))}
            </ul>
            <ProjectLinks project={project} />
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
