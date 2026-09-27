import { ArrowUpRight } from "lucide-react";
import { profile, projects, sectionIndex } from "@/data";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Section
      id="projects"
      index={sectionIndex("projects")}
      eyebrow="Projects"
      title="Selected work."
      description="Each project starts from a real problem. Expand a card to see the features and exactly what I built."
    >
      {featured.length > 0 && (
        <RevealGroup className="grid gap-6 lg:grid-cols-2">
          {featured.map((project, i) => (
            <RevealItem key={project.slug}>
              <ProjectCard project={project} index={i} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}

      {rest.length > 0 && (
        <RevealGroup className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, i) => (
            <RevealItem key={project.slug}>
              <ProjectCard project={project} index={featured.length + i} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}

      {profile.githubUsername && (
        <p className="mt-10 text-center">
          <a
            href={`https://github.com/${profile.githubUsername}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            More on GitHub
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </p>
      )}
    </Section>
  );
}
