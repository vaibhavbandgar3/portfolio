import { GraduationCap } from "lucide-react";
import { education, sectionIndex } from "@/data";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Education() {
  if (education.length === 0) return null;

  return (
    <Section
      id="education"
      index={sectionIndex("education")}
      eyebrow="Education"
      title="Where I learned the fundamentals."
    >
      <RevealGroup as="ol" className="grid gap-4 md:grid-cols-2">
        {education.map((item, i) => (
          <RevealItem
            as="li"
            key={`${item.institution}-${item.period}`}
            className={
              i === 0
                ? "ring-gradient rounded-[var(--radius-card)] bg-ink-850 p-6 sm:p-7 md:col-span-2"
                : "rounded-[var(--radius-card)] border border-line bg-ink-900/70 p-6 sm:p-7"
            }
          >
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03]">
                <GraduationCap className="size-5 text-accent-2" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-semibold tracking-tight">{item.degree}</h3>
                  <p className="font-mono text-xs text-fg-subtle">{item.period}</p>
                </div>
                <p className="mt-0.5 text-fg-muted">
                  {item.institution}
                  {item.location && <span className="text-fg-subtle"> · {item.location}</span>}
                </p>
                {item.score && <p className="mt-3 text-sm font-medium text-fg">{item.score}</p>}
                {item.details && item.details.length > 0 && (
                  <ul className="mt-4 space-y-1.5 text-sm text-fg-muted">
                    {item.details.map((d) => (
                      <li key={d} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent-2" />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
