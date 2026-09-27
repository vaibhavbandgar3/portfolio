"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { skillGroups, sectionIndex } from "@/data";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SkillGlobe } from "./SkillGlobe";

/**
 * Grouped skills without proficiency bars. On large screens a category list
 * drives a focused detail panel; on small screens every group is a card.
 */
export function Skills() {
  const [activeId, setActiveId] = useState(skillGroups[0]?.id);
  const active = skillGroups.find((g) => g.id === activeId) ?? skillGroups[0];
  if (!active) return null;

  return (
    <Section
      id="skills"
      index={sectionIndex("skills")}
      eyebrow="Skills"
      title="The toolkit I work with."
      description="Grouped by what they help me do. I'd rather show where I've used a tool than rate myself with a percentage."
    >
      {/* Large screens: interactive category explorer */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-12">
        <div
          role="tablist"
          aria-label="Skill categories"
          aria-orientation="vertical"
          className="col-span-5 flex flex-col gap-1.5 self-start lg:sticky lg:top-28"
        >
          {skillGroups.map((group, i) => {
            const selected = group.id === active.id;
            const Icon = group.icon;
            return (
              <button
                key={group.id}
                role="tab"
                id={`tab-${group.id}`}
                aria-selected={selected}
                aria-controls={`panel-${group.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(group.id)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                  e.preventDefault();
                  const next = (i + (e.key === "ArrowDown" ? 1 : -1) + skillGroups.length) % skillGroups.length;
                  setActiveId(skillGroups[next].id);
                  document.getElementById(`tab-${skillGroups[next].id}`)?.focus();
                }}
                className={cn(
                  "relative flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors duration-300",
                  selected ? "text-fg" : "text-fg-muted hover:bg-white/[0.03] hover:text-fg",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="skill-tab"
                    className="ring-gradient absolute inset-0 rounded-2xl bg-ink-850"
                    transition={{ duration: 0.5, ease }}
                  />
                )}
                <Icon
                  className={cn("relative size-5", selected ? "text-accent-2" : "text-fg-subtle")}
                  aria-hidden="true"
                />
                <span className="relative flex-1 font-medium">{group.title}</span>
                <span className="relative font-mono text-xs text-fg-subtle">{group.skills.length}</span>
              </button>
            );
          })}
        </div>

        <div className="relative col-span-7 overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-900 p-8">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(34_211_238/0.12),transparent)]"
          />
          <SkillGlobe activeGroup={active.id} className="mx-auto -mt-4 max-w-[400px]" />
          <p
            aria-hidden="true"
            className="-mt-2 mb-6 text-center font-mono text-[11px] tracking-widest text-fg-subtle uppercase"
          >
            Drag to rotate
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              role="tabpanel"
              id={`panel-${active.id}`}
              aria-labelledby={`tab-${active.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
              className="relative border-t border-line pt-6"
            >
              <div className="flex items-center gap-3">
                <active.icon className="size-6 text-accent-2" aria-hidden="true" />
                <h3 className="text-xl font-semibold tracking-tight">{active.title}</h3>
              </div>
              <p className="mt-1.5 text-fg-muted">{active.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {active.skills.map((skill, i) => (
                  <motion.li
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease, delay: 0.05 + i * 0.03 }}
                    className="rounded-xl border border-line bg-white/[0.03] px-4 py-2.5 text-sm text-fg transition-colors hover:border-accent/50 hover:bg-accent/10"
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Small screens: globe, then all groups as cards */}
      <SkillGlobe className="mx-auto mb-8 max-w-[340px] lg:hidden" />
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {skillGroups.map((group) => (
          <RevealItem key={group.id} className="rounded-[var(--radius-card)] border border-line bg-ink-900 p-5">
            <div className="flex items-center gap-3">
              <group.icon className="size-5 text-accent-2" aria-hidden="true" />
              <h3 className="font-medium">{group.title}</h3>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-lg border border-line bg-white/[0.03] px-2.5 py-1 text-sm text-fg-muted"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
