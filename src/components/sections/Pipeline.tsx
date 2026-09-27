import { BrainCircuit, Database, Rocket, Sparkles, Wand2, type LucideIcon } from "lucide-react";
import { Fragment, type CSSProperties } from "react";
import { about } from "@/data";
import { Reveal } from "@/components/ui/Reveal";

const stageIcons: LucideIcon[] = [Database, Wand2, BrainCircuit, Rocket];

/**
 * Animated end-to-end workflow: data packets flow between stages and each
 * stage lights up in turn. Pure CSS animation — no JS per frame.
 */
export function Pipeline() {
  const stages = about.workflow;
  if (stages.length === 0) return null;
  const cycle = stages.length * 0.9;

  return (
    <Reveal className="mt-16 sm:mt-20">
      <h3 className="mb-6 font-mono text-xs tracking-widest text-fg-subtle uppercase">How I work, end to end</h3>
      <ol
        className="relative flex flex-col items-stretch gap-0 overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-900/60 p-4 sm:p-6 lg:flex-row lg:items-center"
        style={{ "--cycle": `${cycle}s` } as CSSProperties}
      >
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
        {stages.map((stage, i) => {
          const Icon = stageIcons[i] ?? Sparkles;
          return (
            <Fragment key={stage.label}>
              <li
                className="pipeline-stage relative flex flex-1 items-center gap-4 rounded-2xl border border-line bg-ink-850/90 p-4 lg:flex-col lg:items-start lg:gap-3"
                style={{ animationDelay: `${i * 0.9}s` }}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03]">
                  <Icon className="size-5 text-accent-2" aria-hidden="true" />
                </span>
                <span>
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-medium text-fg">{stage.label}</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-fg-muted">{stage.detail}</span>
                </span>
              </li>
              {i < stages.length - 1 && (
                <li
                  aria-hidden="true"
                  className="pipeline-link relative mx-auto h-8 w-px lg:mx-0 lg:h-px lg:w-auto lg:min-w-10 lg:flex-[0.35]"
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-accent/50 to-accent-2/50 lg:bg-gradient-to-r" />
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="pipeline-packet" style={{ animationDelay: `${i * 0.9 + d * 0.3}s` }} />
                  ))}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </Reveal>
  );
}
