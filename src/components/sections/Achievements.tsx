import { Award, BadgeCheck, BookOpen, ExternalLink, Presentation, Trophy, type LucideIcon } from "lucide-react";
import { achievements, type AchievementKind, sectionIndex } from "@/data";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const icons: Record<AchievementKind, LucideIcon> = {
  Certification: BadgeCheck,
  Hackathon: Trophy,
  Award: Award,
  Workshop: Presentation,
  Publication: BookOpen,
};

export function Achievements() {
  if (achievements.length === 0) return null;

  return (
    <Section
      id="achievements"
      index={sectionIndex("achievements")}
      eyebrow="Certifications & Achievements"
      title="Learning, verified."
    >
      <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => {
          const Icon = icons[a.kind];
          return (
            <RevealItem
              as="li"
              key={`${a.title}-${a.date}`}
              className="group relative flex flex-col rounded-[var(--radius-card)] border border-line bg-ink-900/70 p-6 transition-colors duration-300 hover:border-line-strong hover:bg-ink-850"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl border border-line bg-white/[0.03]">
                  <Icon className="size-5 text-accent-2" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs text-fg-subtle">{a.date}</span>
              </div>
              <p className="mt-5 font-mono text-[11px] tracking-widest text-accent-2 uppercase">{a.kind}</p>
              <h3 className="mt-1 font-semibold tracking-tight">{a.title}</h3>
              <p className="text-sm text-fg-muted">{a.issuer}</p>
              {a.description && <p className="mt-3 text-sm leading-relaxed text-fg-muted">{a.description}</p>}
              {a.link && (
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex min-h-10 items-center gap-1.5 pt-4 text-sm text-fg transition-colors hover:text-accent-2"
                >
                  Verify credential
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">for {a.title}</span>
                </a>
              )}
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
