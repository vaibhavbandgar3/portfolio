import { ArrowUpRight, MapPin } from "lucide-react";
import { experience, sectionIndex } from "@/data";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";

export function Experience() {
  if (experience.length === 0) return null;

  return (
    <Section
      id="experience"
      index={sectionIndex("experience")}
      eyebrow="Experience"
      title="Practical work."
      description="Internships, freelance work, hackathons and open-source — places where I've applied what I know."
    >
      <RevealGroup
        as="ol"
        className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-gradient-to-b before:from-accent/60 before:via-line before:to-transparent sm:before:left-[11px]"
      >
        {experience.map((item) => (
          <RevealItem as="li" key={`${item.organization}-${item.role}`} className="relative pl-8 sm:pl-12">
            <span
              aria-hidden="true"
              className="absolute top-2 left-0 grid size-[15px] place-items-center rounded-full border border-accent/60 bg-ink-950 sm:size-[23px]"
            >
              <span className="size-1.5 rounded-full bg-accent-2 sm:size-2" />
            </span>

            <article className="rounded-[var(--radius-card)] border border-line bg-ink-900/70 p-6 transition-colors duration-300 hover:border-line-strong sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{item.role}</h3>
                  <p className="text-fg-muted">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-fg"
                      >
                        {item.organization}
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      item.organization
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-1.5 sm:items-end">
                  <Tag className="text-accent-2">{item.kind}</Tag>
                  <p className="font-mono text-xs text-fg-subtle">{item.period}</p>
                </div>
              </div>

              {item.location && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-fg-subtle">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {item.location}
                </p>
              )}

              <p className="mt-4 text-fg-muted">{item.summary}</p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-fg-muted">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent-2" />
                    {point}
                  </li>
                ))}
              </ul>
              {item.tech && item.tech.length > 0 && (
                <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-1.5">
                  {item.tech.map((t) => (
                    <li key={t}>
                      <Tag>{t}</Tag>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
