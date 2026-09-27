import type { About, Profile, SocialLink } from "./types";

/**
 * ─────────────────────────────────────────────────────────────
 *  YOUR DETAILS
 *  Everything in this folder (src/data) is the site's content.
 *  Replace every value marked TODO with your own information.
 * ─────────────────────────────────────────────────────────────
 */

export const profile: Profile = {
  name: "Vaibhav Bandgar",
  shortName: "Vaibhav",
  headline: "Software, Data & AI Developer",
  intro:
    // TODO: rewrite in your own voice — 1–2 sentences.
    "I'm a fresher who enjoys turning messy problems into clean software — from full-stack web apps to data pipelines and machine-learning experiments. I care about building things that are useful, understandable and well made.",
  availability: "Open to entry-level roles & internships",
  location: "India", // TODO: e.g. "Pune, India"
  email: "your.email@example.com", // TODO
  resumeUrl: "/resume.pdf", // TODO: replace public/resume.pdf with your résumé
  siteUrl: "https://your-portfolio.vercel.app", // TODO: your deployed URL
  githubUsername: "vaibhavbandgar3",
  focusAreas: ["Software Development", "Data Analytics", "Machine Learning", "Web Applications"],
  keywords: [
    "Vaibhav Bandgar",
    "software developer",
    "data analyst",
    "machine learning",
    "fresher",
    "portfolio",
    "Next.js",
    "Python",
  ],
};

export const socials: SocialLink[] = [
  {
    platform: "github",
    label: "GitHub",
    href: `https://github.com/${profile.githubUsername}`,
    handle: `@${profile.githubUsername}`,
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/your-profile", // TODO
    handle: "in/your-profile", // TODO
  },
  {
    platform: "email",
    label: "Email",
    href: `mailto:${profile.email}`,
    handle: profile.email,
  },
];

export const about: About = {
  // TODO: replace with your own story. Keep it short: who you are, what you like building, what you want next.
  paragraphs: [
    "I'm a recent graduate who likes working where software meets data. I enjoy the full path — understanding a problem, shaping the data, building the interface, and shipping something people can actually use.",
    "Right now I'm focused on strengthening my fundamentals in software engineering, analytics and machine learning, and I'm looking for a team where I can learn quickly and contribute from day one.",
  ],
  interests: [
    "Full-stack web development",
    "Data analysis & visualisation",
    "Applied machine learning",
    "Automation & developer tooling",
  ],
  strengths: [
    {
      title: "Fast learner",
      description: "Comfortable picking up a new language, library or domain and getting productive quickly.",
    },
    {
      title: "Problem first",
      description: "I start from the question being asked, then choose the simplest tool that answers it.",
    },
    {
      title: "Clear communicator",
      description: "I document what I build and explain technical decisions in plain language.",
    },
  ],
  // TODO: only real, verifiable facts. Remove any you can't back up. Examples:
  // { label: "Projects shipped", value: "6" }, { label: "Degree", value: "B.E. Computer Engg." }
  highlights: [
    { label: "Focus", value: "Software · Data · AI" },
    { label: "Status", value: "Fresher, 2025" }, // TODO: graduation year
    { label: "Based in", value: "India" }, // TODO
  ],
};
