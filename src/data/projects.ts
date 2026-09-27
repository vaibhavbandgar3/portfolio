import type { Project } from "./types";

/**
 * Projects are the most important section. For each one, answer:
 *   problem → solution → key features → tech → YOUR contribution → real impact.
 *
 * `impact` is optional: leave it out unless you have a real, measured result.
 * `image` is optional: drop a 1600×1000 screenshot in /public/projects/ and
 * reference it as "/projects/your-file.png". Without it, a generated cover is used.
 *
 * Entries whose title starts with "Your" are templates — replace or delete them.
 */
export const projects: Project[] = [
  {
    slug: "portfolio",
    title: "Interactive 3D Portfolio",
    tagline: "This site — a fast, accessible portfolio with a real-time WebGL hero.",
    problem:
      "Most fresher portfolios are either static templates that look the same, or heavy 3D demos that are slow and hard to read.",
    solution:
      "A single-page Next.js site where all content lives in typed data files, with a lazy-loaded React Three Fiber scene that adapts to device power and respects reduced-motion settings.",
    features: [
      "Procedural 3D network scene with pointer and scroll interaction",
      "Adaptive quality: fewer particles on mobile, pauses when off-screen",
      "Content driven entirely from typed data files",
      "Live GitHub repositories fetched server-side and cached",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js", "React Three Fiber", "Motion"],
    contribution: "Designed and built end to end: architecture, visual design, 3D scene, animation and accessibility.",
    github: "https://github.com/vaibhavbandgar3/portfolio",
    featured: true,
    type: "Personal",
    year: "2026",
  },
  {
    slug: "project-two",
    title: "Your Data / ML Project",
    tagline: "TODO: one line on what it does and for whom.",
    problem: "TODO: What problem or question did this project address? Why did it matter?",
    solution: "TODO: How did you approach it? Which data, model or architecture did you choose, and why?",
    features: ["TODO: key capability #1", "TODO: key capability #2", "TODO: key capability #3"],
    tech: ["Python", "Pandas", "scikit-learn"],
    contribution: "TODO: What exactly did you build? If it was a team project, name your part.",
    // impact: "Only include a real, measured result.",
    github: "https://github.com/vaibhavbandgar3",
    featured: true,
    type: "Academic",
    year: "2025",
  },
  {
    slug: "project-three",
    title: "Your Web Application",
    tagline: "TODO: one line on what it does and for whom.",
    problem: "TODO: What problem did users have?",
    solution: "TODO: What did you build to solve it?",
    features: ["TODO: key capability #1", "TODO: key capability #2"],
    tech: ["React", "Node.js", "MongoDB"],
    contribution: "TODO: Your role and the parts you personally built.",
    github: "https://github.com/vaibhavbandgar3",
    type: "Personal",
    year: "2025",
  },
  {
    slug: "project-four",
    title: "Your Analytics Dashboard",
    tagline: "TODO: one line on what it does and for whom.",
    problem: "TODO: What decision did the data need to support?",
    solution: "TODO: How did you clean, model and present the data?",
    features: ["TODO: key capability #1", "TODO: key capability #2"],
    tech: ["SQL", "Power BI", "Excel"],
    contribution: "TODO: Your role and the parts you personally built.",
    type: "Academic",
    year: "2024",
  },
];
