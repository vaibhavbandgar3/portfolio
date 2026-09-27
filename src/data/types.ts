import type { LucideIcon } from "lucide-react";

export type SocialPlatform = "github" | "linkedin" | "email" | "x" | "kaggle" | "leetcode" | "website";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
  /** Shown in the contact section, e.g. "@username". */
  handle?: string;
}

export interface Profile {
  name: string;
  /** Short name used in the nav logo and footer. */
  shortName: string;
  headline: string;
  /** One-paragraph intro shown in the hero. */
  intro: string;
  /** Short status line, e.g. "Open to entry-level roles". */
  availability: string;
  location: string;
  email: string;
  /** Path under /public or an absolute URL. */
  resumeUrl: string;
  /** Production URL, used for metadata, OG and sitemap. No trailing slash. */
  siteUrl: string;
  /** GitHub username for the live repositories section. Leave empty to hide it. */
  githubUsername: string;
  /** Focus areas shown as chips in the hero. */
  focusAreas: string[];
  /** Phrases cycled in the hero's terminal line: "$ building <phrase>". */
  building: string[];
  keywords: string[];
}

export interface About {
  paragraphs: string[];
  /** Stages of how you work end to end, shown as an animated pipeline. 3–5 short items. */
  workflow: { label: string; detail: string }[];
  interests: string[];
  strengths: { title: string; description: string }[];
  /** Only real, verifiable highlights. */
  highlights: { label: string; value: string }[];
}

export interface SkillGroup {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  skills: string[];
}

export interface Project {
  slug: string;
  title: string;
  /** One-line summary shown on the card. */
  tagline: string;
  problem: string;
  solution: string;
  features: string[];
  tech: string[];
  /** What you personally did. Required — recruiters look for this. */
  contribution: string;
  /** Only real, measured outcomes. Omit if you don't have any. */
  impact?: string;
  github?: string;
  demo?: string;
  /** Path under /public, ideally 1600×1000. Optional — a generated cover is used otherwise. */
  image?: string;
  /** Featured projects get a larger card. */
  featured?: boolean;
  /** e.g. "Academic", "Personal", "Hackathon" */
  type: string;
  year: string;
}

export type ExperienceKind = "Internship" | "Freelance" | "Hackathon" | "Open Source" | "Academic" | "Volunteer";

export interface Experience {
  role: string;
  organization: string;
  kind: ExperienceKind;
  period: string;
  location?: string;
  summary: string;
  points: string[];
  tech?: string[];
  link?: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location?: string;
  /** e.g. "CGPA 8.4 / 10" — only if you want to show it. */
  score?: string;
  details?: string[];
}

export type AchievementKind = "Certification" | "Hackathon" | "Award" | "Workshop" | "Publication";

export interface Achievement {
  title: string;
  issuer: string;
  kind: AchievementKind;
  date: string;
  description?: string;
  /** Verification / credential URL. */
  link?: string;
}

export interface NavItem {
  id: string;
  label: string;
}
