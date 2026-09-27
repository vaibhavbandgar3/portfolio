import { Sparkles } from "lucide-react";
import { about, education, sectionIndex } from "@/data";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Pipeline } from "./Pipeline";

export function About() {
  const latest = education[0];

  return (
    <Section id="about" index={sectionIndex("about")} eyebrow="About" title="Curious builder, careful engineer.">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="space-y-5 text-lg leading-relaxed text-fg-muted lg:col-span-7">
          {about.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-fg" : undefined}>
              {p}
            </p>
          ))}

          {latest && (
            <p className="!mt-8 border-l-2 border-accent/60 pl-4 text-base">
              <span className="block font-mono text-xs tracking-widest text-fg-subtle uppercase">Education</span>
              <span className="text-fg">{latest.degree}</span> · {latest.institution}
            </p>
          )}

          <div className="!mt-8">
            <h3 className="mb-3 font-mono text-xs tracking-widest text-fg-subtle uppercase">I enjoy working on</h3>
            <ul className="flex flex-wrap gap-2">
              {about.interests.map((interest) => (
                <li
                  key={interest}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.02] px-3.5 py-1.5 text-sm text-fg"
                >
                  <Sparkles className="size-3.5 text-accent-2" aria-hidden="true" />
                  {interest}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="space-y-4 lg:col-span-5">
          {about.highlights.length > 0 && (
            <Reveal>
              <dl className="grid grid-cols-3 divide-x divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-900">
                {about.highlights.map((h) => (
                  <div key={h.label} className="flex flex-col-reverse gap-1 p-4 sm:p-5">
                    <dt className="font-mono text-[10px] tracking-widest text-fg-subtle uppercase sm:text-[11px]">
                      {h.label}
                    </dt>
                    <dd className="text-sm font-medium text-fg sm:text-base">{h.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          <RevealGroup as="ul" className="space-y-3">
            {about.strengths.map((s, i) => (
              <RevealItem
                as="li"
                key={s.title}
                className="group rounded-[var(--radius-card)] border border-line bg-ink-900/60 p-5 transition-colors duration-300 hover:border-line-strong hover:bg-ink-850"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-accent-2">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-medium text-fg">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-fg-muted">{s.description}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
      <Pipeline />
    </Section>
  );
}
