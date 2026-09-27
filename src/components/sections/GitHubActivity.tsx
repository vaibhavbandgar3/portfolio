import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { profile, sectionIndex } from "@/data";
import { getRecentRepos } from "@/lib/github";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SocialIcon } from "@/components/ui/SocialIcon";

// A handful of common GitHub language colours; anything else gets the accent.
const languageColors: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Java: "#b07219",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#e34c26",
  CSS: "#663399",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
};

const dateFormat = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });

export async function GitHubActivity() {
  const username = profile.githubUsername;
  if (!username) return null;

  const repos = await getRecentRepos(username);
  const profileUrl = `https://github.com/${username}`;

  return (
    <Section
      id="github"
      index={sectionIndex("github")}
      eyebrow="GitHub"
      title="Recently on GitHub."
      description="Live from my public repositories — the most recently updated first."
    >
      {repos && repos.length > 0 ? (
        <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <RevealItem as="li" key={repo.name}>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-ink-900/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-ink-850"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-mono text-sm font-medium break-all text-fg">{repo.name}</h3>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-fg-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">
                  {repo.description ?? "No description yet."}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5 font-mono text-xs text-fg-subtle">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="size-2.5 rounded-full"
                        style={{ background: languageColors[repo.language] ?? "var(--color-accent)" }}
                      />
                      {repo.language}
                    </span>
                  )}
                  {repo.stars > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3.5" aria-hidden="true" />
                      {repo.stars}
                      <span className="sr-only">stars</span>
                    </span>
                  )}
                  {repo.forks > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="size-3.5" aria-hidden="true" />
                      {repo.forks}
                      <span className="sr-only">forks</span>
                    </span>
                  )}
                  <span className="ml-auto">
                    <time dateTime={repo.updatedAt}>{dateFormat.format(new Date(repo.updatedAt))}</time>
                  </span>
                </div>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      ) : (
        <p className="rounded-[var(--radius-card)] border border-dashed border-line p-8 text-center text-fg-muted">
          Repositories couldn&apos;t be loaded right now.
        </p>
      )}

      <p className="mt-8 text-center">
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm text-fg transition-colors hover:border-line-strong"
        >
          <SocialIcon platform="github" className="size-4" />
          View @{username} on GitHub
        </a>
      </p>
    </Section>
  );
}
