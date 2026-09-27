# Vaibhav Bandgar — Portfolio

A single-page developer portfolio built with Next.js (App Router), TypeScript, Tailwind CSS,
React Three Fiber and Motion. The hero features a procedural, interactive 3D "Neural Core"
scene; everything else is fast, accessible 2D.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the design and technical decisions.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also type-checks)
npm run lint
```

Requires Node.js 20.9+.

## Make it yours — all content lives in `src/data/`

You shouldn't need to touch any component to update the site.

| File                         | What it controls                                                      |
| ---------------------------- | --------------------------------------------------------------------- |
| `src/data/profile.ts`        | Name, headline, intro, email, résumé link, site URL, socials, About   |
| `src/data/skills.ts`         | Skill categories and the skills in each                               |
| `src/data/projects.ts`       | Projects: problem, solution, features, tech, your role, links, image  |
| `src/data/experience.ts`     | Internships, freelance, hackathons, open source                       |
| `src/data/education.ts`      | Degrees and schooling                                                  |
| `src/data/achievements.ts`   | Certifications, hackathons, awards, workshops                          |
| `public/resume.pdf`          | Your résumé (currently a placeholder)                                  |

Search the project for `TODO` to find every placeholder. In particular:

- **`profile.email`, LinkedIn URL, `siteUrl`, `location`** in `profile.ts`.
- **Projects**: the first entry (this site) is real; the others are templates.
- **Experience / Achievements**: the entries are templates. Delete anything you don't have —
  an empty list hides the section and its nav link automatically.
- **Project screenshots**: put a 1600×1000 image in `public/projects/` and set
  `image: "/projects/name.png"`. Without one, a generated cover is shown.

Authenticity rule: only add real projects, roles, results and credentials. `impact` on a project
is optional — leave it out rather than estimate.

## Optional configuration

Copy `.env.example` to `.env.local`:

- `GITHUB_TOKEN` — raises the GitHub API rate limit for the "Recently on GitHub" section
  (repos are fetched server-side and cached for an hour).
- `NEXT_PUBLIC_CONTACT_ENDPOINT` — a Formspree-style endpoint for the contact form. Without it,
  the form opens the visitor's email app with the message pre-filled.

## Deploy

Works out of the box on Vercel (or any Node host running `next start`). After deploying, set
`profile.siteUrl` to the real URL so canonical links, Open Graph and the sitemap are correct.
