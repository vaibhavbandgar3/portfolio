# Portfolio Architecture

This document is the Phase 1 plan the site was built against. It is kept in
the repo so future changes follow the same decisions.

## 1. Structure & user journey

A single page, ordered by what a recruiter needs to decide, fastest first:

| #   | Section      | Job it does                                                         |
| --- | ------------ | ------------------------------------------------------------------- |
| 1   | Hero         | Who I am, what I build, 3 CTAs (Projects / Contact / Resume)        |
| 2   | About        | Short story, interests, strengths, a few real highlights            |
| 3   | Skills       | Grouped, honest (no percentage bars)                                |
| 4   | Projects     | The strongest section: problem → solution → contribution → links    |
| 5   | Experience   | Internships, academic, freelance, hackathons, OSS — only real items |
| 6   | Education    | Timeline                                                            |
| 7   | Achievements | Certifications, hackathons, awards, workshops                       |
| 8   | GitHub       | Live recent public repos (server-fetched, cached for an hour)       |
| 9   | Contact      | Final CTA, direct links, simple form                                |

Navigation: fixed top bar with anchor links, active-section highlighting,
a scroll-progress hairline and a full-screen mobile menu. A skip link jumps
straight to `#main`.

Sections whose data file is empty (e.g. no certifications yet) are hidden
automatically, together with their nav link — the page never shows an
empty or invented section.

## 2. Visual direction

Dark, precise, technical. Near-black background (`#07080b`), off-white text,
blue → cyan accent with violet used only as a secondary hint. A fine grid and
a very light noise layer give texture; glass surfaces are used for the nav
and cards only. Typography: Geist Sans (UI + display, tight tracking) and
Geist Mono (labels, eyebrow text, metadata).

All tokens live in `src/app/globals.css` under `@theme`.

## 3. Code layout

```
src/
  app/                 routes, metadata, OG image, robots, sitemap, global CSS
  data/                ← ALL personal content. Edit these, not components.
  components/
    ui/                primitives (Button, Section, Tag, TiltCard, Reveal…)
    layout/            Navbar, Footer, ScrollProgress
    sections/          one file per page section
    three/             React Three Fiber scene (client-only, lazy-loaded)
  lib/                 utilities, GitHub fetcher, motion presets, hooks
```

Server Components by default; `"use client"` only where interaction or
animation needs it. Sections receive data by importing from `@/data`.

## 4. 3D strategy — "Neural Core"

An abstract network: a faceted core (the "model") inside a shell of nodes
laid out on a Fibonacci sphere, connected to their nearest neighbours (the
"graph"), with a sparse particle field around it (the "data"). It stands for
the software + data + AI positioning rather than being generic decoration.

- Mouse: the whole structure eases toward the pointer (damped, not 1:1).
- Scroll: the scene dims and the camera pulls back as the hero leaves view;
  rendering pauses entirely once it's off-screen.
- Mobile / low-power: fewer nodes and particles, lower DPR cap, no pointer
  tracking. `PerformanceMonitor` lowers DPR further if FPS drops.
- Reduced motion: a single static frame (`frameloop="demand"`).
- No WebGL: a CSS gradient fallback with the same silhouette.
- Loading: the canvas is `next/dynamic` with `ssr: false`, so it never
  blocks first paint; the CSS fallback shows until it mounts.

Elsewhere, 3D is expressed with CSS perspective (tilt on project cards) so the
page never runs more than one WebGL context.

## 5. Motion language

Built on `motion/react`. One easing curve (`[0.22, 1, 0.36, 1]`) and three
durations. Section headings and cards reveal once on scroll; the hero
headline reveals word-by-word; primary CTAs are magnetic on fine pointers.
`<MotionConfig reducedMotion="user">` disables transforms for users who ask.
GSAP was not needed — no timeline-heavy sequences exist.

## 6. Responsive strategy

Mobile-first Tailwind. On mobile the hero stacks text above a shorter 3D
stage, cards go single-column, tilt is disabled on touch, and the nav becomes
a full-screen sheet with 48px touch targets.

## 7. Performance, SEO, a11y

- 3D is code-split and client-only; DPR capped at 1.75.
- `next/font` self-hosts fonts; images via `next/image`.
- Metadata, Open Graph image (generated), robots, sitemap, JSON-LD `Person`.
- Semantic landmarks, one `h1`, labelled links/buttons, visible focus rings,
  skip link, keyboard-operable menu, AA contrast on all text tokens.
