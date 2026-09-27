import "server-only";

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
}

interface GitHubRepoResponse {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

/**
 * Most recently pushed public, non-fork repositories for a user.
 * Cached for an hour. Returns `null` on any failure so the section can fall
 * back to a plain link instead of breaking the page.
 *
 * Set GITHUB_TOKEN (read-only, no scopes) to raise the API rate limit.
 */
export async function getRecentRepos(username: string, limit = 6): Promise<Repo[] | null> {
  if (!username) return null;

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=30&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as GitHubRepoResponse[];
    return data
      .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== username.toLowerCase())
      .slice(0, limit)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        homepage: r.homepage || null,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        topics: r.topics ?? [],
        updatedAt: r.pushed_at,
      }));
  } catch {
    return null;
  }
}
